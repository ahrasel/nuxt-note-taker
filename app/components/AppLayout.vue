<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <!-- Header -->
    <AppHeader
      v-model:search-query="searchQuery"
      :user="user"
      :auth-loading="authLoading"
      @toggle-dark-mode="toggleDarkMode"
      @profile="handleProfile"
      @logout="handleLogout"
    />

    <!-- Mobile Search Bar -->
    <MobileSearchBar v-model:search-query="searchQuery" />

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <slot />
    </main>

    <!-- Global Modals -->
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
  import { useAuth } from "~/composables/useAuth";
  import type { Note } from "~/stores/notes";

  // Components
  import AppHeader from "~/components/AppHeader.vue";
  import MobileSearchBar from "~/components/MobileSearchBar.vue";
  import NoteModal from "~/components/NoteModal.vue";
  import DeleteModal from "~/components/DeleteModal.vue";
  import ToastNotification from "~/components/ToastNotification.vue";

  // Props
  interface Props {
    title?: string;
    showSearch?: boolean;
  }

  withDefaults(defineProps<Props>(), {
    title: "Notes",
    showSearch: true,
  });

  // Composables
  const { user, logout, isLoading: authLoading, initializeAuth } = useAuth();

  // Search functionality
  const searchQuery = ref("");

  // Modal states
  const isNoteModalOpen = ref(false);
  const isDeleteModalOpen = ref(false);
  const editingNote = ref<Note | null>(null);
  const deletingNote = ref<Note | null>(null);

  // Toast notification
  const showToast = ref(false);
  const toastMessage = ref("");

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

  // Initialize theme and auth
  onMounted(async () => {
    // Initialize theme
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      isDarkMode.value = true;
      document.documentElement.classList.add("dark");
    }

    // Initialize auth
    try {
      await initializeAuth();
    } catch (error) {
      console.error("Failed to initialize auth:", error);
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

  // Note actions (to be implemented by pages)
  const handleSaveNote = async (
    noteData: Omit<Note, "id" | "userId" | "createdAt" | "updatedAt">
  ) => {
    try {
      const { useNotesStore } = await import("~/stores/notes");
      const notesStore = useNotesStore();

      // Use the store method to create note
      await notesStore.addNote(noteData);

      closeNoteModal();
      showToastMessage("Note created successfully!");
      refreshNotes();
    } catch (error) {
      console.error("Failed to create note:", error);
      showToastMessage("Failed to create note");
    }
  };

  const handleUpdateNote = async (id: number, updates: Partial<Note>) => {
    try {
      const { useNotesStore } = await import("~/stores/notes");
      const notesStore = useNotesStore();

      // Use the store method to update note
      await notesStore.updateNote(id, updates);

      closeNoteModal();
      showToastMessage("Note updated successfully!");
      refreshNotes();
    } catch (error) {
      console.error("Failed to update note:", error);
      showToastMessage("Failed to update note");
    }
  };

  const confirmDelete = async () => {
    if (!deletingNote.value) return;

    try {
      const { useNotesStore } = await import("~/stores/notes");
      const notesStore = useNotesStore();

      // Use the store method to delete note
      await notesStore.deleteNote(deletingNote.value.id);

      closeDeleteModal();
      showToastMessage("Note deleted successfully!");
      refreshNotes();
    } catch (error) {
      console.error("Failed to delete note:", error);
      showToastMessage("Failed to delete note");
    }
  };

  // Profile handling
  const handleProfile = () => {
    // Navigate to profile page
    navigateTo("/profile");
  };

  const handleLogout = async () => {
    try {
      await logout();
      showToastMessage("Logged out successfully!");
      await navigateTo("/");
    } catch (error) {
      console.error("Logout failed:", error);
      showToastMessage("Logout failed");
    }
  };

  // Provide global functions for child components
  provide("openNoteModal", openNoteModal);
  provide("openDeleteModal", openDeleteModal);
  provide("showToastMessage", showToastMessage);
  provide("searchQuery", searchQuery);

  // Event bus for refreshing notes
  const refreshNotes = () => {
    // This function can be called to refresh notes
    const event = new CustomEvent("notesChanged");
    window.dispatchEvent(event);
  };

  provide("refreshNotes", refreshNotes);
</script>
