<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <!-- Header -->
    <header
      class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo and Title -->
          <div class="flex items-center space-x-4">
            <NuxtLink
              to="/dashboard"
              class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </NuxtLink>
            <div class="flex-shrink-0">
              <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                ✅ Completed Notes
              </h1>
            </div>
          </div>

          <!-- Search Bar -->
          <div class="hidden md:block flex-1 max-w-lg mx-8">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search completed notes..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <svg
                class="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-4">
            <button
              class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              @click="toggleDarkMode"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Toolbar -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div class="flex flex-wrap items-center gap-2">
          <select
            v-model="selectedCategory"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          >
            <option value="">All Categories</option>
            <option v-for="category in notesStore.categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
      </div>

      <!-- Notes Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div
          v-for="note in filteredCompletedNotes"
          :key="note.id"
          :class="[
            'bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 dark:border-gray-700 relative p-4 opacity-75',
            note.color,
          ]"
        >
          <!-- Actions -->
          <div class="absolute top-3 right-3">
            <button
              @click="handleMarkIncomplete(note)"
              class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Mark as incomplete"
            >
              <svg
                class="h-4 w-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>

          <!-- Completed indicator -->
          <div class="flex items-center gap-2 mb-2">
            <span
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
            >
              <svg class="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              Completed
            </span>
          </div>

          <!-- Note Content -->
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-through">
            {{ note.title }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm mb-4 line-through">
            {{ note.content }}
          </p>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            <span>{{ note.category }}</span> • <span>{{ formatDate(note.updated) }}</span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredCompletedNotes.length === 0" class="text-center py-12">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900 dark:text-white">No completed notes</h3>
        <p class="mt-1 text-gray-500 dark:text-gray-400">Complete some notes to see them here.</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
  import { useNotesStore } from "~/stores/notes";
  import type { Note } from "~/stores/notes";

  definePageMeta({
    layout: "default",
  });

  const notesStore = useNotesStore();
  const searchQuery = ref("");
  const selectedCategory = ref("");

  const filteredCompletedNotes = computed(() => {
    let filtered = notesStore.notes.filter((note) => note.isCompleted && !note.isArchived);

    // Filter by category
    if (selectedCategory.value) {
      filtered = filtered.filter((note) => note.category === selectedCategory.value);
    }

    // Filter by search query
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query) ||
          note.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  });

  const handleMarkIncomplete = (note: Note) => {
    notesStore.updateNote(note.id, { ...note, isCompleted: false });
  };

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
</script>
