enum Hit {
  No,
  Yes,
}

class Ship {
  private _ship: Array<Hit>;

  constructor(length: number) {
    if (length < 1)
      throw new Error("Invalid length argument");
    this._ship = Array(length).fill(Hit.No);
  }

  public get length() {
    return this._ship.length;
  }

  public hit(pos: number) {
    if (pos >= 0 && pos < this.length)
      this._ship[pos] = Hit.Yes;
  }

  public isSunk(): boolean {
    const hits = this._ship.filter(pos => pos === Hit.Yes).length;
    return hits === this.length;
  }
}

export default Ship;
