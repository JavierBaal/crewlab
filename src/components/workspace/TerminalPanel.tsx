import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Terminal,
  X,
  Maximize2,
  Minimize2,
  Play,
  Download,
  Upload,
  Copy,
  Clipboard,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TerminalPanelProps {
  height?: number;
  isMaximized?: boolean;
  onMaximizeToggle?: () => void;
  defaultCommands?: string[];
  defaultOutput?: string;
}

const TerminalPanel = ({
  height = 450,
  isMaximized = false,
  onMaximizeToggle = () => {},
  defaultCommands = [
    "npm install",
    "python -m pip install crewai",
    "git clone https://github.com/example/project.git",
  ],
  defaultOutput = "Terminal initialized. Ready for commands.\n",
}: TerminalPanelProps) => {
  const [activeTab, setActiveTab] = useState("terminal");
  const [commandHistory, setCommandHistory] =
    useState<string[]>(defaultCommands);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentCommand, setCurrentCommand] = useState("");
  const [terminalOutput, setTerminalOutput] = useState(defaultOutput);
  const [isRunning, setIsRunning] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when terminal output changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  // Focus input when terminal is clicked
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentCommand.trim()) return;

    // Add command to history
    const newHistory = [...commandHistory, currentCommand];
    setCommandHistory(newHistory);
    setHistoryIndex(-1);

    // Update terminal output
    const newOutput = `${terminalOutput}\n$ ${currentCommand}\n`;
    setTerminalOutput(newOutput);

    // Simulate command execution
    executeCommand(currentCommand);

    // Clear current command
    setCurrentCommand("");
  };

  const executeCommand = (command: string) => {
    setIsRunning(true);

    // Simulate command execution with a delay
    setTimeout(() => {
      let output = "";

      // Mock responses for common commands
      if (command.includes("npm install") || command.includes("pip install")) {
        output = "Installing packages...\nPackages installed successfully.";
      } else if (command.includes("git clone")) {
        output = "Cloning repository...\nRepository cloned successfully.";
      } else if (command.includes("ls") || command.includes("dir")) {
        output = "project/\nnode_modules/\npackage.json\nREADME.md";
      } else if (command.includes("python") || command.includes("node")) {
        output = "Running script...\nScript executed successfully.";
      } else if (command.includes("clear") || command.includes("cls")) {
        setTerminalOutput("Terminal cleared.\n");
        setIsRunning(false);
        return;
      } else {
        output = `Command '${command}' executed.`;
      }

      setTerminalOutput((prev) => `${prev}${output}\n`);
      setIsRunning(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Navigate command history with up/down arrows
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentCommand("");
      }
    }
  };

  const clearTerminal = () => {
    setTerminalOutput("Terminal cleared.\n");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(terminalOutput);
    // Could add a toast notification here
  };

  return (
    <Card
      className={cn(
        "flex flex-col bg-black border-gray-800 transition-all duration-300",
        isMaximized ? "fixed inset-0 z-50" : "h-full",
      )}
      style={{ height: isMaximized ? "100vh" : height }}
    >
      <CardHeader className="p-3 border-b border-gray-800 flex flex-row items-center justify-between bg-gray-900">
        <div className="flex items-center space-x-2">
          <Terminal className="h-4 w-4 text-green-400" />
          <CardTitle className="text-sm font-medium text-white">
            Terminal
          </CardTitle>
        </div>
        <div className="flex items-center space-x-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-8">
            <TabsList className="h-7 bg-gray-800">
              <TabsTrigger value="terminal" className="h-6 px-2 text-xs">
                Terminal
              </TabsTrigger>
              <TabsTrigger value="output" className="h-6 px-2 text-xs">
                Output
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-gray-400 hover:text-white"
            onClick={clearTerminal}
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-gray-400 hover:text-white"
            onClick={copyToClipboard}
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-gray-400 hover:text-white"
            onClick={onMaximizeToggle}
          >
            {isMaximized ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 overflow-hidden">
        <TabsContent value="terminal" className="h-full m-0 p-0">
          <div
            className="h-full flex flex-col bg-gray-950 text-green-400 font-mono text-sm p-3 overflow-hidden"
            onClick={focusInput}
          >
            <div
              ref={outputRef}
              className="flex-1 overflow-y-auto whitespace-pre-wrap scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
            >
              {terminalOutput}
              {isRunning && (
                <div className="inline-block animate-pulse">...</div>
              )}
              {!isRunning && (
                <div className="flex items-center">
                  <span className="text-green-500 mr-1">$</span>
                  <span>{currentCommand}</span>
                  <span className="inline-block w-2 h-4 bg-green-400 ml-0.5 animate-blink"></span>
                </div>
              )}
            </div>

            <form onSubmit={handleCommandSubmit} className="mt-2">
              <div className="relative flex items-center">
                <span className="text-green-500 mr-1">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={currentCommand}
                  onChange={(e) => setCurrentCommand(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent border-none outline-none text-green-400 font-mono text-sm"
                  placeholder="Type a command..."
                  disabled={isRunning}
                  autoFocus
                />
              </div>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="output" className="h-full m-0 p-0">
          <div className="h-full bg-gray-950 text-white font-mono text-sm p-3 overflow-y-auto whitespace-pre-wrap">
            {terminalOutput}
          </div>
        </TabsContent>
      </CardContent>
    </Card>
  );
};

export default TerminalPanel;
