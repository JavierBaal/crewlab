"use client";

import React, { useState } from "react";
import WorkspaceHeader from "@/components/workspace/WorkspaceHeader";
import AgentTeamDashboard from "@/components/workspace/AgentTeamDashboard";
import ProjectInitModal from "@/components/workspace/ProjectInitModal";

export default function Home() {
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState({
    id: "1",
    name: "My Project",
  });

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
    {
      id: "4",
      name: "DevOps Agent",
      role: "DevOps Engineer",
      description:
        "Specializes in CI/CD pipelines, infrastructure automation, and deployment strategies.",
      avatar: "",
      status: "busy",
      specialties: ["Docker", "Kubernetes", "CI/CD"],
    },
  ];

  // Sample projects data
  const projects = [
    { id: "1", name: "My Project" },
    { id: "2", name: "Web App" },
    { id: "3", name: "Data Analysis" },
  ];

  const handleCreateProject = () => {
    setIsProjectModalOpen(true);
  };

  const handleProjectChange = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      setCurrentProject(project);
    }
  };

  const handleInitProject = (projectData: any) => {
    // In a real app, this would create a new project and add it to the projects list
    console.log("Initializing project with data:", projectData);
    setIsProjectModalOpen(false);
  };

  const handleSendMessage = (message: string, agentId: string) => {
    // In a real app, this would send the message to the backend
    console.log(`Sending message to agent ${agentId}: ${message}`);
  };

  const handleExecuteCode = (code: string) => {
    // In a real app, this would execute the code in the terminal
    console.log("Executing code:", code);
  };

  return (
    <main className="flex flex-col h-screen bg-background">
      <WorkspaceHeader
        projectName={currentProject.name}
        projects={projects}
        onProjectChange={handleProjectChange}
        onCreateProject={handleCreateProject}
      />

      <div className="flex-1 overflow-hidden">
        <AgentTeamDashboard
          agents={agents}
          onSendMessage={handleSendMessage}
          onExecuteCode={handleExecuteCode}
          onInitProject={handleInitProject}
        />
      </div>

      <ProjectInitModal
        isOpen={isProjectModalOpen}
        onOpenChange={setIsProjectModalOpen}
        onCreateProject={handleInitProject}
        onCancel={() => setIsProjectModalOpen(false)}
      />
    </main>
  );
}
