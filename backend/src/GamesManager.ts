import GameController from './game/GameController';
import { nanoid } from 'nanoid';

class GamesManager {
  private players = new Map<string, Player>();
  private games = new Map<string, Game>();
  private playerQueue: Player[] = []; //players waiting to join a game

  addPlayer({ playerId }: { playerId: string }) {
    const player = { id: playerId };
    this.players.set(playerId, player);
    this.playerQueue.push(player);

    this.maybeCreateGame();
  }

  removePlayer({ playerId }: { playerId: string }) {
    this.players.delete(playerId);
    this.playerQueue = this.playerQueue.filter((p) => p.id != playerId);
  }

  getPlayer({ playerId }: { playerId: string }): Player | undefined {
    return this.players.get(playerId);
  }

  getGame({ playerId }: { playerId: string }): Game | undefined {
    const player = this.getPlayer({ playerId });
    if (!player || !player.gameId) return undefined;
    return this.games.get(player.gameId);
  }

  setDonePlacing({ playerId }: { playerId: string }) {
    const player = this.getPlayer({ playerId });
    const game = this.getGame({ playerId });
    if (!player || !game) return;
    if (player === game.player1) game.player1DonePlacing = true;
    if (player === game.player2) game.player2DonePlacing = true;
  }

  allDonePlacing({ playerId }: { playerId: string }): boolean {
    console.log('all done placing');
    const game = this.getGame({ playerId });
    if (!game) return false;
    return game.player1DonePlacing && game.player2DonePlacing;
  }

  private maybeCreateGame() {
    if (this.playerQueue.length == 2) {
      const player1: Player = this.playerQueue.shift()!;
      const player2: Player = this.playerQueue.shift()!;
      const game = createGame({ player1, player2 });
      player1.gameId = game.id;
      player2.gameId = game.id;
      this.games.set(game.id, game);
    }
  }

}

interface Player {
  id: string;
  gameId?: string;
}

interface Game {
  id: string;
  gc: GameController;
  player1: Player;
  player2: Player;
  player1DonePlacing: boolean;
  player2DonePlacing: boolean;
}

function createGame({ player1, player2 }: { player1: Player; player2: Player }): Game {
  const gc = new GameController();
  const gameId = nanoid();
  return {
    id: gameId,
    gc,
    player1,
    player2,
    player1DonePlacing: false,
    player2DonePlacing: false,
  };
}

export default GamesManager;
