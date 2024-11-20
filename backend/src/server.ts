import express from 'express';
import cors from 'cors';
import { createServer } from 'node:http';
import { Server, Socket } from 'socket.io';
import GameController, { AttackResult } from './game/GameController';
import GamesManager from './GamesManager';

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

const gm = new GamesManager();
const sockets = new Map<string, Socket>();

io.on('connection', (socket) => {
  console.log('a user connected');
  const playerId = socket.id;
  gm.addPlayer({ playerId });
  sockets.set(playerId, socket);

  const game = gm.getGame({ playerId });
  if (game) {
    const socket1 = sockets.get(game.player1.id);
    const socket2 = sockets.get(game.player2.id);

    socket1!.join(`game:${game.id}`);
    socket2!.join(`game:${game.id}`);
  }

  socket.on('place ship', (msg) => {
    console.log('Received place ship at', msg.placement, 'from', socket.id);
    const playerId = socket.id;
    const player = gm.getPlayer({ playerId });
    const game = gm.getGame({ playerId });
    if (player && game) {
      if (player === game!.player1) game.gc.player1PlaceShip(msg.placement);
      if (player === game!.player2) game.gc.player2PlaceShip(msg.placement);
    }
  });

  socket.on('done placing', (_) => {
    const playerId = socket.id;
    gm.setDonePlacing({ playerId });
    if (gm.allDonePlacing({ playerId })) {
      const game = gm.getGame({ playerId });
      if (game) io.to(`game:${game.id}`).emit('all done placing');
    }
  });

  socket.on('send attack', (msg, callback) => {
    /* if (players.has(id)) {
      console.log('Received place ship at', msg.coord, 'from', socket.id);
      const player = players.get(id);
      let attackResult: AttackResult | undefined;
      if (player?.player === PLAYER.P1) attackResult = gc.player1Attack(msg.coord);
      if (player?.player === PLAYER.P2) attackResult = gc.player2Attack(msg.coord);
      callback({
        status: "ok",
        attackResult
      });
    } else {
      callback({
        status: "invalid id"
      });
    } */
  });

  socket.on('join room', (msg) => {
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    const playerId = socket.id;
    gm.removePlayer({ playerId });
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
