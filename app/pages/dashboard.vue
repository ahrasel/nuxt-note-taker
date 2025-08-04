<template>
  <div>
    <!-- Toolbar -->
    <NotesToolbar
      v-model:selected-view="notesStore.selectedView"
      v-model:selected-category="notesStore.selectedCategory"
      v-model:is-grid-view="notesStore.isGridView"
      :categories="notesStore.categories"
      @add-note="openNoteModal()"
    />

    <!-- Loading State -->
    <div v-if="notesStore.loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="notesStore.error" class="text-center py-8">
      <p class="text-red-600 dark:text-red-400">{{ notesStore.error }}</p>
      <button
        class="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        @click="refreshData"
      >
        Retry
      </button>
    </div>

    <!-- Notes Grid/List -->
    <NotesGrid
      v-else-if="notesStore.filteredNotes.length > 0"
      :notes="notesStore.filteredNotes"
      :is-grid-view="notesStore.isGridView"
      @edit="handleEdit"
      @pin="handlePin"
      @complete="handleComplete"
      @archive="handleArchive"
      @delete="handleDelete"
      @view="openNoteModal"
    />

    <!-- Empty State -->
    <EmptyState
      v-else
      :message="
        notesStore.searchQuery || notesStore.selectedCategory
          ? 'Try adjusting your search or filters'
          : 'Get started by creating your first note'
      "
      @create-note="openNoteModal()"
    />
  </div>
</template>

<script setup lang="ts">
  import { useNotesStore } from "~/stores/notes";
  import type { Note } from "~/stores/notes";

  // Components
  import NotesToolbar from "~/components/NotesToolbar.vue";
  import NotesGrid from "~/components/NotesGrid.vue";
  import EmptyState from "~/components/EmptyState.vue";

  definePageMeta({
    layout: "default",
  });

  // Store
  const notesStore = useNotesStore();

  // Inject functions from AppLayout
  const openNoteModal = inject("openNoteModal") as (note?: Note) => void;
  const openDeleteModal = inject("openDeleteModal") as (note: Note) => void;
  const showToastMessage = inject("showToastMessage") as (message: string) => void;

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

  // Watch for search query changes
  const searchQuery = inject("searchQuery") as Ref<string>;
  watch(
    searchQuery,
    (newQuery) => {
      notesStore.searchQuery = newQuery;
    },
    { immediate: true }
  );

  // Watch for view changes to refetch data
  watch(
    () => notesStore.selectedView,
    async (newView) => {
      await notesStore.fetchNotes({ status: newView });
    }
  );

  // Watch for notes array changes to detect new notes
  watch(
    () => notesStore.notes.length,
    () => {
      // This will trigger when notes are added/removed through the store
    },
    { flush: "post" }
  );

  // Refresh data function
  const refreshData = async () => {
    await notesStore.fetchNotes({
      status: notesStore.selectedView,
      search: notesStore.searchQuery,
    });
  };

  // Note actions
  const handleEdit = (note: Note) => {
    openNoteModal(note);
  };

  const handlePin = async (note: Note) => {
    try {
      await notesStore.updateNote(note.id, { pinned: !note.pinned });
      showToastMessage(note.pinned ? "Note unpinned" : "Note pinned");
    } catch {
      showToastMessage("Failed to update note");
    }
  };

  const handleComplete = async (note: Note) => {
    try {
      await notesStore.updateNote(note.id, { completed: !note.completed });
      showToastMessage(note.completed ? "Note marked incomplete" : "Note completed");
      // Refresh notes to update the view
      await refreshData();
    } catch {
      showToastMessage("Failed to update note");
    }
  };

  const handleArchive = async (note: Note) => {
    try {
      await notesStore.updateNote(note.id, { archived: !note.archived });
      showToastMessage(note.archived ? "Note unarchived" : "Note archived");
      // Refresh notes to update the view
      await refreshData();
    } catch {
      showToastMessage("Failed to update note");
    }
  };

  const handleDelete = (note: Note) => {
    openDeleteModal(note);
  };
</script>
