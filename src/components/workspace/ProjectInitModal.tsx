import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FolderPlus,
  Code,
  Database,
  Settings,
  FileText,
  Braces,
  Terminal,
} from "lucide-react";

interface ProjectInitModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCreateProject?: (projectData: ProjectData) => void;
  onCancel?: () => void;
}

interface ProjectData {
  name: string;
  description: string;
  projectType: string;
  framework: string;
  database: string;
  features: string[];
}

const ProjectInitModal = ({
  isOpen = true,
  onOpenChange = () => {},
  onCreateProject = () => {},
  onCancel = () => {},
}: ProjectInitModalProps) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [projectData, setProjectData] = useState<ProjectData>({
    name: "My New Project",
    description: "A collaborative AI-assisted development project",
    projectType: "web",
    framework: "react",
    database: "none",
    features: [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProjectData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProjectData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeatureToggle = (feature: string) => {
    setProjectData((prev) => {
      const features = [...prev.features];
      if (features.includes(feature)) {
        return { ...prev, features: features.filter((f) => f !== feature) };
      } else {
        return { ...prev, features: [...features, feature] };
      }
    });
  };

  const handleSubmit = () => {
    onCreateProject(projectData);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel();
    onOpenChange(false);
  };

  const isNextDisabled = () => {
    if (activeTab === "basic") {
      return !projectData.name.trim() || !projectData.description.trim();
    }
    return false;
  };

  const handleNext = () => {
    if (activeTab === "basic") setActiveTab("tech");
    else if (activeTab === "tech") setActiveTab("features");
    else handleSubmit();
  };

  const handleBack = () => {
    if (activeTab === "tech") setActiveTab("basic");
    else if (activeTab === "features") setActiveTab("tech");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="h-5 w-5 text-primary" />
            Initialize New Project
          </DialogTitle>
          <DialogDescription>
            Configure your project settings to get started with the AI agent
            team.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="tech" className="flex items-center gap-1">
              <Code className="h-4 w-4" />
              Tech Stack
            </TabsTrigger>
            <TabsTrigger value="features" className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              Features
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={projectData.name}
                  onChange={handleInputChange}
                  placeholder="Enter project name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Project Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={projectData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your project"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectType">Project Type</Label>
                <Select
                  value={projectData.projectType}
                  onValueChange={(value) =>
                    handleSelectChange("projectType", value)
                  }
                >
                  <SelectTrigger id="projectType">
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web">Web Application</SelectItem>
                    <SelectItem value="mobile">Mobile App</SelectItem>
                    <SelectItem value="desktop">Desktop Application</SelectItem>
                    <SelectItem value="api">API / Backend Service</SelectItem>
                    <SelectItem value="ml">Machine Learning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tech" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="framework">Framework</Label>
                <Select
                  value={projectData.framework}
                  onValueChange={(value) =>
                    handleSelectChange("framework", value)
                  }
                >
                  <SelectTrigger id="framework">
                    <SelectValue placeholder="Select framework" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="react">React</SelectItem>
                    <SelectItem value="next">Next.js</SelectItem>
                    <SelectItem value="vue">Vue.js</SelectItem>
                    <SelectItem value="angular">Angular</SelectItem>
                    <SelectItem value="django">Django</SelectItem>
                    <SelectItem value="flask">Flask</SelectItem>
                    <SelectItem value="express">Express.js</SelectItem>
                    <SelectItem value="none">None / Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="database">Database</Label>
                <Select
                  value={projectData.database}
                  onValueChange={(value) =>
                    handleSelectChange("database", value)
                  }
                >
                  <SelectTrigger id="database">
                    <SelectValue placeholder="Select database" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mongodb">MongoDB</SelectItem>
                    <SelectItem value="postgres">PostgreSQL</SelectItem>
                    <SelectItem value="mysql">MySQL</SelectItem>
                    <SelectItem value="sqlite">SQLite</SelectItem>
                    <SelectItem value="firebase">Firebase</SelectItem>
                    <SelectItem value="supabase">Supabase</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Select Features</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  {
                    id: "auth",
                    label: "Authentication",
                    icon: <Database className="h-4 w-4" />,
                  },
                  {
                    id: "api",
                    label: "API Integration",
                    icon: <Braces className="h-4 w-4" />,
                  },
                  {
                    id: "testing",
                    label: "Testing Framework",
                    icon: <Code className="h-4 w-4" />,
                  },
                  {
                    id: "ci-cd",
                    label: "CI/CD Pipeline",
                    icon: <Terminal className="h-4 w-4" />,
                  },
                  {
                    id: "analytics",
                    label: "Analytics",
                    icon: <Settings className="h-4 w-4" />,
                  },
                  {
                    id: "i18n",
                    label: "Internationalization",
                    icon: <FileText className="h-4 w-4" />,
                  },
                ].map((feature) => (
                  <Button
                    key={feature.id}
                    type="button"
                    variant={
                      projectData.features.includes(feature.id)
                        ? "default"
                        : "outline"
                    }
                    className="justify-start gap-2 h-auto py-3"
                    onClick={() => handleFeatureToggle(feature.id)}
                  >
                    {feature.icon}
                    {feature.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customFeatures">Custom Features</Label>
              <Input
                id="customFeatures"
                placeholder="Enter custom features (comma separated)"
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between sm:justify-between mt-6">
          <div>
            {activeTab !== "basic" && (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleNext} disabled={isNextDisabled()}>
              {activeTab === "features" ? "Create Project" : "Next"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectInitModal;
