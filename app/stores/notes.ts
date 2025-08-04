import { defineStore } from "pinia";

export interface Note {
  id: number;
  title: string;
  content: string;
  category: string;
  color: string;
  pinned: boolean;
  completed: boolean;
  archived: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export const useNotesStore = defineStore("notes", () => {
  // State
  const notes = ref<Note[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const searchQuery = ref("");
  const selectedCategory = ref("");
  const selectedView = ref("active"); // active, completed, archived, all
  const isGridView = ref(true);

  // Getters
  const filteredNotes = computed(() => {
    let filtered = notes.value;

    // Filter by view type
    if (selectedView.value === "active") {
      filtered = filtered.filter((note) => !note.completed && !note.archived);
    } else if (selectedView.value === "completed") {
      filtered = filtered.filter((note) => note.completed && !note.archived);
    } else if (selectedView.value === "archived") {
      filtered = filtered.filter((note) => note.archived);
    }
    // "all" shows everything

    // Filter by category
    if (selectedCategory.value && selectedCategory.value !== "") {
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

  const categories = computed(() => {
    const uniqueCats = [...new Set(notes.value.map((note) => note.category))];
    return uniqueCats.filter(Boolean); // Remove empty strings
  });

  // Actions
  const fetchNotes = async (params?: { search?: string; status?: string }) => {
    loading.value = true;
    error.value = null;

    try {
      const query = new URLSearchParams();
      if (params?.search) query.append("search", params.search);
      if (params?.status) query.append("status", params.status);

      const response = await $fetch<{ success: boolean; data: Note[] }>(
        `/api/notes?${query.toString()}`
      );
      notes.value = response.data;
    } catch (err) {
      console.error("Failed to fetch notes:", err);
      error.value = "Failed to fetch notes";
    } finally {
      loading.value = false;
    }
  };

  const addNote = async (noteData: Omit<Note, "id" | "userId" | "createdAt" | "updatedAt">) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch<{ success: boolean; data: Note }>("/api/notes", {
        method: "POST",
        body: noteData,
      });

      notes.value.unshift(response.data);
      return response.data;
    } catch (err) {
      console.error("Failed to create note:", err);
      error.value = "Failed to create note";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateNote = async (id: number, updates: Partial<Note>) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch<{ success: boolean; data: Note }>(`/api/notes/${id}`, {
        method: "PUT",
        body: updates,
      });

      const index = notes.value.findIndex((note) => note.id === id);
      if (index !== -1) {
        notes.value[index] = response.data;
      }

      return response.data;
    } catch (err) {
      console.error("Failed to update note:", err);
      error.value = "Failed to update note";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteNote = async (id: number) => {
    loading.value = true;
    error.value = null;

    try {
      await $fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });

      const index = notes.value.findIndex((note) => note.id === id);
      if (index !== -1) {
        notes.value.splice(index, 1);
      }
    } catch (err) {
      console.error("Failed to delete note:", err);
      error.value = "Failed to delete note";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const togglePin = async (id: number) => {
    const note = notes.value.find((note) => note.id === id);
    if (note) {
      await updateNote(id, { pinned: !note.pinned });
    }
  };

  const getCategoryColor = (category: string): string => {
    const colors = {
      Work: "bg-blue-100 dark:bg-blue-900/20",
      Personal: "bg-green-100 dark:bg-green-900/20",
      Ideas: "bg-purple-100 dark:bg-purple-900/20",
      Important: "bg-red-100 dark:bg-red-900/20",
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 dark:bg-gray-900/20";
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    // State
    notes,
    loading,
    error,
    searchQuery,
    selectedCategory,
    selectedView,
    isGridView,
    // Getters
    filteredNotes,
    categories,
    // Actions
    fetchNotes,
    addNote,
    updateNote,
    deleteNote,
    togglePin,
    getCategoryColor,
    clearError,
  };
});
