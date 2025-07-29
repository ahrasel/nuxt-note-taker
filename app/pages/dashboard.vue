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
            <div class="flex-shrink-0">
              <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                📝 NoteTaker
              </h1>
            </div>
          </div>

          <!-- Search Bar -->
          <div class="hidden md:block flex-1 max-w-lg mx-8">
            <div class="relative">
              <input
                v-model="notesStore.searchQuery"
                type="text"
                placeholder="Search notes..."
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

          <!-- User Menu -->
          <div class="flex items-center space-x-4">
            <!-- Theme Toggle -->
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

            <!-- Profile -->
            <div class="relative">
              <button
                class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span class="text-white text-sm font-medium">U</span>
                </div>
                <span class="hidden sm:block text-gray-700 dark:text-gray-300 text-sm">User</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Mobile Search Bar -->
    <div
      class="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3"
    >
      <div class="relative">
        <input
          v-model="notesStore.searchQuery"
          type="text"
          placeholder="Search notes..."
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

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Toolbar -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <!-- Categories and View Toggle -->
        <div class="flex flex-wrap items-center gap-2">
          <select
            v-model="notesStore.selectedCategory"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          >
            <option value="">All Categories</option>
            <option v-for="category in notesStore.categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>

          <!-- View Toggle -->
          <div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              :class="[
                'p-2 rounded transition-colors',
                notesStore.isGridView
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
              ]"
              @click="notesStore.isGridView = true"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
            <button
              :class="[
                'p-2 rounded transition-colors',
                !notesStore.isGridView
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
              ]"
              @click="notesStore.isGridView = false"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Add Note Button -->
        <button
          class="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
          @click="openNoteModal()"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>New Note</span>
        </button>
      </div>

      <!-- Notes Grid/List -->
      <div
        :class="[
          'gap-4',
          notesStore.isGridView
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'flex flex-col space-y-4',
        ]"
      >
        <div
          v-for="note in notesStore.filteredNotes"
          :key="note.id"
          :class="[
            'bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer border border-gray-200 dark:border-gray-700 relative',
            notesStore.isGridView ? 'p-4' : 'p-4 sm:p-6',
            note.color,
          ]"
          @click="openNoteModal(note)"
        >
          <!-- Note Content -->
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {{ note.title }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
            {{ note.content }}
          </p>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            <span>{{ note.category }}</span> • <span>{{ formatDate(note.updated) }}</span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="notesStore.filteredNotes.length === 0" class="text-center py-12">
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900 dark:text-white">No notes found</h3>
        <p class="mt-1 text-gray-500 dark:text-gray-400">
          {{
            notesStore.searchQuery || notesStore.selectedCategory
              ? "Try adjusting your search or filters"
              : "Get started by creating your first note"
          }}
        </p>
        <div class="mt-6">
          <button
            @click="openNoteModal()"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Note
          </button>
        </div>
      </div>
    </main>

    <!-- Modals -->
    <NoteModal
      :is-open="isNoteModalOpen"
      :note="editingNote"
      @close="closeNoteModal"
      @save="handleSaveNote"
      @update="handleUpdateNote"
    />

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
  import NoteModal from "~/components/NoteModal.vue";
  import DeleteModal from "~/components/DeleteModal.vue";

  definePageMeta({
    layout: "default",
  });

  // Store
  const notesStore = useNotesStore();

  // Modal states
  const isNoteModalOpen = ref(false);
  const isDeleteModalOpen = ref(false);
  const editingNote = ref<Note | null>(null);
  const deletingNote = ref<Note | null>(null);

  // Modal handlers
  const openNoteModal = (note?: Note) => {
    editingNote.value = note || null;
    isNoteModalOpen.value = true;
  };

  const closeNoteModal = () => {
    isNoteModalOpen.value = false;
    editingNote.value = null;
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

  const handleSaveNote = (noteData: Omit<Note, "id" | "createdAt" | "updated">) => {
    notesStore.addNote(noteData);
    closeNoteModal();
  };

  const handleUpdateNote = (id: number, updates: Partial<Note>) => {
    notesStore.updateNote(id, updates);
    closeNoteModal();
  };

  // Dark mode toggle
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
  };

  // Date formatting utility
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
</script>

<style scoped>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-clamp: 2;
  }

  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-clamp: 3;
  }
</style>
