import Gameboard from '../Gameboard';
import { Direction } from '../Gameboard';

test('All ships sunk when no ships are placed', () => {
  const gameboard = new Gameboard();
  expect(gameboard.allShipsSunk()).toBe(true);
});

test('All ships not sunk when ship is placed and not hit', () => {
  const gameboard = new Gameboard();
  gameboard.placeShip({ start: { x: 0, y: 0 }, shipLength: 4, direction: Direction.DOWN });
  expect(gameboard.allShipsSunk()).toBe(false);
});

describe('All ships sunk when ship is placed and sunked', () => {
  test('ship placed downward', () => {
    const gameboard = new Gameboard();
    gameboard.placeShip({ start: { x: 0, y: 0 }, shipLength: 4, direction: Direction.DOWN });
    for (let i = 0; i < 4; ++i) {
      gameboard.receiveAttack({ x: 0, y: i });
    }
    expect(gameboard.allShipsSunk()).toBe(true);
  });

  test('ship placed rightward', () => {
    const gameboard = new Gameboard();
    gameboard.placeShip({ start: { x: 0, y: 0 }, shipLength: 4, direction: Direction.RIGHT });
    for (let i = 0; i < 4; ++i) {
      gameboard.receiveAttack({ x: i, y: 0 });
    }
    expect(gameboard.allShipsSunk()).toBe(true);
  });
});

describe('All ships not sunk when only partially hit', () => {
  test('ship placed downard', () => {
    const gameboard = new Gameboard();
    gameboard.placeShip({ start: { x: 0, y: 0 }, shipLength: 4, direction: Direction.DOWN });
    gameboard.receiveAttack({ x: 0, y: 0 });
    gameboard.receiveAttack({ x: 0, y: 1 });
    gameboard.receiveAttack({ x: 0, y: 3 });
    expect(gameboard.allShipsSunk()).toBe(false);
  });

  test('ship placed rightward', () => {
    const gameboard = new Gameboard();
    gameboard.placeShip({ start: { x: 0, y: 0 }, shipLength: 4, direction: Direction.RIGHT });
    gameboard.receiveAttack({ x: 0, y: 0 });
    gameboard.receiveAttack({ x: 1, y: 0 });
    gameboard.receiveAttack({ x: 3, y: 0 });
    expect(gameboard.allShipsSunk()).toBe(false);
  });
});

describe('Error thrown when ship placed outside of grid', () => {
  test('Starting coordinate out of bounds', () => {
    const gameboard = new Gameboard();
    expect(() => gameboard.placeShip({ start: { x: 0, y: -1 }, shipLength: 4, direction: Direction.DOWN })).toThrow();
  });
});
