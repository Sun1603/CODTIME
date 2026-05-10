const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const pty = require('node-pty');
const os = require('os');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const userSocketMap = {};

function getAllConnectedUsers(roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            username: userSocketMap[socketId],
        };
    });
}

const ptyProcess = pty.spawn(os.platform() === 'win32' ? 'powershell.exe' : 'bash', [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: process.env.HOME || process.env.USERPROFILE,
    env: process.env
});

io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    ptyProcess.onData((data) => {
        socket.emit('terminal-data', data);
    });

    socket.on('terminal-input', (data) => {
        ptyProcess.write(data);
    });

    socket.on('execute-code', async ({ roomId, code, language }) => {
        console.log(`Executing ${language} for room ${roomId} via Piston Cloud`);
        
        const systemMsg = (msg) => socket.emit('terminal-data', `\r\n${msg}\r\n`);
        systemMsg(`\x1b[33m[CODTIME] Initializing Cloud Execution for ${language}...\x1b[0m`);
        
        try {
            const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
                language: language,
                version: "*",
                files: [{ content: code }],
            });

            const result = response.data.run;
            if (result) {
                const output = result.stdout || result.stderr || "\x1b[32mProcess finished with no output.\x1b[0m";
                socket.emit('terminal-data', `\r\n${output}\r\n`);
                systemMsg(`\x1b[32m[Done] Execution complete.\x1b[0m`);
            } else {
                systemMsg(`\x1b[31m[Error] ${response.data.message || 'Execution failed'}\x1b[0m`);
            }
        } catch (error) {
            console.error('Piston Error:', error.message);
            systemMsg(`\x1b[31m[Error] Cloud Engine Offline: ${error.message}\x1b[0m`);
        }
    });

    socket.on('join', ({ roomId, username }) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        const users = getAllConnectedUsers(roomId);
        users.forEach(({ socketId }) => {
            io.to(socketId).emit('joined', {
                users,
                username,
                socketId: socket.id,
            });
        });
    });

    socket.on('language-change', ({ roomId, language }) => {
        socket.in(roomId).emit('language-change', { language });
    });

    socket.on('code-change', ({ roomId, code }) => {
        socket.in(roomId).emit('code-change', { code });
    });

    socket.on('sync-code', ({ socketId, code }) => {
        io.to(socketId).emit('code-change', { code });
    });

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit('disconnected', {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id];
        socket.leave();
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
