"use client";

import type { ReactNode } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { MessageSender } from '@/lib/types';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  sender: MessageSender;
  content: ReactNode;
  timestamp: Date;
}

export function ChatMessage({ sender, content, timestamp }: ChatMessageProps) {
  const isUser = sender === 'user';

  return (
    <div
      className={cn(
        "flex items-start gap-3 mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 border border-primary/20">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Bot size={20} />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-[75%] rounded-lg p-3 shadow-md",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-card text-card-foreground rounded-bl-none border"
        )}
      >
        {typeof content === 'string' ? <p className="text-sm whitespace-pre-wrap">{content}</p> : content}
        <p className={cn(
            "text-xs mt-1.5",
            isUser ? "text-primary-foreground/70 text-right" : "text-muted-foreground text-left"
          )}>
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      {isUser && (
         <Avatar className="h-8 w-8 border border-accent/20">
           <AvatarFallback className="bg-accent text-accent-foreground">
             <User size={20} />
           </AvatarFallback>
         </Avatar>
      )}
    </div>
  );
}
