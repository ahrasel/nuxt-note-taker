<script setup lang="ts">
  import type { Note } from "~/stores/notes";
  import { useNotesStore } from "~/stores/notes";

  interface Props {
    isOpen: boolean;
    note?: Note | null;
  }

  interface Emits {
    (e: "close"): void;
    (e: "save", note: Omit<Note, "id" | "userId" | "createdAt" | "updatedAt">): void;
    (e: "update", id: string, updates: Partial<Note>): void;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<Emits>();

  // Get notes store for categories
  const notesStore = useNotesStore();

  // Form data
  const formData = ref({
    title: "",
    content: "",
    category: "Personal",
    color: "bg-gray-100 dark:bg-gray-900/20",
    pinned: false,
    completed: false,
    archived: false,
  });

  const categories = computed(() => notesStore.categories);

  const resetForm = () => {
    formData.value = {
      title: "",
      content: "",
      category: "Personal",
      color: "bg-gray-100 dark:bg-gray-900/20",
      pinned: false,
      completed: false,
      archived: false,
    };
  };

  // Watch for prop changes
  watch(
    () => props.note,
    (note) => {
      if (note) {
        formData.value = {
          title: note.title,
          content: note.content,
          category: note.category,
          color: note.color,
          pinned: note.pinned,
          completed: note.completed,
          archived: note.archived,
        };
      } else {
        resetForm();
      }
    },
    { immediate: true }
  );

  watch(
    () => props.isOpen,
    (isOpen) => {
      if (!isOpen) {
        resetForm();
      }
    }
  );

  const isEditMode = computed(() => !!props.note);

  const handleSave = async () => {
    if (!formData.value.title.trim()) return;

    const noteData = {
      ...formData.value,
      color: notesStore.getCategoryColor(formData.value.category),
    };

    if (isEditMode.value && props.note) {
      emit("update", props.note.id, noteData);
    } else {
      emit("save", noteData);
    }

    emit("close");
  };

  const handleClose = () => {
    emit("close");
  };

  // Close modal on Escape key
  onMounted(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && props.isOpen) {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleEscape);

    onUnmounted(() => {
      document.removeEventListener("keydown", handleEscape);
    });
  });
</script>

<template>
  <!-- Modal Backdrop -->
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <!-- Background overlay -->
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          @click="handleClose"
        />

        <!-- Modal panel -->
        <div
          class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
        >
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ isEditMode ? "Edit Note" : "Create New Note" }}
            </h3>
            <button
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              @click="handleClose"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Form -->
          <form class="space-y-6" @submit.prevent="handleSave">
            <!-- Title -->
            <div>
              <label
                for="title"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Title *
              </label>
              <input
                id="title"
                v-model="formData.title"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter note title..."
              />
            </div>

            <!-- Category -->
            <div>
              <label
                for="category"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Category
              </label>
              <select
                id="category"
                v-model="formData.category"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>

            <!-- Content -->
            <div>
              <label
                for="content"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Content
              </label>
              <textarea
                id="content"
                v-model="formData.content"
                rows="6"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                placeholder="Write your note content here..."
              />
            </div>

            <!-- Pin Option -->
            <div class="flex items-center">
              <input
                id="pinned"
                v-model="formData.pinned"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="pinned" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Pin this note
              </label>
            </div>

            <!-- Actions -->
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                @click="handleClose"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="!formData.title.trim()"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ isEditMode ? "Update Note" : "Create Note" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>
