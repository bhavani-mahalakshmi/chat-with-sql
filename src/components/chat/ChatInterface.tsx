
"use client";

import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChatMessage as ChatMessageComponent } from "./ChatMessage";
import type { ChatMessage, UnderstandQueryOutput as AIUnderstandQueryOutput, GenerateSQLOutput as AIGenerateSQLOutput, GetDatabaseSchemaOutput } from "@/lib/types";
import { understandQuery } from "@/ai/flows/understand-query";
import { generateSQL } from "@/ai/flows/generate-sql";
import { getDatabaseSchema } from "@/ai/flows/get-database-schema";
import { useToast } from "@/hooks/use-toast";
import { DataVisualizer } from "@/components/data-viz/DataVisualizer";
import { Loader2, Send, Database, AlertTriangle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Mock data for demonstration
const mockSalesDataBar = [
  { name: "Jan", value: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Feb", value: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Mar", value: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Apr", value: Math.floor(Math.random() * 5000) + 1000 },
];

const mockCategoryDataPie = [
  { name: "Electronics", value: 400, fill: "hsl(var(--chart-1))" },
  { name: "Clothing", value: 300, fill: "hsl(var(--chart-2))"  },
  { name: "Groceries", value: 200, fill: "hsl(var(--chart-3))"  },
  { name: "Books", value: 278, fill: "hsl(var(--chart-4))"  },
];

const mockUserDataTable = [
  { id: 1, name: "Alice Wonderland", email: "alice@example.com", country: "USA" },
  { id: 2, name: "Bob The Builder", email: "bob@example.com", country: "Canada" },
  { id: 3, name: "Charlie Chaplin", email: "charlie@example.com", country: "UK" },
];

const mockSingleValue = "Total active users: 1,234";


export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [dbSchema, setDbSchema] = useState("");
  const [dbUri, setDbUri] = useState("");
  const [schemaInputMethod, setSchemaInputMethod] = useState<'manual' | 'uri'>('manual');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingSchema, setIsFetchingSchema] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const addMessage = (sender: ChatMessage['sender'], content: ChatMessage['content'], queryDetails?: string, sqlQuery?: string, data?: any) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: String(Date.now()), sender, content, timestamp: new Date(), queryDetails, sqlQuery, data },
    ]);
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    const userMessageContent = inputValue;
    addMessage("user", userMessageContent);
    setInputValue("");
    setIsLoading(true);

    try {
      const understandOutput: AIUnderstandQueryOutput = await understandQuery({ query: userMessageContent });

      let currentDbSchema = dbSchema;

      if (understandOutput.isDataRequest) {
        if (schemaInputMethod === 'uri') {
          if (!dbUri.trim()) {
            addMessage("ai", "Please provide a database URI to fetch the schema.");
            setIsLoading(false);
            return;
          }
          addMessage("ai", `Fetching schema from URI: ${dbUri}...`);
          setIsFetchingSchema(true);
          try {
            const schemaOutput: GetDatabaseSchemaOutput = await getDatabaseSchema({ uri: dbUri });
            currentDbSchema = schemaOutput.schema;
            setDbSchema(currentDbSchema); // Update textarea with fetched schema for visibility
            addMessage("ai", "Successfully fetched schema from URI.");
          } catch (schemaError) {
            console.error("Schema Fetch Error:", schemaError);
            const schemaErrorMessage = schemaError instanceof Error ? schemaError.message : "Could not fetch schema from URI.";
            toast({
              title: "Schema Error",
              description: schemaErrorMessage,
              variant: "destructive",
            });
            addMessage("ai", (
              <Alert variant="destructive" className="bg-destructive/10">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <AlertTitle className="text-destructive">Schema Fetch Failed</AlertTitle>
                <AlertDescription className="text-destructive/80">
                  {schemaErrorMessage} Please check the URI or provide schema manually.
                </AlertDescription>
              </Alert>
            ));
            setIsFetchingSchema(false);
            setIsLoading(false);
            return;
          } finally {
            setIsFetchingSchema(false);
          }
        } else { // Manual input
          if (!dbSchema.trim()) {
            addMessage("ai", "It looks like you're asking for data. Please provide the database schema in the section above or select URI input.");
            setIsLoading(false);
            return;
          }
        }
        
        if (!currentDbSchema.trim()) {
             addMessage("ai", "Database schema is missing. Please provide it either manually or via URI.");
             setIsLoading(false);
             return;
        }

        addMessage("ai", `Understood. You're looking for information about: "${understandOutput.queryDetails || userMessageContent}". I'll generate an SQL query based on your schema.`);

        const sqlOutput: AIGenerateSQLOutput = await generateSQL({
          question: understandOutput.queryDetails || userMessageContent,
          databaseSchema: currentDbSchema,
        });
        
        let mockData: any;
        const lowerQuery = (understandOutput.queryDetails || userMessageContent).toLowerCase();
        if (lowerQuery.includes("pie") || lowerQuery.includes("category") || lowerQuery.includes("distribution")) {
          mockData = mockCategoryDataPie;
        } else if (lowerQuery.includes("user") || lowerQuery.includes("customer") || lowerQuery.includes("table")) {
          mockData = mockUserDataTable;
        } else if (lowerQuery.includes("total") || lowerQuery.includes("count") || lowerQuery.includes("single value")) {
          mockData = mockSingleValue;
        }
        else { 
          mockData = mockSalesDataBar;
        }

        addMessage(
          "ai",
          <DataVisualizer data={mockData} queryDetails={understandOutput.queryDetails} sqlQuery={sqlOutput.sqlQuery} />,
          understandOutput.queryDetails,
          sqlOutput.sqlQuery,
          mockData
        );
      } else {
        addMessage("ai", `I've understood your query: "${userMessageContent}". It seems like a general question. While I'm best at data tasks, I can try to help! How can I assist you further with this?`);
      }
    } catch (error) {
      console.error("AI Error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({
        title: "Error",
        description: `Failed to process your request: ${errorMessage}`,
        variant: "destructive",
      });
      addMessage("ai", (
        <Alert variant="destructive" className="bg-destructive/10">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <AlertTitle className="text-destructive">Processing Error</AlertTitle>
          <AlertDescription className="text-destructive/80">
            I encountered an issue trying to process your request. Please try rephrasing or check the schema.
            <br />Details: {errorMessage}
          </AlertDescription>
        </Alert>
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background rounded-lg shadow-xl border">
       <Accordion type="single" collapsible className="px-4 border-b" defaultValue="db-schema">
        <AccordionItem value="db-schema">
          <AccordionTrigger className="text-sm font-medium hover:no-underline">
            <div className="flex items-center gap-2">
              <Database size={18} className="text-primary"/>
              Database Schema (Required for data queries)
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <div className="space-y-4">
              <RadioGroup 
                value={schemaInputMethod} 
                onValueChange={(value: string) => setSchemaInputMethod(value as 'manual' | 'uri')} 
                className="flex space-x-4 mb-3"
                disabled={isLoading || isFetchingSchema}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="manual" id="schema-manual" />
                  <Label htmlFor="schema-manual">Manual Input</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="uri" id="schema-uri" />
                  <Label htmlFor="schema-uri">Database URI</Label>
                </div>
              </RadioGroup>

              {schemaInputMethod === 'manual' && (
                <div>
                  <Textarea
                    placeholder="Paste your database schema here (e.g., CREATE TABLE users (...), CREATE TABLE products (...))"
                    value={dbSchema}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDbSchema(e.target.value)}
                    className="min-h-[100px] text-sm focus:ring-accent focus:border-accent font-mono"
                    rows={5}
                    disabled={isLoading || isFetchingSchema}
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Providing an accurate schema helps me generate correct SQL queries.
                  </p>
                </div>
              )}

              {schemaInputMethod === 'uri' && (
                <div>
                  <Input
                    type="text"
                    placeholder="Enter database URI (e.g., postgresql://user:pass@host:port/db)"
                    value={dbUri}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setDbUri(e.target.value)}
                    className="text-sm focus:ring-accent focus:border-accent font-mono"
                    disabled={isLoading || isFetchingSchema}
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    I will attempt to fetch the schema from this URI. (Current: Mock implementation)
                  </p>
                  {isFetchingSchema && (
                    <div className="flex items-center mt-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin text-primary" />
                      Fetching schema...
                    </div>
                  )}
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <ChatMessageComponent
              key={msg.id}
              sender={msg.sender}
              content={msg.content}
              timestamp={msg.timestamp}
            />
          ))}
          {isLoading && !isFetchingSchema && messages[messages.length-1]?.sender === 'user' && ( // Show "AI is thinking" only if not fetching schema and last message was user
            <div className="flex justify-start items-center gap-3 mb-4">
               <Loader2 className="h-8 w-8 animate-spin text-primary" />
               <p className="text-sm text-muted-foreground">AI is thinking...</p>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t p-4 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Ask about your data or chat..."
            value={inputValue}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !isLoading && !isFetchingSchema && handleSendMessage()}
            className="flex-grow focus:ring-accent focus:border-accent text-base"
            disabled={isLoading || isFetchingSchema}
          />
          <Button onClick={handleSendMessage} disabled={isLoading || isFetchingSchema || inputValue.trim() === ""} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            {(isLoading || isFetchingSchema) ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
