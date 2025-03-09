import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  Settings,
  HelpCircle,
  LogOut,
  Plus,
  FolderPlus,
  Github,
  Code,
  Users,
} from "lucide-react";

interface WorkspaceHeaderProps {
  title?: string;
  projectName?: string;
  projects?: { id: string; name: string }[];
  onProjectChange?: (projectId: string) => void;
  onCreateProject?: () => void;
  onOpenSettings?: () => void;
  userName?: string;
  userAvatar?: string;
  onLogout?: () => void;
}

const WorkspaceHeader = ({
  title = "AI Agent Team Workspace",
  projectName = "My Project",
  projects = [
    { id: "1", name: "My Project" },
    { id: "2", name: "Web App" },
    { id: "3", name: "Data Analysis" },
  ],
  onProjectChange = () => {},
  onCreateProject = () => {},
  onOpenSettings = () => {},
  userName = "User",
  userAvatar = "",
  onLogout = () => {},
}: WorkspaceHeaderProps) => {
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);

  return (
    <header className="h-16 w-full bg-white border-b flex items-center justify-between px-4 shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <Users className="h-6 w-6 text-primary mr-2" />
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>

        <div className="h-6 w-px bg-gray-200 mx-2" />

        <DropdownMenu
          open={isProjectDropdownOpen}
          onOpenChange={setIsProjectDropdownOpen}
        >
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-1 h-9 border-dashed"
            >
              <Code className="h-4 w-4 mr-1" />
              <span className="max-w-[150px] truncate">{projectName}</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[220px]">
            <DropdownMenuLabel>Projects</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {projects.map((project) => (
              <DropdownMenuItem
                key={project.id}
                className={cn(
                  "cursor-pointer",
                  project.name === projectName && "bg-muted",
                )}
                onClick={() => {
                  onProjectChange(project.id);
                  setIsProjectDropdownOpen(false);
                }}
              >
                <Code className="h-4 w-4 mr-2 opacity-70" />
                <span className="truncate">{project.name}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-primary focus:text-primary"
              onClick={() => {
                onCreateProject();
                setIsProjectDropdownOpen(false);
              }}
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              <span>New Project</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-8 w-8"
          onClick={onCreateProject}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
          <Github className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-8 w-8"
          onClick={onOpenSettings}
        >
          <Settings className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
          <HelpCircle className="h-4 w-4" />
        </Button>

        <div className="h-6 w-px bg-gray-200 mx-1" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-2 h-9 rounded-full hover:bg-accent"
            >
              <Avatar className="h-7 w-7">
                <AvatarImage
                  src={
                    userAvatar ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`
                  }
                  alt={userName}
                />
                <AvatarFallback>
                  {userName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium max-w-[100px] truncate">
                {userName}
              </span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={onOpenSettings}
            >
              <Settings className="h-4 w-4 mr-2 opacity-70" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <HelpCircle className="h-4 w-4 mr-2 opacity-70" />
              <span>Help & Support</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default WorkspaceHeader;
