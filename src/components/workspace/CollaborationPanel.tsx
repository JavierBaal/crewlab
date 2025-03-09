import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Users,
  MessageSquare,
  PlusCircle,
  UserPlus,
  X,
  Check,
  Clock,
  AlertCircle,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: "idle" | "active" | "busy";
}

interface CollaborationSession {
  id: string;
  title: string;
  description: string;
  status: "active" | "pending" | "completed";
  createdAt: Date;
  agents: Agent[];
  messages: CollaborationMessage[];
}

interface CollaborationMessage {
  id: string;
  content: string;
  agentId: string;
  agentName: string;
  agentAvatar: string;
  timestamp: Date;
  type: "message" | "action" | "solution";
}

interface CollaborationPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
  activeSession?: CollaborationSession;
  availableAgents?: Agent[];
  onCreateSession?: (
    title: string,
    description: string,
    agentIds: string[],
  ) => void;
  onSendMessage?: (sessionId: string, message: string) => void;
}

const CollaborationPanel = ({
  isOpen = true,
  onClose = () => {},
  activeSession = {
    id: "1",
    title: "Project Architecture Discussion",
    description:
      "Collaborative session to design the system architecture for the new project",
    status: "active",
    createdAt: new Date(Date.now() - 3600000),
    agents: [
      {
        id: "1",
        name: "Engineer Agent",
        role: "Software Engineer",
        avatar: "",
        status: "active",
      },
      {
        id: "2",
        name: "Architect Agent",
        role: "System Architect",
        avatar: "",
        status: "active",
      },
    ],
    messages: [
      {
        id: "1",
        content:
          "I've analyzed the requirements and suggest we use a microservices architecture for better scalability.",
        agentId: "2",
        agentName: "Architect Agent",
        agentAvatar: "",
        timestamp: new Date(Date.now() - 3000000),
        type: "message",
      },
      {
        id: "2",
        content:
          "That makes sense. For the frontend, we should consider using Next.js with React for better performance and SEO.",
        agentId: "1",
        agentName: "Engineer Agent",
        agentAvatar: "",
        timestamp: new Date(Date.now() - 2700000),
        type: "message",
      },
      {
        id: "3",
        content: "Architect Agent has created a system diagram",
        agentId: "2",
        agentName: "Architect Agent",
        agentAvatar: "",
        timestamp: new Date(Date.now() - 2400000),
        type: "action",
      },
      {
        id: "4",
        content:
          "Based on our discussion, I recommend the following architecture:\n\n1. Frontend: Next.js with React\n2. API Layer: Express.js with GraphQL\n3. Microservices: Node.js services for different domains\n4. Database: MongoDB for flexibility\n5. Caching: Redis for performance\n\nThis architecture will provide the scalability and performance needed for the project requirements.",
        agentId: "2",
        agentName: "Architect Agent",
        agentAvatar: "",
        timestamp: new Date(Date.now() - 1800000),
        type: "solution",
      },
    ],
  },
  availableAgents = [
    {
      id: "1",
      name: "Engineer Agent",
      role: "Software Engineer",
      avatar: "",
      status: "active",
    },
    {
      id: "2",
      name: "Architect Agent",
      role: "System Architect",
      avatar: "",
      status: "active",
    },
    {
      id: "3",
      name: "Data Analyst",
      role: "Data Analyst",
      avatar: "",
      status: "idle",
    },
    {
      id: "4",
      name: "DevOps Agent",
      role: "DevOps Engineer",
      avatar: "",
      status: "busy",
    },
  ],
  onCreateSession = () => {},
  onSendMessage = () => {},
}: CollaborationPanelProps) => {
  const [activeTab, setActiveTab] = useState<string>("discussion");
  const [showNewSessionDialog, setShowNewSessionDialog] =
    useState<boolean>(false);
  const [newSessionTitle, setNewSessionTitle] = useState<string>("");
  const [newSessionDescription, setNewSessionDescription] =
    useState<string>("");
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  const handleCreateSession = () => {
    if (newSessionTitle.trim() && selectedAgentIds.length > 0) {
      onCreateSession(newSessionTitle, newSessionDescription, selectedAgentIds);
      setShowNewSessionDialog(false);
      setNewSessionTitle("");
      setNewSessionDescription("");
      setSelectedAgentIds([]);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && activeSession) {
      onSendMessage(activeSession.id, newMessage);
      setNewMessage("");
    }
  };

  const toggleAgentSelection = (agentId: string) => {
    if (selectedAgentIds.includes(agentId)) {
      setSelectedAgentIds(selectedAgentIds.filter((id) => id !== agentId));
    } else {
      setSelectedAgentIds([...selectedAgentIds, agentId]);
    }
  };

  const getStatusColor = (status: string) => {
    const statusMap = {
      active: "bg-green-100 text-green-800 border-green-300",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      completed: "bg-blue-100 text-blue-800 border-blue-300",
    };

    return (
      statusMap[status as keyof typeof statusMap] ||
      "bg-gray-100 text-gray-800 border-gray-300"
    );
  };

  const getMessageTypeStyles = (type: string) => {
    const typeMap = {
      message: "",
      action: "bg-blue-50 border-l-4 border-blue-500 pl-3",
      solution: "bg-green-50 border-l-4 border-green-500 pl-3 font-medium",
    };

    return typeMap[type as keyof typeof typeMap] || "";
  };

  return (
    <Card className="flex flex-col h-full bg-white">
      <CardHeader className="px-4 py-3 border-b flex flex-row items-center justify-between">
        <div className="flex items-center">
          <Users className="h-5 w-5 mr-2 text-primary" />
          <CardTitle className="text-base font-medium">
            Agent Collaboration
          </CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShowNewSessionDialog(true)}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create new collaboration session</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>

      {activeSession ? (
        <>
          <div className="px-4 py-2 border-b bg-slate-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">{activeSession.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {activeSession.description}
                </p>
              </div>
              <Badge
                variant="outline"
                className={`text-xs ${getStatusColor(activeSession.status)}`}
              >
                {activeSession.status.charAt(0).toUpperCase() +
                  activeSession.status.slice(1)}
              </Badge>
            </div>
            <div className="flex items-center mt-2 space-x-1">
              <span className="text-xs text-muted-foreground mr-1">
                Collaborators:
              </span>
              <div className="flex -space-x-2">
                {activeSession.agents.map((agent) => (
                  <TooltipProvider key={agent.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Avatar className="h-6 w-6 border-2 border-background">
                          <AvatarImage
                            src={
                              agent.avatar ||
                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${agent.name}`
                            }
                            alt={agent.name}
                          />
                          <AvatarFallback className="text-[10px]">
                            {agent.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {agent.name} - {agent.role}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col"
          >
            <div className="border-b">
              <TabsList className="w-full justify-start h-10 p-0 bg-transparent">
                <TabsTrigger
                  value="discussion"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-10"
                >
                  Discussion
                </TabsTrigger>
                <TabsTrigger
                  value="solutions"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-10"
                >
                  Solutions
                </TabsTrigger>
              </TabsList>
            </div>

            <CardContent className="flex-1 p-0 overflow-hidden">
              <Tabs value={activeTab} className="h-full">
                <TabsContent
                  value="discussion"
                  className="h-full m-0 p-0 flex flex-col"
                >
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {activeSession.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`${getMessageTypeStyles(message.type)}`}
                        >
                          <div className="flex items-start">
                            <Avatar className="h-8 w-8 mr-2 mt-0.5">
                              <AvatarImage
                                src={
                                  message.agentAvatar ||
                                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${message.agentName}`
                                }
                                alt={message.agentName}
                              />
                              <AvatarFallback>
                                {message.agentName
                                  .substring(0, 2)
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center">
                                <span className="text-sm font-medium">
                                  {message.agentName}
                                </span>
                                <span className="text-xs text-muted-foreground ml-2">
                                  {message.timestamp.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                                {message.type === "solution" && (
                                  <Badge
                                    variant="secondary"
                                    className="ml-2 text-xs"
                                  >
                                    Solution
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm mt-1 whitespace-pre-wrap">
                                {message.content}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <div className="p-3 border-t">
                    <div className="flex items-end gap-2">
                      <div className="relative flex-grow">
                        <textarea
                          placeholder="Type your message..."
                          className="min-h-[60px] w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          rows={2}
                        />
                      </div>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="flex-shrink-0"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Send
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="solutions" className="h-full m-0 p-0">
                  <ScrollArea className="h-full p-4">
                    <div className="space-y-4">
                      {activeSession.messages
                        .filter((message) => message.type === "solution")
                        .map((solution) => (
                          <Card key={solution.id} className="border-green-200">
                            <CardHeader className="py-3 px-4 bg-green-50 border-b border-green-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Avatar className="h-6 w-6 mr-2">
                                    <AvatarImage
                                      src={
                                        solution.agentAvatar ||
                                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${solution.agentName}`
                                      }
                                      alt={solution.agentName}
                                    />
                                    <AvatarFallback className="text-[10px]">
                                      {solution.agentName
                                        .substring(0, 2)
                                        .toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <span className="text-sm font-medium">
                                      {solution.agentName}
                                    </span>
                                    <span className="text-xs text-muted-foreground ml-2">
                                      {solution.timestamp.toLocaleTimeString(
                                        [],
                                        {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        },
                                      )}
                                    </span>
                                  </div>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                  Solution
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="py-3 px-4">
                              <div className="text-sm whitespace-pre-wrap">
                                {solution.content}
                              </div>
                            </CardContent>
                          </Card>
                        ))}

                      {activeSession.messages.filter(
                        (message) => message.type === "solution",
                      ).length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <AlertCircle className="h-12 w-12 text-muted-foreground mb-3 opacity-20" />
                          <h3 className="text-lg font-medium">
                            No solutions yet
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Solutions proposed by agents will appear here
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Tabs>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <Users className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
          <h3 className="text-lg font-medium">No active collaboration</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-6 max-w-md">
            Create a new collaboration session to work with multiple AI agents
            on complex problems
          </p>
          <Button onClick={() => setShowNewSessionDialog(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Collaboration Session
          </Button>
        </div>
      )}

      <Dialog
        open={showNewSessionDialog}
        onOpenChange={setShowNewSessionDialog}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Collaboration Session</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                Session Title
              </label>
              <input
                id="title"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={newSessionTitle}
                onChange={(e) => setNewSessionTitle(e.target.value)}
                placeholder="E.g., Project Architecture Discussion"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={newSessionDescription}
                onChange={(e) => setNewSessionDescription(e.target.value)}
                placeholder="Briefly describe the purpose of this collaboration session"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Select Agents</label>
              <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto pr-1">
                {availableAgents.map((agent) => (
                  <div
                    key={agent.id}
                    className={`flex items-center justify-between p-2 rounded-md border ${selectedAgentIds.includes(agent.id) ? "border-primary bg-primary/5" : "border-border"}`}
                    onClick={() => toggleAgentSelection(agent.id)}
                  >
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage
                          src={
                            agent.avatar ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${agent.name}`
                          }
                          alt={agent.name}
                        />
                        <AvatarFallback>
                          {agent.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{agent.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {agent.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Badge
                        variant="outline"
                        className={`mr-2 text-xs ${agent.status === "active" ? "bg-green-100 text-green-800" : agent.status === "busy" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-800"}`}
                      >
                        {agent.status.charAt(0).toUpperCase() +
                          agent.status.slice(1)}
                      </Badge>
                      <div
                        className={`h-6 w-6 rounded-full flex items-center justify-center ${selectedAgentIds.includes(agent.id) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                      >
                        {selectedAgentIds.includes(agent.id) ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <UserPlus className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNewSessionDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateSession}
              disabled={
                !newSessionTitle.trim() || selectedAgentIds.length === 0
              }
            >
              <Zap className="h-4 w-4 mr-2" />
              Create Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CollaborationPanel;
