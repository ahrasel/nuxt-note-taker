<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">Simple Dashboard Test</h1>
    <p class="text-gray-600">This is a test to see if the page loads</p>

    <div v-if="notesStore" class="mt-4 p-4 bg-gray-100 rounded">
      <p>Store loaded successfully!</p>
      <p>Notes count: {{ notesStore.notes?.length || 0 }}</p>
    </div>

    <div v-else class="mt-4 p-4 bg-red-100 rounded">
      <p>Store failed to load</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useNotesStore } from "~/stores/notes";

  definePageMeta({
    layout: "default",
  });

  const notesStore = useNotesStore();
</script>
