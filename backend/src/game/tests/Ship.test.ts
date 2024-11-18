import Ship from '../Ship';

test('Length must be > 0', () => {
  expect(() => new Ship(0)).toThrow();
  expect(() => new Ship(-5)).toThrow();
});

test('New ship is not sunk', () => {
  expect(new Ship(1).isSunk()).toBe(false);
});

test('New ship has the right length', () => {
  expect(new Ship(5).length).toBe(5);
});

test('Hit ship is sunk', () => {
  const ship = new Ship(1);
  ship.hit(0);
  expect(ship.isSunk()).toBe(true);
});

test('Miss ship is not sunk', () => {
  const ship = new Ship(1);
  ship.hit(1);
  ship.hit(-1);
  expect(ship.isSunk()).toBe(false);
});

test('Long ship without all hits not sunk', () => {
  const ship = new Ship(4);
  ship.hit(0);
  ship.hit(1);
  ship.hit(3);
  expect(ship.isSunk()).toBe(false);
});

test('Long ship with all hits is sunk', () => {
  const ship = new Ship(4);
  ship.hit(0);
  ship.hit(1);
  ship.hit(2);
  ship.hit(3);
  expect(ship.isSunk()).toBe(true);
});
