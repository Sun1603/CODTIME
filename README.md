# 🚀 CODTIME: Real-Time Collaborative IDE

CODTIME is a premium, high-fidelity real-time collaborative coding platform built with **Next.js**, **Socket.io**, and **Monaco Editor**. It features a live interactive terminal, multi-language support via Cloud Execution, and a sleek neon-cyberpunk aesthetic.

![CODTIME Preview](https://via.placeholder.com/1200x600/000000/00E5FF?text=CODTIME+COLLABORATIVE+IDE)

## ✨ Key Features

- **⚡ Real-Time Sync**: Sub-50ms code synchronization across all collaborators using Socket.io.
- **🖥️ Interactive Terminal**: A fully functional pseudo-terminal (PTY) that allows running shell commands and interacting with code output.
- **🌍 Multi-Language Execution**: Powered by the **Piston API**, support for 10+ languages including Python, Java, C++, Rust, and Go—no local compilers needed!
- **👥 Presence Tracking**: Live cursor indicators and a collaborator list to see who's online and where they're working.
- **🎨 Premium UI**: A high-density, dark-themed interface built with Tailwind CSS and Framer Motion for smooth animations.
- **📂 Java Smart-Sync**: Automatic detection of Java public class names for seamless compilation.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS, Framer Motion
- **Editor**: Monaco Editor (The engine behind VS Code)
- **Backend**: Node.js, Express, Socket.io
- **Terminal**: Xterm.js, node-pty
- **Execution**: Piston API (Cloud-based code execution)

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/CODTIME.git
cd CODTIME
```

### 2. Install Dependencies
**For the Frontend:**
```bash
npm install
```

**For the Backend:**
```bash
cd server
npm install
```

### 3. Run Locally
**Start Backend:**
```bash
cd server
node index.js
```

**Start Frontend:**
```bash
# In the root directory
npm run dev
```

Visit `http://localhost:3000` to start coding!

## 🌐 Deployment

### Backend (Render/Railway)
1. Deploy the `server` directory.
2. Set Environment Variable: `FRONTEND_URL` to your Vercel URL.

### Frontend (Vercel)
1. Deploy the root directory.
2. Set Environment Variable: `NEXT_PUBLIC_BACKEND_URL` to your Backend URL.

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---
Built with 💙 by Shreyangshu Das
