export class Ship {
  readonly len: number;
  constructor(len: number) {
    this.len = len;
  }
}

export default class Ships {
  private _SHIPS: Ship[] = [
    new Ship(5),
    new Ship(4),
    new Ship(3),
    new Ship(3),
    new Ship(2),
  ];
  private _idx = 0;

  public get curShip(): Ship | null {
    if (this._idx >= this._SHIPS.length) return null;
    return this._SHIPS[this._idx];
  }

  public next() {
    ++this._idx;
  }

  public constructor() { }
}
