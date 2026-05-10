"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Terminal, Users, Zap, Code2, ArrowRight } from "lucide-react";
import { v4 as uuidV4 } from "uuid";

export default function Home() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const createNewRoom = (e: React.MouseEvent) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
  };

  const joinRoom = () => {
    if (!roomId || !username) return;
    router.push(`/editor/${roomId}?username=${username}`);
  };

  const handleInputEnter = (e: React.KeyboardEvent) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black selection:bg-primary-container selection:text-on-primary-container">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-24 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          <div className="mb-8 flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container-low px-4 py-1.5 text-label-caps text-secondary shadow-glow-secondary">
            <Zap size={14} className="led-pulse" />
            <span>REAL-TIME COLLABORATION V1.0</span>
          </div>

          <h1 className="mb-6 max-w-4xl text-5xl font-bold tracking-tight text-white sm:text-7xl">
            <span className="text-secondary syntax-glow">CODTIME:</span> Code at the Speed of <span className="text-primary-container syntax-glow">Thought.</span>
          </h1>
          
          <p className="mb-12 max-w-2xl text-lg leading-relaxed text-on-surface-variant">
            Experience high-fidelity real-time collaboration. Built for developers who demand precision, speed, and a premium workspace.
          </p>

          {/* Join/Create Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="glass-panel w-full max-w-md rounded-2xl p-8 shadow-2xl"
          >
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-container text-on-primary-container">
                <Terminal size={20} />
              </div>
              <div className="text-left">
                <h2 className="text-xl font-semibold text-white">Join Workspace</h2>
                <p className="text-sm text-on-surface-variant">Enter a Room ID to start collaborating</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2 text-left">
                <label className="text-xs font-medium uppercase tracking-wider text-outline">Room ID</label>
                <input
                  type="text"
                  placeholder="Paste Room ID"
                  className="w-full rounded-lg border border-outline-variant bg-surface-container-highest px-4 py-3 text-white outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  onKeyUp={handleInputEnter}
                />
              </div>

              <div className="space-y-2 text-left">
                <label className="text-xs font-medium uppercase tracking-wider text-outline">Username</label>
                <input
                  type="text"
                  placeholder="Your alias"
                  className="w-full rounded-lg border border-outline-variant bg-surface-container-highest px-4 py-3 text-white outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyUp={handleInputEnter}
                />
              </div>

              <button
                onClick={joinRoom}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary-container py-4 font-bold text-on-primary-container transition-all hover:brightness-110 active:scale-95"
              >
                <span>Initialize Connection</span>
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </button>

              <div className="pt-4 text-center">
                <span className="text-sm text-outline">Don't have a room? </span>
                <button
                  onClick={createNewRoom}
                  className="text-sm font-semibold text-secondary hover:underline underline-offset-4"
                >
                  Generate Invitation
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Feature Grid */}
        <div className="mt-32 grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
          <FeatureCard 
            icon={<Code2 className="text-primary-container" />}
            title="Monaco Powered"
            description="The same engine that powers VS Code. Full IntelliSense and keyboard shortcuts."
          />
          <FeatureCard 
            icon={<Users className="text-secondary" />}
            title="Presence Tracking"
            description="See who's online and where they're typing with real-time cursor indicators."
          />
          <FeatureCard 
            icon={<Zap className="text-tertiary-container" />}
            title="Instant Sync"
            description="Sub-50ms synchronization across all participants globally."
          />
        </div>
      </main>

      {/* Footer Decoration */}
      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-right from-transparent via-outline-variant to-transparent" />
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="glass-panel group rounded-xl p-6 transition-all hover:bg-surface-container-high">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-surface-container-highest transition-transform group-hover:scale-110">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-bold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-on-surface-variant">{description}</p>
    </div>
  );
}

