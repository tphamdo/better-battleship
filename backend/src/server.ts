import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors';

enum PLAYER {
  P1,
  P2,
}

interface Player {
  id: string;
  player: PLAYER;
}

const app = express();
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
};

app.use(cors(corsOptions));

const server = createServer(app);
const io = new Server(server, {
  cors: corsOptions,
});

const players = new Map<string, Player>();

io.on('connection', (socket) => {
  console.log('a user connected');
  const id = socket.id;

  const numPlayers = players.size;
  console.log(players);
  console.log(numPlayers);
  if (numPlayers < 2)
    players.set(id, { id, player: numPlayers === 0 ? PLAYER.P1 : PLAYER.P2 });

  socket.on('cell click', (msg) => {
    const id = socket.id;
    if (players.has(id)) {
      console.log('Received cell click at', msg.coord, 'from', socket.id);
    } else {
      console.log('Received cell click from extra player');
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    const id = socket.id;
    players.delete(id);
    console.log(players);
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
