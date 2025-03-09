import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import AgentCard from "./AgentCard";

interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
  status: "idle" | "active" | "busy";
  specialties: string[];
}

interface AgentCardGridProps {
  agents?: Agent[];
  onSelectAgent?: (id: string) => void;
  selectedAgentId?: string;
}

const AgentCardGrid = ({
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
    {
      id: "4",
      name: "Consultant Agent",
      role: "Consultant",
      description:
        "Provides strategic advice and best practices for project implementation.",
      avatar: "",
      status: "busy",
      specialties: ["Project Management", "Agile", "Requirements Analysis"],
    },
    {
      id: "5",
      name: "DevOps Agent",
      role: "Software Engineer",
      description:
        "Specializes in CI/CD pipelines, infrastructure automation, and deployment strategies.",
      avatar: "",
      status: "idle",
      specialties: ["Docker", "Kubernetes", "CI/CD"],
    },
  ],
  onSelectAgent = () => {},
  selectedAgentId = "",
}: AgentCardGridProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Filter agents based on search query and active tab
  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.specialties.some((specialty) =>
        specialty.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active")
      return matchesSearch && agent.status === "active";
    if (activeTab === "idle") return matchesSearch && agent.status === "idle";
    if (activeTab === "busy") return matchesSearch && agent.status === "busy";

    return matchesSearch;
  });

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 border-r">
      <div className="p-4 border-b">
        <div className="relative mb-3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search agents..."
            className="pl-8 h-9 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1 text-xs">
              All
            </TabsTrigger>
            <TabsTrigger value="active" className="flex-1 text-xs">
              Active
            </TabsTrigger>
            <TabsTrigger value="idle" className="flex-1 text-xs">
              Idle
            </TabsTrigger>
            <TabsTrigger value="busy" className="flex-1 text-xs">
              Busy
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ScrollArea className="flex-1 p-3">
        <div className="grid grid-cols-1 gap-3">
          {filteredAgents.length > 0 ? (
            filteredAgents.map((agent) => (
              <AgentCard
                key={agent.id}
                id={agent.id}
                name={agent.name}
                role={agent.role}
                description={agent.description}
                avatar={agent.avatar}
                status={agent.status}
                specialties={agent.specialties}
                onSelect={onSelectAgent}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <p className="text-muted-foreground text-sm">
                No agents found matching your criteria
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default AgentCardGrid;
