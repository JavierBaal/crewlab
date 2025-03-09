import React from "react";
import TerminalPanel from "./TerminalPanel";

export default function TerminalStoryboard() {
  return (
    <div className="p-4 bg-gray-100 h-screen">
      <div className="w-[612px] h-[450px]">
        <TerminalPanel />
      </div>
    </div>
  );
}
