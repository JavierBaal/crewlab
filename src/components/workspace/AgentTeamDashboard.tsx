import React, { useState } from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle, Settings, Users } from "lucide-react";
import AgentCardGrid from "./AgentCardGrid";
import ChatInterface from "./ChatInterface";
import TerminalPanel from "./TerminalPanel";
import CodePanel from "./CodePanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
  status: "idle" | "active" | "busy";
  specialties: string[];
}

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

interface AgentTeamDashboardProps {
  agents?: Agent[];
  initialMessages?: Message[];
  onSendMessage?: (message: string, agentId: string) => void;
  onExecuteCode?: (code: string) => void;
  onInitProject?: (settings: any) => void;
}

const AgentTeamDashboard = ({
  agents = [
    {
      id: "1",
      name: "Engineer Agent",
      role: "Software Engineer",
      description:
        "Specialized in writing clean, efficient code and solving technical problems.",
      avatar: "",
      status: "idle",
      specialties: ["JavaScript", "React", "Node.js"],
    },
    {
      id: "2",
      name: "Architect Agent",
      role: "Architect",
      description:
        "Designs robust system architectures and provides technical guidance on complex projects.",
      avatar: "",
      status: "active",
      specialties: ["System Design", "Cloud Architecture", "Microservices"],
    },
    {
      id: "3",
      name: "Data Analyst",
      role: "Data Analyst",
      description:
        "Analyzes data patterns and provides insights to inform decision-making processes.",
      avatar: "",
      status: "idle",
      specialties: ["Data Visualization", "Statistical Analysis", "Python"],
    },
  ],
  initialMessages = [],
  onSendMessage = () => {},
  onExecuteCode = () => {},
  onInitProject = () => {},
}: AgentTeamDashboardProps) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>(
    agents[0]?.id || "",
  );
  const [messages, setMessages] = useState<Record<string, Message[]>>(
    agents.reduce(
      (acc, agent) => {
        acc[agent.id] = initialMessages.filter(
          (msg) => msg.agentId === agent.id,
        );
        return acc;
      },
      {} as Record<string, Message[]>,
    ),
  );
  const [isTerminalMaximized, setIsTerminalMaximized] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [activeTerminalTab, setActiveTerminalTab] = useState("terminal");

  const selectedAgent =
    agents.find((agent) => agent.id === selectedAgentId) || agents[0];

  const handleSelectAgent = (agentId: string) => {
    setSelectedAgentId(agentId);
  };

  const handleSendMessage = (message: string) => {
    if (!selectedAgentId) return;

    // Create a new user message
    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: "user",
      timestamp: new Date(),
    };

    // Update messages for the selected agent
    setMessages((prev) => ({
      ...prev,
      [selectedAgentId]: [...(prev[selectedAgentId] || []), newMessage],
    }));

    // Call the parent handler
    onSendMessage(message, selectedAgentId);
  };

  const handleExecuteCode = (code: string) => {
    onExecuteCode(code);
  };

  const handleInitProject = (settings: any) => {
    onInitProject(settings);
    setIsProjectModalOpen(false);
  };

  const toggleTerminalMaximize = () => {
    setIsTerminalMaximized(!isTerminalMaximized);
  };

  return (
    <div className="flex flex-col h-full w-full bg-background">
      {/* Project initialization modal */}
      <Dialog open={isProjectModalOpen} onOpenChange={setIsProjectModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Initialize New Project
            </h2>
            <p className="text-muted-foreground mb-6">
              Configure your project settings to get started with the AI agent
              team.
            </p>
            <div className="space-y-4">
              <div className="grid gap-2">
                <label htmlFor="project-name" className="text-sm font-medium">
                  Project Name
                </label>
                <input
                  id="project-name"
                  className="border rounded-md p-2"
                  placeholder="My New Project"
                />
              </div>
              <div className="grid gap-2">
                <label
                  htmlFor="project-description"
                  className="text-sm font-medium"
                >
                  Description
                </label>
                <textarea
                  id="project-description"
                  className="border rounded-md p-2 min-h-[80px]"
                  placeholder="Describe your project..."
                />
              </div>
              <Button
                className="w-full"
                onClick={() =>
                  handleInitProject({
                    name: "My New Project",
                    description: "Sample project created with AI agent team",
                  })
                }
              >
                Initialize Project
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main workspace layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Agent selection sidebar */}
        <div className="w-[300px] flex-shrink-0">
          <AgentCardGrid
            agents={agents}
            onSelectAgent={handleSelectAgent}
            selectedAgentId={selectedAgentId}
          />
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Chat interface */}
          <div className="flex-1">
            <ChatInterface
              activeAgentId={selectedAgent?.id}
              activeAgentName={selectedAgent?.name}
              activeAgentAvatar={selectedAgent?.avatar}
              messages={messages[selectedAgentId] || []}
              onSendMessage={handleSendMessage}
              onRequestCodeExecution={handleExecuteCode}
            />
          </div>
        </div>

        {/* Terminal and code panels */}
        <div className="w-[612px] flex-shrink-0 border-l">
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={50}>
              <Tabs
                value={activeTerminalTab}
                onValueChange={setActiveTerminalTab}
              >
                <TerminalPanel
                  isMaximized={isTerminalMaximized}
                  onMaximizeToggle={toggleTerminalMaximize}
                />
              </Tabs>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50}>
              <CodePanel onRun={handleExecuteCode} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>

      {/* Action buttons */}
      <div className="fixed bottom-6 right-6 flex space-x-2">
        <Dialog>
          <DialogContent className="sm:max-w-[600px]">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">
                Collaboration Settings
              </h2>
              <p className="text-muted-foreground">
                Configure agent collaboration settings and team workflows.
              </p>
            </div>
          </DialogContent>
        </Dialog>

        <Button
          size="icon"
          variant="default"
          className="rounded-full h-12 w-12 shadow-lg"
          onClick={() => setIsProjectModalOpen(true)}
        >
          <PlusCircle className="h-5 w-5" />
        </Button>

        <Button
          size="icon"
          variant="outline"
          className="rounded-full h-12 w-12 shadow-lg"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default AgentTeamDashboard;
