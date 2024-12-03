import { Server, Socket } from 'socket.io';
import corsOptions from './corsOptions';
import { Server as httpServer } from 'http';
import gm from './GamesManager';

export function startGameServer(server: httpServer) {
  const sockets = new Map<string, Socket>();

  const io = new Server(server, {
    cors: corsOptions,
  });

  io.on('connection', (socket) => {
    console.log('a user connected');
    const playerId = socket.id;
    gm.addPlayer({ playerId });
    sockets.set(playerId, socket);
    gm.print();

    socket.on('join game', () => {
      console.log('trying to join a game');
      const playerId = socket.id;
      if (gm.playerInQueue({ playerId })) {
        console.log('player already in queue');
        return; // player already is trying to join game
      }
      gm.addPlayerToGameQueue({ playerId });
      const game = gm.getGame({ playerId });

      if (game) {
        const socket1 = sockets.get(game.player1.id);
        const socket2 = sockets.get(game.player2.id);

        if (socket1 && socket2) {
          socket1.join(`game: ${game.id}`);
          socket2.join(`game: ${game.id}`);

          io.to(`game: ${game.id}`).emit('found game');
        }
      }
      gm.print();
    });

    socket.on('is in game', (callback) => {
      const playerId = socket.id;
      const inGame = gm.isInGame({ playerId });
      callback({ inGame });
    });

    socket.on('place ship', (msg, callback) => {
      console.log('got place ship', msg);
      if (!msg.placement) {
        return callback({ status: 'fail' });
      }

      const playerId = socket.id;
      gm.placeShip({ playerId, placement: msg.placement });
    });

    socket.on('done placing', () => {
      const playerId = socket.id;
      gm.setDonePlacing({ playerId });
      const game = gm.getGame({ playerId });

      if (game && gm.allDonePlacing({ gameId: game.id })) {
        io.to(`game: ${game.id}`).emit('all done placing');
      }
    });

    socket.on('send attack', (msg, callback) => {
      console.log('got attack', msg);
      if (!msg.coordinate) {
        return callback({ status: { ok: false } });
      }

      const playerId = socket.id;
      const attackResult = gm.sendAttack({ playerId, coordinate: msg.coordinate });

      if (!attackResult) {
        return callback({ status: { ok: false } });
      }

      callback({ status: { ok: true }, attackResult });

      const gameId = gm.getGameId({ playerId });
      if (gameId && gm.isGameOver({ gameId })) io.to(`game: ${gameId}`).emit('game over');
    });

    socket.on('end', () => {
      socket.disconnect();
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
      const playerId = socket.id;
      console.log(playerId);
      const game = gm.removePlayer({ playerId });
      if (game) {
        console.log('removing game');
        const opponentId =
          playerId === game.player1.id ? game.player2.id : game.player1.id;
        const socket = sockets.get(opponentId);

        if (socket) io.to(socket.id).emit('opponent disconnected');
        gm.removeGame({ gameId: game.id });
      }
      sockets.delete(playerId);
      gm.print();
    });
  });
}
