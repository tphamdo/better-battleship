<script setup lang="ts">
import GameBoard from '../components/GameBoard.vue'
import { socket, state } from '../socket';
import { useRouter } from 'vue-router';
import { watch } from 'vue';

const router = useRouter();

socket.emit('is in game', (res) => {
  console.log('is in game', res);
  if (!res.inGame) router.push('/');
});

watch(() => state.opponentDisconnected, (disconnected) => {
  if (disconnected) router.push('/');
  state.opponentDisconnected = false;
});
</script>

<template>
  <main>
    <div class="boards">
      <GameBoard :my-board="true" />
      <GameBoard :opponent-board="true" />
    </div>
  </main>
</template>

<style scoped>
.boards {
  display: flex;
  justify-content: space-around;
  border: 1px solid red;
  flex-wrap: wrap;
  gap: 20px;
}
</style>
