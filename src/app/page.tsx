import { ChatInterface } from "@/components/chat/ChatInterface";
import { Logo } from "@/components/icons/Logo";

export default function HomePage() {
  return (
    <div className="flex flex-col h-screen bg-secondary">
      <header className="bg-primary text-primary-foreground p-4 shadow-md flex items-center gap-3">
        <Logo className="h-8 w-8" />
        <h1 className="text-2xl font-semibold">DataChat Wiz</h1>
      </header>
      
      <main className="flex-grow container mx-auto py-6 px-4 overflow-hidden">
        <ChatInterface />
      </main>

      <footer className="text-center p-4 text-sm text-muted-foreground border-t bg-background">
        &copy; {new Date().getFullYear()} DataChat Wiz. Powered by AI.
      </footer>
    </div>
  );
}
