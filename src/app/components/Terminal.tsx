"use client";

import { useEffect, useRef } from "react";
import { Terminal as XTerm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import { Socket } from "socket.io-client";

interface TerminalProps {
  socket: Socket | null;
  onData?: (data: string) => void;
}

export default function Terminal({ socket, onData }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const onDataRef = useRef(onData);

  useEffect(() => {
    onDataRef.current = onData;
  }, [onData]);

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new XTerm({
      cursorBlink: true,
      theme: {
        background: "#000000",
        foreground: "#e4e1e6",
        cursor: "#00dbe9",
        selectionBackground: "rgba(0, 219, 233, 0.3)",
      },
      fontSize: 13,
      fontFamily: "var(--font-geist-mono)",
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    term.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = term;

    term.onData((data) => {
      onDataRef.current?.(data);
    });

    // Handle incoming terminal data directly
    if (socket) {
      console.log("Terminal: Attaching socket listener");
      socket.on("terminal-data", (data) => {
        console.log("Terminal: Received data", data);
        term.write(data);
      });
    }

    return () => {
      socket?.off("terminal-data");
      term.dispose();
    };
  }, [socket]);

  return (
    <div className="h-full w-full bg-black p-2">
      <div ref={terminalRef} className="h-full w-full" />
    </div>
  );
}
