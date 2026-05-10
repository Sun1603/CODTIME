# CODTIME: A Real-Time Collaborative Development Environment

## 📌 Project Overview
**CODTIME** is a full-stack web application developed as a project to explore the complexities of real-time synchronization and remote code execution. The primary goal was to build a high-performance, collaborative workspace where multiple developers can write, discuss, and execute code simultaneously in a unified environment.

This project focuses on bridging the gap between static code editors and interactive development environments by integrating a live Pseudo-Terminal (PTY) and a cloud-based execution engine.

---

## 🚀 Key Features

### 1. High-Fidelity Real-Time Collaboration
Leveraging **Socket.io**, the platform synchronizes code state across all connected clients with minimal latency. It includes custom presence tracking to show active collaborators and their cursor locations.

### 2. Interactive Terminal Integration
A core technical highlight of this project is the integration of **Xterm.js** with a **node-pty** backend. This provides a genuine shell experience within the browser, allowing users to run shell commands and interact with running processes in real-time.

### 3. Cross-Language Cloud Execution
To ensure accessibility, I integrated the **Piston API** for code execution. This allows users to run code in over 10 languages (Python, Java, C++, Rust, etc.) without requiring any local compiler setup.

### 4. Smart Workspace Management
- **Java Support**: Automatically handles public class name detection for Java files.
- **Dynamic Language Selection**: Instant syntax highlighting and execution environment switching.
- **Responsive UI**: A modern, dark-themed interface built with **Tailwind CSS** and **Framer Motion**.

---

## 🛠️ Technical Architecture

The application is built using a modern full-stack architecture:
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS.
- **Backend**: Node.js (Express) server handling WebSocket orchestration and PTY spawning.
- **State Management**: Real-time event-driven synchronization via Socket.io.
- **Editor Engine**: Monaco Editor (the core of VS Code).

### 🧠 Challenges Overcome
- **Concurrency**: Managing "last-write-wins" and ensuring state consistency across multiple socket connections.
- **Terminal Interactivity**: Mapping complex ANSI escape codes and handling bidirectional data streaming between the browser and the server's pseudo-terminal.
- **Deployment**: Architecting the split between a serverless frontend (Vercel) and a persistent stateful backend (Render).

---

## 📖 Learning Outcomes
Developing CODTIME provided deep insights into:
- Building scalable real-time systems with WebSockets.
- Understanding Linux Pseudo-Terminals (PTY) and stream handling in Node.js.
- Implementing secure remote code execution pipelines.
- Managing production-grade full-stack deployments.

---

## 🏁 Getting Started

### Local Setup
1. **Clone the Repo**: `git clone https://github.com/Sun1603/CODTIME.git`
2. **Backend**:
   ```bash
   cd server
   npm install
   node index.js
   ```
3. **Frontend**:
   ```bash
   npm install
   npm run dev
   ```

---

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).

---
**Developed by [Shreyangshu Das](https://github.com/Sun1603)**  
*Student & Developer*
