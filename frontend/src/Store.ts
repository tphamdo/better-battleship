class Store {
  savePlayerId(playerId: string): void {
    localStorage.setItem('playerId', playerId);
  }

  getPlayerId(): string | null {
    return localStorage.getItem('playerId');
  }

  clearPlayerId(): void {
    localStorage.removeItem('playerId');
  }
}

export default new Store();
