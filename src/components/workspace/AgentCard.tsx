import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Code,
  Database,
  Cpu,
  Lightbulb,
  Zap,
} from "lucide-react";

interface AgentCardProps {
  id?: string;
  name?: string;
  role?: string;
  description?: string;
  avatar?: string;
  status?: "idle" | "active" | "busy";
  specialties?: string[];
  onSelect?: (id: string) => void;
}

const AgentCard = ({
  id = "1",
  name = "Engineer Agent",
  role = "Software Engineer",
  description = "Specialized in writing clean, efficient code and solving technical problems.",
  avatar = "",
  status = "idle",
  specialties = ["JavaScript", "React", "Node.js"],
  onSelect = () => {},
}: AgentCardProps) => {
  // Map roles to appropriate icons
  const getRoleIcon = (role: string) => {
    const roleMap = {
      "Software Engineer": <Code className="h-5 w-5" />,
      "Data Analyst": <Database className="h-5 w-5" />,
      Architect: <Cpu className="h-5 w-5" />,
      Consultant: <Lightbulb className="h-5 w-5" />,
    };

    return (
      roleMap[role as keyof typeof roleMap] || (
        <MessageSquare className="h-5 w-5" />
      )
    );
  };

  // Map status to appropriate colors
  const getStatusColor = (status: string) => {
    const statusMap = {
      idle: "bg-slate-200 text-slate-700",
      active: "bg-green-200 text-green-700",
      busy: "bg-amber-200 text-amber-700",
    };

    return (
      statusMap[status as keyof typeof statusMap] ||
      "bg-slate-200 text-slate-700"
    );
  };

  return (
    <Card
      className="w-[280px] h-[180px] bg-white hover:shadow-md transition-shadow duration-300 cursor-pointer border-2 hover:border-primary/50"
      onClick={() => onSelect(id)}
    >
      <CardHeader className="p-4 pb-0 flex flex-row items-center space-x-3">
        <Avatar className="h-10 w-10 border border-primary/20">
          <AvatarImage
            src={
              avatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
            }
            alt={name}
          />
          <AvatarFallback className="bg-primary/10">
            {name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-sm font-medium">{name}</CardTitle>
          <div className="flex items-center space-x-1">
            {getRoleIcon(role)}
            <CardDescription className="text-xs">{role}</CardDescription>
          </div>
        </div>
        <Badge
          variant="outline"
          className={`text-xs px-2 py-0 h-5 ${getStatusColor(status)}`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-xs text-muted-foreground line-clamp-2">
          {description}
        </p>
        <div className="flex flex-wrap gap-1 mt-2">
          {specialties.map((specialty, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-[10px] px-1.5 py-0 h-4"
            >
              {specialty}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button size="sm" className="w-full h-7 text-xs" variant="outline">
          <MessageSquare className="h-3.5 w-3.5 mr-1" />
          Chat with Agent
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AgentCard;
