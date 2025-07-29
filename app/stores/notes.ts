import { defineStore } from "pinia";

export interface Note {
  id: number;
  title: string;
  content: string;
  category: string;
  color: string;
  updated: string;
  isPinned: boolean;
  createdAt: string;
}

export const useNotesStore = defineStore("notes", () => {
  // State
  const notes = ref<Note[]>([
    {
      id: 1,
      title: "Project Ideas",
      content: "List of upcoming project ideas and concepts to explore...",
      category: "Work",
      color: "bg-blue-100 dark:bg-blue-900/20",
      updated: "2 hours ago",
      isPinned: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: "Meeting Notes",
      content: "Important points discussed in today's team meeting...",
      category: "Work",
      color: "bg-green-100 dark:bg-green-900/20",
      updated: "1 day ago",
      isPinned: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      title: "Shopping List",
      content: "Groceries and items to buy this weekend...",
      category: "Personal",
      color: "bg-yellow-100 dark:bg-yellow-900/20",
      updated: "3 days ago",
      isPinned: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 4,
      title: "Book Recommendations",
      content: "List of books recommended by friends and colleagues...",
      category: "Personal",
      color: "bg-purple-100 dark:bg-purple-900/20",
      updated: "1 week ago",
      isPinned: false,
      createdAt: new Date().toISOString(),
    },
  ]);

  const searchQuery = ref("");
  const selectedCategory = ref("");
  const isGridView = ref(true);

  // Getters
  const filteredNotes = computed(() => {
    let filtered = notes.value;

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
    return uniqueCats;
  });

  // Actions
  const addNote = (noteData: Omit<Note, "id" | "createdAt" | "updated">) => {
    const newNote: Note = {
      ...noteData,
      id: Math.max(...notes.value.map((n) => n.id), 0) + 1,
      createdAt: new Date().toISOString(),
      updated: "just now",
    };
    notes.value.unshift(newNote);
  };

  const updateNote = (id: number, updates: Partial<Note>) => {
    const index = notes.value.findIndex((note) => note.id === id);
    if (index !== -1) {
      const currentNote = notes.value[index];
      if (currentNote) {
        notes.value[index] = {
          id: currentNote.id,
          title: updates.title ?? currentNote.title,
          content: updates.content ?? currentNote.content,
          category: updates.category ?? currentNote.category,
          color: updates.color ?? currentNote.color,
          isPinned: updates.isPinned ?? currentNote.isPinned,
          createdAt: currentNote.createdAt,
          updated: new Date().toISOString(),
        };
      }
    }
  };

  const deleteNote = (id: number) => {
    const index = notes.value.findIndex((note) => note.id === id);
    if (index !== -1) {
      notes.value.splice(index, 1);
    }
  };

  const togglePin = (id: number) => {
    const note = notes.value.find((note) => note.id === id);
    if (note) {
      note.isPinned = !note.isPinned;
      note.updated = "just now";
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

  return {
    // State
    notes,
    searchQuery,
    selectedCategory,
    isGridView,
    // Getters
    filteredNotes,
    categories,
    // Actions
    addNote,
    updateNote,
    deleteNote,
    togglePin,
    getCategoryColor,
  };
});
