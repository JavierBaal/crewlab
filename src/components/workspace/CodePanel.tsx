import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Download, Play, Save } from "lucide-react";

interface CodePanelProps {
  code?: string;
  language?: string;
  fileName?: string;
  onSave?: (code: string) => void;
  onRun?: (code: string) => void;
  onCopy?: (code: string) => void;
  onDownload?: (code: string, fileName: string) => void;
}

const CodePanel = ({
  code = "// Example code\nfunction helloWorld() {\n  console.log('Hello from the AI Agent Team!');\n}\n\nhelloWorld();",
  language = "javascript",
  fileName = "example.js",
  onSave = () => {},
  onRun = () => {},
  onCopy = () => {},
  onDownload = () => {},
}: CodePanelProps) => {
  const [currentCode, setCurrentCode] = useState<string>(code);
  const [currentLanguage, setCurrentLanguage] = useState<string>(language);
  const [currentFileName, setCurrentFileName] = useState<string>(fileName);
  const [activeTab, setActiveTab] = useState<string>("code");

  // Sample files for demonstration
  const sampleFiles = [
    {
      name: "example.js",
      language: "javascript",
      content: "// Example JavaScript file\nconsole.log('Hello world!');",
    },
    {
      name: "styles.css",
      language: "css",
      content: "/* Example CSS */\nbody { font-family: sans-serif; }",
    },
    {
      name: "index.html",
      language: "html",
      content:
        "<!DOCTYPE html>\n<html>\n<head>\n  <title>Example</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>",
    },
  ];

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentCode(e.target.value);
  };

  const handleLanguageChange = (value: string) => {
    setCurrentLanguage(value);
  };

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentFileName(e.target.value);
  };

  const handleSave = () => {
    onSave(currentCode);
  };

  const handleRun = () => {
    onRun(currentCode);
  };

  const handleCopy = () => {
    onCopy(currentCode);
  };

  const handleDownload = () => {
    onDownload(currentCode, currentFileName);
  };

  const loadSampleFile = (file: {
    name: string;
    language: string;
    content: string;
  }) => {
    setCurrentFileName(file.name);
    setCurrentLanguage(file.language);
    setCurrentCode(file.content);
  };

  return (
    <Card className="h-full flex flex-col bg-white">
      <CardHeader className="p-4 border-b flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Code Editor</CardTitle>
        <div className="flex items-center space-x-2">
          <Select value={currentLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[120px] h-8">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="html">HTML</SelectItem>
              <SelectItem value="css">CSS</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex space-x-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleCopy}
              title="Copy code"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleSave}
              title="Save code"
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleDownload}
              title="Download file"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleRun}
              title="Run code"
            >
              <Play className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-grow flex flex-col">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-col h-full"
        >
          <div className="border-b px-4">
            <TabsList className="bg-transparent h-10">
              <TabsTrigger
                value="code"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
              >
                Editor
              </TabsTrigger>
              <TabsTrigger
                value="files"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
              >
                Files
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="code" className="flex-grow p-0 m-0 h-full">
            <div className="flex flex-col h-full">
              <div className="p-2 border-b flex items-center">
                <input
                  type="text"
                  value={currentFileName}
                  onChange={handleFileNameChange}
                  className="text-sm border rounded px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="flex-grow p-0 relative">
                <textarea
                  value={currentCode}
                  onChange={handleCodeChange}
                  className="w-full h-full p-4 font-mono text-sm resize-none focus:outline-none bg-slate-50"
                  spellCheck="false"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="files"
            className="flex-grow p-4 m-0 overflow-auto"
          >
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Sample Files</h3>
              <div className="grid gap-2">
                {sampleFiles.map((file, index) => (
                  <div
                    key={index}
                    className="p-2 border rounded hover:bg-slate-50 cursor-pointer flex justify-between items-center"
                    onClick={() => loadSampleFile(file)}
                  >
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {file.language}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        loadSampleFile(file);
                      }}
                    >
                      Load
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CodePanel;
