<template>
  <div>
    <!-- Page Header -->
    <div class="flex items-center gap-4 mb-6">
      <NuxtLink to="/dashboard" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
      </NuxtLink>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">📦 Archived Notes</h1>
    </div>

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

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Notes Grid -->
    <div
      v-else-if="filteredArchivedNotes.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
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
            class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Unarchive"
            @click="handleUnarchive(note)"
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
            class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Delete permanently"
            @click="handleDelete(note)"
          >
            <svg class="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            v-if="note.completed"
            class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
          >
            ✅ Completed
          </span>
        </div>

        <!-- Note Content -->
        <h3
          class="text-lg font-semibold text-gray-900 dark:text-white mb-2"
          :class="{ 'line-through': note.completed }"
        >
          {{ note.title }}
        </h3>
        <p
          class="text-gray-600 dark:text-gray-400 text-sm mb-4"
          :class="{ 'line-through': note.completed }"
        >
          {{ note.content }}
        </p>
        <div class="text-xs text-gray-500 dark:text-gray-400">
          <span>{{ note.category }}</span> • <span>{{ formatDate(note.updatedAt) }}</span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
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
  </div>
</template>

<script setup lang="ts">
  import { useNotesStore } from "~/stores/notes";
  import type { Note } from "~/stores/notes";

  definePageMeta({
    layout: "default",
  });

  const notesStore = useNotesStore();
  const loading = ref(false);
  const selectedCategory = ref("");

  // Inject functions from AppLayout
  const openDeleteModal = inject("openDeleteModal") as (note: Note) => void;
  const showToastMessage = inject("showToastMessage") as (message: string) => void;
  const searchQuery = inject("searchQuery") as Ref<string>;

  const filteredArchivedNotes = computed(() => {
    let filtered = notesStore.notes.filter((note) => note.archived);

    // Filter by category
    if (selectedCategory.value) {
      filtered = filtered.filter((note) => note.category === selectedCategory.value);
    }

    // Filter by search query
    if (searchQuery.value?.trim()) {
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

  // Load notes on component mount
  onMounted(async () => {
    await notesStore.fetchNotes();

    // Listen for notes changes from AppLayout
    const handleNotesChanged = () => {
      // The store should already be updated, but we can trigger a reactive update
      nextTick(() => {
        // Force reactivity update if needed
      });
    };

    window.addEventListener("notesChanged", handleNotesChanged);

    onUnmounted(() => {
      window.removeEventListener("notesChanged", handleNotesChanged);
    });
  });

  const handleUnarchive = async (note: Note) => {
    try {
      await notesStore.updateNote(note.id, { archived: false });
      showToastMessage("Note unarchived successfully!");
    } catch {
      showToastMessage("Failed to unarchive note");
    }
  };

  const handleDelete = (note: Note) => {
    openDeleteModal(note);
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
