import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  Send,
  Paperclip,
  Code,
  Zap,
  MoreHorizontal,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Clipboard,
  Bot,
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "agent";
  timestamp: Date;
  agentId?: string;
  agentName?: string;
  agentAvatar?: string;
  codeBlocks?: { language: string; code: string }[];
  status?: "sending" | "sent" | "error";
}

interface ChatInterfaceProps {
  activeAgentId?: string;
  activeAgentName?: string;
  activeAgentAvatar?: string;
  messages?: Message[];
  onSendMessage?: (message: string) => void;
  onRequestCodeExecution?: (code: string) => void;
  isTyping?: boolean;
  onFeedback?: (messageId: string, isPositive: boolean) => void;
}

const ChatInterface = ({
  activeAgentId = "1",
  activeAgentName = "Engineer Agent",
  activeAgentAvatar = "",
  messages = [
    {
      id: "1",
      content:
        "Hello! I'm your AI Engineer Agent. How can I help you with your project today?",
      sender: "agent",
      timestamp: new Date(Date.now() - 3600000),
      agentId: "1",
      agentName: "Engineer Agent",
      agentAvatar: "",
    },
    {
      id: "2",
      content:
        "I need help setting up a React project with TypeScript and Tailwind CSS.",
      sender: "user",
      timestamp: new Date(Date.now() - 1800000),
    },
    {
      id: "3",
      content:
        "Sure, I can help with that! Let's start by creating a new project using Create React App with the TypeScript template. Here's the command you'll need to run:",
      sender: "agent",
      timestamp: new Date(Date.now() - 1700000),
      agentId: "1",
      agentName: "Engineer Agent",
      agentAvatar: "",
      codeBlocks: [
        {
          language: "bash",
          code: "npx create-react-app my-app --template typescript",
        },
      ],
    },
  ],
  onSendMessage = () => {},
  onRequestCodeExecution = () => {},
  isTyping = false,
  onFeedback = () => {},
}: ChatInterfaceProps) => {
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText("");
      // Focus back on textarea after sending
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Function to detect and format code blocks in messages
  const formatMessageContent = (content: string) => {
    // Simple regex to detect code blocks (text between ``` markers)
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        // Extract code and language
        const codeContent = part.slice(3, -3).trim();
        const firstLineEnd = codeContent.indexOf("\n");
        const language =
          firstLineEnd > 0 ? codeContent.slice(0, firstLineEnd).trim() : "";
        const code =
          firstLineEnd > 0 ? codeContent.slice(firstLineEnd + 1) : codeContent;

        return (
          <div key={index} className="my-2 relative">
            <div className="bg-slate-800 text-slate-100 rounded-md p-3 overflow-x-auto">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-slate-400">
                  {language || "code"}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-slate-400 hover:text-slate-100"
                  onClick={() => navigator.clipboard.writeText(code)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <pre className="text-sm">
                <code>{code}</code>
              </pre>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-1 text-xs flex items-center gap-1"
              onClick={() => onRequestCodeExecution(code)}
            >
              <Zap className="h-3 w-3" /> Run in Terminal
            </Button>
          </div>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <Card className="flex flex-col h-full bg-white border-0 rounded-none">
      <CardHeader className="px-4 py-3 border-b">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage
              src={
                activeAgentAvatar ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeAgentName}`
              }
              alt={activeAgentName}
            />
            <AvatarFallback>
              {activeAgentName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-base font-medium">
            {activeAgentName}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-0 overflow-hidden">
        <ScrollArea className="h-full w-full p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.sender === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg p-3",
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted",
                  )}
                >
                  {message.sender === "agent" && (
                    <div className="flex items-center mb-1">
                      <Avatar className="h-5 w-5 mr-1">
                        <AvatarImage
                          src={
                            message.agentAvatar ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${message.agentName}`
                          }
                          alt={message.agentName}
                        />
                        <AvatarFallback className="text-[8px]">
                          {message.agentName?.substring(0, 2).toUpperCase() ||
                            "AG"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium">
                        {message.agentName}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  )}

                  <div className="text-sm">
                    {message.codeBlocks
                      ? formatMessageContent(message.content)
                      : message.content}
                  </div>

                  {message.sender === "agent" && (
                    <div className="flex items-center justify-end mt-1 space-x-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => onFeedback(message.id, true)}
                            >
                              <ThumbsUp className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>This was helpful</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => onFeedback(message.id, false)}
                            >
                              <ThumbsDown className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>This wasn't helpful</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() =>
                                navigator.clipboard.writeText(message.content)
                              }
                            >
                              <Clipboard className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copy message</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted max-w-[80%] rounded-lg p-3">
                  <div className="flex items-center">
                    <Avatar className="h-5 w-5 mr-1">
                      <AvatarImage
                        src={
                          activeAgentAvatar ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeAgentName}`
                        }
                        alt={activeAgentName}
                      />
                      <AvatarFallback className="text-[8px]">
                        {activeAgentName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium">
                      {activeAgentName}
                    </span>
                  </div>
                  <div className="mt-1 flex space-x-1">
                    <div
                      className="h-2 w-2 rounded-full bg-slate-400 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 rounded-full bg-slate-400 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 rounded-full bg-slate-400 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <Separator />
      <CardFooter className="p-3">
        <div className="flex w-full items-end gap-2">
          <Button variant="outline" size="icon" className="flex-shrink-0">
            <Paperclip className="h-4 w-4" />
          </Button>
          <div className="relative flex-grow">
            <Textarea
              ref={textareaRef}
              placeholder="Type your message..."
              className="min-h-[60px] w-full resize-none pr-10"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 bottom-2"
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" size="icon" className="flex-shrink-0">
            <Code className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChatInterface;
