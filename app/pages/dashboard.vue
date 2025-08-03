<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <!-- Header -->
    <AppHeader
      v-model:search-query="notesStore.searchQuery"
      :user="user"
      :auth-loading="authLoading"
      @toggle-dark-mode="toggleDarkMode"
      @profile="handleProfile"
      @logout="handleLogout"
    />

    <!-- Mobile Search Bar -->
    <MobileSearchBar v-model:search-query="notesStore.searchQuery" />

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Toolbar -->
      <NotesToolbar
        v-model:selected-view="notesStore.selectedView"
        v-model:selected-category="notesStore.selectedCategory"
        v-model:is-grid-view="notesStore.isGridView"
        :categories="notesStore.categories"
        @add-note="openNoteModal()"
      />

      <!-- Notes Grid/List -->
      <NotesGrid
        v-if="notesStore.filteredNotes.length > 0"
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

    <!-- Toast Notification -->
    <ToastNotification :show="showToast" :message="toastMessage" />
  </div>
</template>

<script setup lang="ts">
  import { useNotesStore } from "~/stores/notes";
  import type { Note } from "~/stores/notes";
  import { useAuth } from "~/composables/useAuth";
  import NoteModal from "~/components/NoteModal.vue";
  import DeleteModal from "~/components/DeleteModal.vue";
  import AppHeader from "~/components/AppHeader.vue";
  import MobileSearchBar from "~/components/MobileSearchBar.vue";
  import NotesToolbar from "~/components/NotesToolbar.vue";
  import NotesGrid from "~/components/NotesGrid.vue";
  import EmptyState from "~/components/EmptyState.vue";
  import ToastNotification from "~/components/ToastNotification.vue";

  definePageMeta({
    layout: "default",
  });

  // Store
  const notesStore = useNotesStore();

  // Auth
  const { user, logout, isLoading: authLoading, initializeAuth } = useAuth();

  // Modal states
  const isNoteModalOpen = ref(false);
  const isDeleteModalOpen = ref(false);
  const editingNote = ref<Note | null>(null);
  const deletingNote = ref<Note | null>(null);

  // Toast notification
  const showToast = ref(false);
  const toastMessage = ref("");

  // Load auth when component mounts
  onMounted(async () => {
    try {
      await initializeAuth();
    } catch (error) {
      console.error("Failed to initialize auth:", error);
    }
  });

  // Theme handling
  const isDarkMode = ref(false);

  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
    if (isDarkMode.value) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Initialize theme
  onMounted(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      isDarkMode.value = true;
      document.documentElement.classList.add("dark");
    }
  });

  // Utility functions
  const showToastMessage = (message: string) => {
    toastMessage.value = message;
    showToast.value = true;
    setTimeout(() => {
      showToast.value = false;
    }, 3000);
  };

  // Modal handlers
  const openNoteModal = (note?: Note) => {
    editingNote.value = note || null;
    isNoteModalOpen.value = true;
  };

  const closeNoteModal = () => {
    isNoteModalOpen.value = false;
    editingNote.value = null;
  };

  const openDeleteModal = (note: Note) => {
    deletingNote.value = note;
    isDeleteModalOpen.value = true;
  };

  const closeDeleteModal = () => {
    isDeleteModalOpen.value = false;
    deletingNote.value = null;
  };

  // Note actions
  const handleSaveNote = (noteData: Omit<Note, "id" | "createdAt" | "updated">) => {
    notesStore.addNote(noteData);
    closeNoteModal();
    showToastMessage("Note created successfully!");
  };

  const handleUpdateNote = (id: number, updates: Partial<Note>) => {
    notesStore.updateNote(id, updates);
    closeNoteModal();
    showToastMessage("Note updated successfully!");
  };

  const handleEdit = (note: Note) => {
    openNoteModal(note);
  };

  const handlePin = (note: Note) => {
    notesStore.updateNote(note.id, { isPinned: !note.isPinned });
    showToastMessage(note.isPinned ? "Note unpinned" : "Note pinned");
  };

  const handleComplete = (note: Note) => {
    notesStore.updateNote(note.id, { isCompleted: !note.isCompleted });
    showToastMessage(note.isCompleted ? "Note marked incomplete" : "Note completed");
  };

  const handleArchive = (note: Note) => {
    notesStore.updateNote(note.id, { isArchived: !note.isArchived });
    showToastMessage(note.isArchived ? "Note unarchived" : "Note archived");
  };

  const handleDelete = (note: Note) => {
    openDeleteModal(note);
  };

  const confirmDelete = () => {
    if (deletingNote.value) {
      notesStore.deleteNote(deletingNote.value.id);
      closeDeleteModal();
      showToastMessage("Note deleted successfully!");
    }
  };

  // Profile handling
  const handleProfile = () => {
    // TODO: Navigate to profile page or open profile modal
    console.log("Profile clicked");
  };

  const handleLogout = async () => {
    try {
      await logout();
      showToastMessage("Logged out successfully!");
    } catch (error) {
      console.error("Logout failed:", error);
      showToastMessage("Logout failed");
    }
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
