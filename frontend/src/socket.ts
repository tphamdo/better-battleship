import { io } from 'socket.io-client'
import { reactive } from 'vue'

export const socket = io('http://localhost:3000/')
export const state = reactive({
  connected: false,
  foundGame: false,
  opponentDisconnected: false,
  gameStarted: false,
  gameOver: false,
});

function resetState() {
  state.connected = false;
  state.foundGame = false;
  state.opponentDisconnected = false;
  state.gameStarted = false;
  state.gameOver = false;
}

socket.on('connect', () => {
  state.connected = true;
  console.log('connected with socket id of', socket.id)
})

socket.on('found game', () => {
  console.log('found game');
  state.foundGame = true;
})

socket.on('all done placing', () => {
  console.log('all done placing');
  state.gameStarted = true;
})

socket.on('game over', () => {
  console.log('game over');
  state.gameOver = true;
})

socket.on('opponent disconnected', () => {
  console.log('opponent disconnected');
  state.opponentDisconnected = true;
  socket.emit('end connection');
})

socket.on('disconnect', (reason) => {
  state.connected = false;
  console.log('disconnected with reason', reason)
})
