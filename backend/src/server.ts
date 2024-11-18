import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST"]
}

app.use(cors(corsOptions));

const server = createServer(app);
const io = new Server(server, {
  cors: corsOptions
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('cell click', (msg) => {
    console.log('received cell click at', msg.coord);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
