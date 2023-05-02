<script setup lang="ts">
import { usePersons } from '../stores/persons';

const { state: personState, getRaffleResult } = usePersons();

getRaffleResult();
</script>

<template>
  <div class="flex flex-col items-center pt-12">
    <h1 class="text-3xl font-bold mb-8">Raffle Results</h1>
    <div class="w-full rounded-md bg-white shadow-md p-4">
      <ul class="space-y-4">
        <li
          class="flex justify-between items-center"
          v-for="value in personState.raffleResult"
          :key="value.person1.id"
        >
          <span class="font-medium text-lg">{{ value.person1.name }}</span>
          <span class="place-self-center">went out with</span>
          <span class="font-medium text-lg">{{ value.person2.name }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
