import GameController from '../GameController';
import { AttackResult, Direction, PlaceShipResult } from '../GameController';

test('Return PlaceResult.SUCCESS when placing on valid positions', () => {
  const gc = new GameController();

  expect(gc.player1PlaceShip({
    start: { x: 5, y: 5 },
    shipLength: 4,
    direction: Direction.DOWN,
  })).toBe(PlaceShipResult.SUCCESS);
  expect(gc.player2PlaceShip({
    start: { x: 2, y: 2 },
    shipLength: 4,
    direction: Direction.RIGHT,
  })).toBe(PlaceShipResult.SUCCESS);
});

test('Return PlaceResult.FAIL when placing outside of board', () => {
  const gc = new GameController();

  expect(gc.player1PlaceShip({
    start: { x: -1, y: 3 },
    shipLength: 4,
    direction: Direction.DOWN,
  })).toBe(PlaceShipResult.FAIL);

  expect(gc.player2PlaceShip({
    start: { x: 8, y: 2 },
    shipLength: 4,
    direction: Direction.RIGHT,
  })).toBe(PlaceShipResult.FAIL);
});

test('Return PlaceResult.FAIL when placing on top of another ship', () => {
  const gc = new GameController();

  gc.player1PlaceShip({
    start: { x: 5, y: 5 },
    shipLength: 4,
    direction: Direction.DOWN,
  });
  gc.player2PlaceShip({
    start: { x: 2, y: 2 },
    shipLength: 4,
    direction: Direction.RIGHT,
  });
  expect(gc.player1PlaceShip({
    start: { x: 3, y: 5 },
    shipLength: 4,
    direction: Direction.RIGHT,
  })).toBe(PlaceShipResult.FAIL);
  expect(gc.player2PlaceShip({
    start: { x: 2, y: 2 },
    shipLength: 4,
    direction: Direction.RIGHT,
  })).toBe(PlaceShipResult.FAIL);
});

test('Game is not over after players place ships', () => {
  const gc = new GameController();

  gc.player1PlaceShip({
    start: { x: 3, y: 3 },
    shipLength: 4,
    direction: Direction.DOWN,
  });
  gc.player2PlaceShip({
    start: { x: 0, y: 0 },
    shipLength: 4,
    direction: Direction.RIGHT,
  });

  expect(gc.isGameOver).toBe(false);
});

test('Return hit when attack is successful', () => {
  const gc = new GameController();

  gc.player1PlaceShip({
    start: { x: 5, y: 5 },
    shipLength: 4,
    direction: Direction.DOWN,
  });
  gc.player2PlaceShip({
    start: { x: 0, y: 0 },
    shipLength: 4,
    direction: Direction.RIGHT,
  });

  expect(gc.player1Attack({ x: 3, y: 0 })).toBe(AttackResult.HIT);
  expect(gc.player2Attack({ x: 5, y: 8 })).toBe(AttackResult.HIT);
});

test('Return miss when attack is unsuccessful', () => {
  const gc = new GameController();

  gc.player1PlaceShip({
    start: { x: 5, y: 5 },
    shipLength: 4,
    direction: Direction.DOWN,
  });
  gc.player2PlaceShip({
    start: { x: 0, y: 0 },
    shipLength: 4,
    direction: Direction.RIGHT,
  });

  expect(gc.player1Attack({ x: 4, y: 0 })).toBe(AttackResult.MISS);
  expect(gc.player2Attack({ x: 5, y: 9 })).toBe(AttackResult.MISS);
});

describe('Return not your turn when player plays out of turn', () => {
  test('Player 1 plays out of turn', () => {
    const gc = new GameController();

    gc.player1PlaceShip({
      start: { x: 0, y: 0 },
      shipLength: 4,
      direction: Direction.RIGHT,
    });
    gc.player2PlaceShip({
      start: { x: 0, y: 0 },
      shipLength: 4,
      direction: Direction.RIGHT,
    });

    gc.player1Attack({ x: 0, y: 0 });
    gc.player2Attack({ x: 0, y: 0 });
    gc.player1Attack({ x: 1, y: 0 });
    expect(gc.player1Attack({ x: 4, y: 0 })).toBe(AttackResult.NOT_YOUR_TURN);
  });

  test('Player 2 plays out of turn', () => {
    const gc = new GameController();

    gc.player1PlaceShip({
      start: { x: 0, y: 0 },
      shipLength: 4,
      direction: Direction.RIGHT,
    });
    gc.player2PlaceShip({
      start: { x: 0, y: 0 },
      shipLength: 4,
      direction: Direction.RIGHT,
    });

    gc.player1Attack({ x: 0, y: 0 });
    gc.player2Attack({ x: 0, y: 0 });
    expect(gc.player2Attack({ x: 4, y: 0 })).toBe(AttackResult.NOT_YOUR_TURN);
  });
});

describe('Game over when one players ships are sunk', () => {
  test('One ship sunk for player 1', () => {
    const gc = new GameController();

    gc.player1PlaceShip({
      start: { x: 0, y: 0 },
      shipLength: 2,
      direction: Direction.RIGHT,
    });
    gc.player2PlaceShip({
      start: { x: 0, y: 0 },
      shipLength: 2,
      direction: Direction.RIGHT,
    });

    gc.player1Attack({ x: 0, y: 0 });
    gc.player2Attack({ x: 0, y: 0 });
    gc.player1Attack({ x: 1, y: 0 });
    expect(gc.isGameOver).toBe(true);
  });

  test('One ship sunk for player 2', () => {
    const gc = new GameController();

    gc.player1PlaceShip({
      start: { x: 0, y: 0 },
      shipLength: 2,
      direction: Direction.RIGHT,
    });
    gc.player2PlaceShip({
      start: { x: 0, y: 0 },
      shipLength: 2,
      direction: Direction.RIGHT,
    });

    gc.player1Attack({ x: 9, y: 9 });
    gc.player2Attack({ x: 0, y: 0 });
    gc.player1Attack({ x: 9, y: 9 });
    gc.player2Attack({ x: 1, y: 0 });
    expect(gc.isGameOver).toBe(true);
  });

  test('Multiple ships sunk', () => {
    const gc = new GameController();

    gc.player1PlaceShip({
      start: { x: 0, y: 0 },
      shipLength: 2,
      direction: Direction.RIGHT,
    });
    gc.player1PlaceShip({
      start: { x: 0, y: 2 },
      shipLength: 2,
      direction: Direction.RIGHT,
    });
    gc.player2PlaceShip({
      start: { x: 0, y: 0 },
      shipLength: 2,
      direction: Direction.RIGHT,
    });

    gc.player1Attack({ x: 0, y: 0 });
    gc.player2Attack({ x: 9, y: 9 });
    gc.player1Attack({ x: 1, y: 0 });
    gc.player2Attack({ x: 9, y: 9 });
    gc.player1Attack({ x: 0, y: 2 });
    gc.player2Attack({ x: 9, y: 9 });
    gc.player1Attack({ x: 1, y: 2 });
    expect(gc.isGameOver).toBe(true);
  });
});
