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
                📦 Archived Notes
              </h1>
            </div>
          </div>

          <!-- Search Bar -->
          <div class="hidden md:block flex-1 max-w-lg mx-8">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search archived notes..."
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
          v-for="note in filteredArchivedNotes"
          :key="note.id"
          :class="[
            'bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 dark:border-gray-700 relative p-4 opacity-60',
            note.color,
          ]"
        >
          <!-- Actions -->
          <div class="absolute top-3 right-3 flex gap-1">
            <button
              @click="handleUnarchive(note)"
              class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Unarchive"
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
                  d="M7 16l3-3m0 0l3 3m-3-3v6m0-10V4a2 2 0 012-2h4a2 2 0 012 2v1M7 8h10"
                />
              </svg>
            </button>
            <button
              @click="handleDelete(note)"
              class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Delete permanently"
            >
              <svg
                class="h-4 w-4 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>

          <!-- Archived indicator -->
          <div class="flex items-center gap-2 mb-2">
            <span
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
            >
              📦 Archived
            </span>
            <span
              v-if="note.isCompleted"
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
            >
              ✅ Completed
            </span>
          </div>

          <!-- Note Content -->
          <h3
            class="text-lg font-semibold text-gray-900 dark:text-white mb-2"
            :class="{ 'line-through': note.isCompleted }"
          >
            {{ note.title }}
          </h3>
          <p
            class="text-gray-600 dark:text-gray-400 text-sm mb-4"
            :class="{ 'line-through': note.isCompleted }"
          >
            {{ note.content }}
          </p>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            <span>{{ note.category }}</span> • <span>{{ formatDate(note.updated) }}</span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredArchivedNotes.length === 0" class="text-center py-12">
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
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900 dark:text-white">No archived notes</h3>
        <p class="mt-1 text-gray-500 dark:text-gray-400">Archive some notes to see them here.</p>
      </div>
    </main>

    <!-- Delete Confirmation Modal -->
    <DeleteModal
      :is-open="isDeleteModalOpen"
      :note-title="deletingNote?.title || ''"
      @close="closeDeleteModal"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
  import { useNotesStore } from "~/stores/notes";
  import type { Note } from "~/stores/notes";
  import DeleteModal from "~/components/DeleteModal.vue";

  definePageMeta({
    layout: "default",
  });

  const notesStore = useNotesStore();
  const searchQuery = ref("");
  const selectedCategory = ref("");
  const isDeleteModalOpen = ref(false);
  const deletingNote = ref<Note | null>(null);

  const filteredArchivedNotes = computed(() => {
    let filtered = notesStore.notes.filter((note) => note.isArchived);

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

  const handleUnarchive = (note: Note) => {
    notesStore.updateNote(note.id, { ...note, isArchived: false });
  };

  const handleDelete = (note: Note) => {
    deletingNote.value = note;
    isDeleteModalOpen.value = true;
  };

  const closeDeleteModal = () => {
    isDeleteModalOpen.value = false;
    deletingNote.value = null;
  };

  const confirmDelete = () => {
    if (deletingNote.value) {
      notesStore.deleteNote(deletingNote.value.id);
      closeDeleteModal();
    }
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
