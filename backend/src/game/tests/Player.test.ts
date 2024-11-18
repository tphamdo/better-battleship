import Player from '../Player';
import { Direction } from '../Gameboard';

test('Player is not lost after placing ship', () => {
  const player = new Player({});
  player.placeShip({ start: { x: 0, y: 0 }, shipLength: 4, direction: Direction.DOWN });
  expect(player.isLost).toBe(false);
});

test('Player is not lost after ship is only partially hit', () => {
  const player = new Player({});
  player.placeShip({ start: { x: 0, y: 0 }, shipLength: 4, direction: Direction.DOWN });
  player.receiveAttack({ x: 0, y: 0 });
  player.receiveAttack({ x: 0, y: 3 });
  expect(player.isLost).toBe(false);
});

test('Player is lost after ship is sunk', () => {
  const player = new Player({});
  player.placeShip({ start: { x: 0, y: 0 }, shipLength: 4, direction: Direction.DOWN });
  for (let i = 0; i < 4; ++i) {
    player.receiveAttack({ x: 0, y: 0 + i });
  }
  expect(player.isLost).toBe(true);
});

test('Player is lost after multiple ships are sunk', () => {
  const player = new Player({});
  player.placeShip({ start: { x: 0, y: 0 }, shipLength: 4, direction: Direction.DOWN });
  player.placeShip({ start: { x: 2, y: 2 }, shipLength: 4, direction: Direction.DOWN });
  for (let i = 0; i < 4; ++i) {
    player.receiveAttack({ x: 0, y: 0 + i });
    player.receiveAttack({ x: 2, y: 2 + i });
  }
  expect(player.isLost).toBe(true);
});

test('Player is not lost if only one of many ships is sunk', () => {
  const player = new Player({});
  player.placeShip({ start: { x: 0, y: 0 }, shipLength: 4, direction: Direction.DOWN });
  player.placeShip({ start: { x: 2, y: 2 }, shipLength: 4, direction: Direction.DOWN });
  for (let i = 0; i < 4; ++i) {
    player.receiveAttack({ x: 0, y: 0 + i });
  }
  expect(player.isLost).toBe(false);
});
