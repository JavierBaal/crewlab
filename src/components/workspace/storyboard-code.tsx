import React from "react";
import CodePanel from "./CodePanel";

export default function CodeStoryboard() {
  const handleRun = (code: string) => {
    console.log("Running code:", code);
  };

  return (
    <div className="p-4 bg-gray-100 h-screen">
      <div className="w-[612px] h-[468px]">
        <CodePanel onRun={handleRun} />
      </div>
    </div>
  );
}
