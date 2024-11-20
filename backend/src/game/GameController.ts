import Player from './Player';
import { Placement, Coordinate, AttackResult as _AttackResult } from './Gameboard';

class GameController {
  readonly player1: Player;
  readonly player2: Player;
  private _turn: PLAYER;

  static readonly SHIP_SIZES = [
    ...Array(1).fill(5),
    ...Array(1).fill(4),
    ...Array(2).fill(3),
    ...Array(1).fill(2),
  ];

  constructor() {
    this.player1 = new Player({});
    this.player2 = new Player({});
    this._turn = PLAYER.P1;
  }

  get isGameOver(): boolean {
    return this.player1.isLost || this.player2.isLost;
  }

  public player1PlaceShip(placement: Placement): PlaceShipResult {
    return this._placeShip({ player: this.player1, placement });
  }

  public player2PlaceShip(placement: Placement): PlaceShipResult {
    return this._placeShip({ player: this.player2, placement });
  }

  public player1Attack(coord: Coordinate): AttackResult {
    return this._playTurn({ coord, player: this.player1 });
  }

  public player2Attack(coord: Coordinate): AttackResult {
    return this._playTurn({ coord, player: this.player2 });
  }

  private _placeShip({ player, placement }: {
    player: Player, placement: Placement
  }): PlaceShipResult {
    try {
      player.placeShip(placement);
      return PlaceShipResult.SUCCESS;
    } catch (error) {
      return PlaceShipResult.FAIL;
    }
  }

  private _playTurn({
    coord,
    player,
  }: {
    coord: Coordinate;
    player: Player;
  }): AttackResult {
    console.log('turn', this._turn);
    if (this._activePlayer !== player)
      return AttackResult.NOT_YOUR_TURN;

    try {
      const attackResult: AttackResult = this._waitingPlayer.receiveAttack(coord);
      console.log('turn', this._turn);
      this._switchPlayerTurn();
      console.log('turn', this._turn);
      return attackResult;
    } catch (error) {
      return AttackResult.INTERNAL_ERROR;
    }
  }

  private _switchPlayerTurn(): void {
    this._turn =
      this._turn === PLAYER.P1 ? PLAYER.P2 : PLAYER.P1;
  }

  private get _activePlayer(): Player {
    console.log(this._turn, PLAYER.P1, PLAYER.P2);
    return this._turn === PLAYER.P1 ? this.player1 : this.player2;
  }

  private get _waitingPlayer(): Player {
    return this._turn === PLAYER.P1 ? this.player2 : this.player1;
  }
}

enum PLAYER {
  P1,
  P2,
}

export enum PlaceShipResult {
  FAIL = 'Invalid placement',
  SUCCESS = 'Success'
}

export enum AttackError {
  INTERNAL_ERROR = 'Internal error',
  NOT_YOUR_TURN = 'Not your turn',
}
export type AttackResult = AttackError | _AttackResult;
export const AttackResult = { ...AttackError, ..._AttackResult };

export { Coordinate, Direction } from './Gameboard';

export default GameController;
