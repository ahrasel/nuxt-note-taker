<script setup lang="ts">
  interface Props {
    isOpen: boolean;
    isPinned: boolean;
  }

  interface Emits {
    (e: "close" | "edit" | "delete" | "pin"): void;
  }

  const _props = defineProps<Props>();
  const emit = defineEmits<Emits>();

  const dropdownRef = ref<HTMLElement>();

  const handleEdit = () => {
    emit("edit");
    emit("close");
  };

  const handleDelete = () => {
    emit("delete");
    emit("close");
  };

  const handlePin = () => {
    emit("pin");
    emit("close");
  };

  // Close dropdown when clicking outside
  onMounted(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
        emit("close");
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        emit("close");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    onUnmounted(() => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    });
  });
</script>

<template>
  <div
    v-if="isOpen"
    ref="dropdownRef"
    class="absolute right-0 top-8 z-10 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-1"
  >
    <button
      class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center space-x-2 transition-colors"
      @click="handleEdit"
    >
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
      <span>Edit Note</span>
    </button>

    <button
      class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center space-x-2 transition-colors"
      @click="handlePin"
    >
      <svg v-if="!isPinned" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
      <svg v-else class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
      </svg>
      <span>{{ isPinned ? "Unpin Note" : "Pin Note" }}</span>
    </button>

    <hr class="my-1 border-gray-200 dark:border-gray-600" />

    <button
      class="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2 transition-colors"
      @click="handleDelete"
    >
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
      <span>Delete Note</span>
    </button>
  </div>
</template>
