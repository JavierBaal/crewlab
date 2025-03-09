import React from "react";
import AgentTeamDashboard from "./AgentTeamDashboard";
import WorkspaceHeader from "./WorkspaceHeader";

export default function WorkspaceStoryboard() {
  // Sample agents data
  const agents = [
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
  ];

  // Sample projects data
  const projects = [
    { id: "1", name: "My Project" },
    { id: "2", name: "Web App" },
    { id: "3", name: "Data Analysis" },
  ];

  const handleSendMessage = (message: string, agentId: string) => {
    console.log(`Sending message to agent ${agentId}: ${message}`);
  };

  const handleExecuteCode = (code: string) => {
    console.log("Executing code:", code);
  };

  const handleInitProject = (projectData: any) => {
    console.log("Initializing project with data:", projectData);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <WorkspaceHeader projectName="My Project" projects={projects} />

      <div className="flex-1 overflow-hidden">
        <AgentTeamDashboard
          agents={agents}
          onSendMessage={handleSendMessage}
          onExecuteCode={handleExecuteCode}
          onInitProject={handleInitProject}
        />
      </div>
    </div>
  );
}
