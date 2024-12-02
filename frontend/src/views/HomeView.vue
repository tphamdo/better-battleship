<script setup lang="ts">
import { state, socket } from '../socket';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const lookingForGame = ref(false);

function startGame() {
  lookingForGame.value = true;
  socket.emit('join game');
}

watch(() => state.foundGame, (foundGame) => {
  if (foundGame) router.push('/game');
  state.foundGame = false;
});

</script>

<template>
  <h1>Main page</h1>
  <button @click="startGame">Start Game</button>
  <p>Found game: {{ state.foundGame }} </p>
  <p v-if="lookingForGame">Looking for game</p>
</template>

<style scoped></style>
