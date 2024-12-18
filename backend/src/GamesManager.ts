import GameController, { Coordinate, AttackResult, Placement } from './game/GameController';
import { nanoid } from 'nanoid';

class GamesManager {
  private players = new Map<string, Player>();
  private games = new Map<string, Game>();
  private playerQueue: Player[] = []; //players waiting to join a game

  addPlayer({ playerId }: { playerId: string }) {
    const player = { id: playerId };
    this.players.set(playerId, player);
  }

  addPlayerToGameQueue({ playerId }: { playerId: string }) {
    const player = this.getPlayer({ playerId });
    if (player) {
      this.playerQueue.push(player);
      this.maybeCreateGame();
    }
  }

  getPlayer({ playerId }: { playerId: string }): Player | undefined {
    return this.players.get(playerId);
  }

  // if player was in a game, return that game
  removePlayer({ playerId }: { playerId: string }): Game | undefined {
    const game = this.getGame({ playerId });
    this.players.delete(playerId);
    this.playerQueue = this.playerQueue.filter((p) => p.id != playerId);
    return game;
  }

  playerInQueue({ playerId }: { playerId: string }): boolean {
    const player = this.getPlayer({ playerId });
    if (!player) return false;
    return this.playerQueue.find(p => p === player) ? true : false;
  }

  getGameId({ playerId }: { playerId: string }): string | undefined {
    const player = this.getPlayer({ playerId });
    if (!player || !player.gameId) return undefined;
    return player.gameId;
  }

  getGame({ gameId, playerId }: { gameId?: string, playerId?: string }): Game | undefined {
    if (gameId) {
      return this.games.get(gameId);
    } else if (playerId) {
      const player = this.getPlayer({ playerId });
      if (!player || !player.gameId) return undefined;
      return this.games.get(player.gameId);
    } else {
      return undefined;
    }
  }

  removeGame({ gameId }: { gameId: string }) {
    this.games.delete(gameId);
  }

  isInGame({ playerId }: { playerId: string }): boolean {
    return this.getGame({ playerId }) !== undefined;
  }

  isGameOver({ gameId }: { gameId: string }): boolean {
    const game = this.getGame({ gameId });
    if (!game) return false;

    return game.gc.isGameOver;
  }

  placeShip({ playerId, placement }: { playerId: string, placement: Placement }) {
    const player = this.getPlayer({ playerId });
    const game = this.getGame({ playerId });
    if (!game || !player) return;

    if (player === game.player1) game.gc.player1PlaceShip(placement);
    else game.gc.player2PlaceShip(placement);
    console.log(game.gc.player1.gameboard.toString());
    console.log(game.gc.player2.gameboard.toString());
  }

  setDonePlacing({ playerId }: { playerId: string }): void {
    const player = this.getPlayer({ playerId });
    const game = this.getGame({ playerId });
    if (!player || !game) return;
    if (player === game.player1) game.player1DonePlacing = true;
    else game.player2DonePlacing = true;
  }

  allDonePlacing({ gameId }: { gameId: string }): boolean {
    const game = this.getGame({ gameId });
    if (!game) return false;
    return game.player1DonePlacing && game.player2DonePlacing;
  }

  sendAttack({ playerId, coordinate }: { playerId: string, coordinate: Coordinate }): AttackResult | null {
    const player = this.getPlayer({ playerId });
    const game = this.getGame({ playerId });
    if (!player || !game) return null;
    if (player === game.player1) return game.gc.player1Attack(coordinate) as AttackResult
    else return game.gc.player2Attack(coordinate) as AttackResult
  }

  print() {
    console.log('');
    console.log('-----GamesManager-----');
    console.log('players', this.players);
    console.log('games', this.games);
    console.log('playerQueue', this.playerQueue);
    console.log('-----GamesManager-----');
    console.log('');
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

export { AttackResult } from './game/GameController';
export default new GamesManager();
