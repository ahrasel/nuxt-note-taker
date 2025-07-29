<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold">Minimal Dashboard Test</h1>
    <p class="mt-4">Testing basic functionality...</p>

    <div class="mt-4 space-y-2">
      <div>Notes count: {{ notes.length }}</div>
      <div>Search query: "{{ searchQuery }}"</div>
      <div>Grid view: {{ isGridView }}</div>
    </div>

    <div class="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="note in notes" :key="note.id" class="p-4 bg-white border rounded-lg shadow">
        <h3 class="font-semibold">{{ note.title }}</h3>
        <p class="text-sm text-gray-600 mt-2">{{ note.content }}</p>
        <div class="text-xs text-gray-500 mt-2">{{ note.category }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({
    layout: "default",
  });

  // Simple reactive state without store
  const searchQuery = ref("");
  const isGridView = ref(true);

  const notes = ref([
    {
      id: 1,
      title: "Test Note 1",
      content: "This is a test note to check if basic functionality works",
      category: "Test",
      updated: "now",
    },
    {
      id: 2,
      title: "Test Note 2",
      content: "Another test note to verify the page loads correctly",
      category: "Test",
      updated: "now",
    },
  ]);
</script>
