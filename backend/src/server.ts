import express from 'express';
import cors from 'cors';
import { createServer } from 'node:http';
import corsOptions from './corsOptions';
import { startGameServer } from './socket';

const app = express();

app.use(cors(corsOptions));

const server = createServer(app);
startGameServer(server);

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
