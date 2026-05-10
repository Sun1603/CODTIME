"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Editor from "@monaco-editor/react";
import { io, Socket } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users as UsersIcon, 
  Settings, 
  Share2, 
  MessageSquare, 
  Terminal as TerminalIcon,
  ChevronLeft,
  Circle,
  Play,
  ChevronDown
} from "lucide-react";

import Terminal from "@/app/components/Terminal";

interface User {
  socketId: string;
  username: string;
}

const LANGUAGES = [
  { label: "JavaScript", value: "javascript", piston: "javascript" },
  { label: "TypeScript", value: "typescript", piston: "typescript" },
  { label: "Python", value: "python", piston: "python3" },
  { label: "Java", value: "java", piston: "java" },
  { label: "C++", value: "cpp", piston: "cpp" },
  { label: "Rust", value: "rust", piston: "rust" },
  { label: "Go", value: "go", piston: "go" },
  { label: "Ruby", value: "ruby", piston: "ruby" },
  { label: "C#", value: "csharp", piston: "csharp" },
];

export default function EditorPage() {
  const { roomId } = useParams();
  const searchParams = useSearchParams();
  const username = searchParams.get("username");
  const router = useRouter();

  const [socket, setSocket] = useState<Socket | null>(null);
  const codeRef = useRef<string>("// Loading workspace...");
  const [users, setUsers] = useState<User[]>([]);
  const [code, setCode] = useState(codeRef.current);
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!username) {
      router.push("/");
      return;
    }

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
    const newSocket = io(BACKEND_URL);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      newSocket.emit("join", { roomId, username });
    });

    newSocket.on("joined", ({ users, username: joinedUser, socketId }) => {
      setUsers(users);
      if (socketId !== newSocket.id) {
        newSocket.emit("sync-code", {
          socketId,
          code: codeRef.current,
        });
        // Also sync current language
        newSocket.emit("language-change", { roomId, language: language.value });
      }
    });

    newSocket.on("code-change", ({ code }) => {
      setCode(code);
      codeRef.current = code;
    });

    newSocket.on("language-change", ({ language: langValue }) => {
      const lang = LANGUAGES.find(l => l.value === langValue);
      if (lang) setLanguage(lang);
    });

    newSocket.on("disconnected", ({ socketId }) => {
      setUsers((prev) => prev.filter((u) => u.socketId !== socketId));
    });

    return () => {
      newSocket.disconnect();
    };
  }, [roomId, username, router]);

  const handleEditorChange = (value: string | undefined) => {
    const newCode = value || "";
    codeRef.current = newCode;
    setCode(newCode);
    socket?.emit("code-change", { roomId, code: newCode });
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = LANGUAGES.find(l => l.value === e.target.value);
    if (lang) {
      setLanguage(lang);
      socket?.emit("language-change", { roomId, language: lang.value });
    }
  };

  const handleTerminalData = (data: string) => {
    socket?.emit("terminal-input", data);
  };

  const runCode = async () => {
    setIsRunning(true);
    
    // We'll use the server to save the file and run it in the terminal
    socket?.emit("execute-code", {
      roomId,
      code: codeRef.current,
      language: language.piston,
    });

    setTimeout(() => setIsRunning(false), 1000);
  };

  const getFileExtension = (lang: string) => {
    const map: Record<string, string> = {
      javascript: "js",
      typescript: "ts",
      python: "py",
      java: "java",
      cpp: "cpp",
      rust: "rs",
      go: "go",
      ruby: "rb",
      csharp: "cs",
    };
    return map[lang] || "txt";
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-black text-white">
      {/* Top Navigation */}
      <header className="flex h-14 items-center justify-between border-b border-outline-variant bg-surface-container-low px-4 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push("/")}
            className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-surface-container-high"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary-container text-on-primary-container">
              <TerminalIcon size={16} />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wide leading-tight">CODTIME <span className="text-outline">/</span> {roomId?.slice(0, 8)}</h1>
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-secondary">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                </span>
                LIVE
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <div className="relative">
            <select
              value={language.value}
              onChange={handleLanguageChange}
              className="appearance-none bg-surface-container-highest text-xs font-medium text-white px-4 py-1.5 pr-8 rounded border border-outline-variant outline-none focus:border-primary transition-all cursor-pointer"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-outline" />
          </div>

          <button 
            onClick={runCode}
            disabled={isRunning}
            className="flex items-center gap-2 rounded-md bg-secondary px-4 py-1.5 text-xs font-bold text-on-secondary transition-all hover:brightness-110 disabled:opacity-50 active:scale-95 shadow-glow-secondary"
          >
            <Play size={14} fill="currentColor" />
            {isRunning ? "RUNNING..." : "RUN CODE"}
          </button>

          <div className="h-6 w-px bg-outline-variant mx-1" />

          <button className="flex items-center gap-2 rounded-md border border-outline-variant bg-surface-container-highest px-3 py-1.5 text-xs font-medium transition-all hover:bg-surface-bright">
            <Share2 size={14} />
            Share
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="flex flex-col border-r border-outline-variant bg-surface-container-lowest"
            >
              <div className="p-4 overflow-y-auto">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-outline">Collaborators</h2>
                  <div className="rounded-full bg-surface-container-highest px-2 py-0.5 text-[10px] text-white">
                    {users.length}
                  </div>
                </div>

                <div className="space-y-2">
                  {users.map((user) => (
                    <motion.div
                      layout
                      key={user.socketId}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 rounded-lg border border-transparent bg-surface-container-low p-2 transition-all hover:border-outline-variant hover:bg-surface-container-high"
                    >
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-container to-secondary text-xs font-bold text-on-primary-container shadow-sm`}>
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="truncate text-sm font-medium">{user.username}</p>
                        <p className="text-[10px] text-outline">Typing...</p>
                      </div>
                      <Circle size={8} className="fill-secondary text-secondary led-pulse" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Editor & Terminal Vertical Split */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Editor Area */}
          <main className="relative flex-1 overflow-hidden bg-[#1e1e1e]">
            <div className="absolute top-0 right-0 z-10 flex p-4">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="rounded-md bg-surface-container-highest/50 backdrop-blur-sm p-2 text-outline transition-colors hover:text-white"
              >
                  <UsersIcon size={18} />
              </button>
            </div>

            <Editor
              height="100%"
              language={language.value}
              theme="vs-dark"
              value={code}
              onChange={handleEditorChange}
              options={{
                fontSize: 15,
                fontFamily: "var(--font-geist-mono)",
                minimap: { enabled: true },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 20 },
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
                smoothScrolling: true,
                lineNumbers: "on",
                renderLineHighlight: "all",
                tabSize: 2,
              }}
            />
          </main>

          {/* Terminal Area */}
          <div className="h-[240px] flex flex-col border-t border-outline-variant bg-black">
            <div className="flex h-9 items-center justify-between bg-surface-container-low px-4 border-b border-outline-variant">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-outline">
                <TerminalIcon size={12} />
                Terminal Output
              </div>
              <button 
                onClick={() => {}} // Terminal clear handled internally or by shell
                className="text-[10px] font-bold text-outline hover:text-white transition-colors"
              >
                CLEAR
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <Terminal socket={socket} onData={handleTerminalData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

