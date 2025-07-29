<script setup lang="ts">
  interface Props {
    isOpen: boolean;
    noteTitle?: string;
  }

  interface Emits {
    (e: "close" | "confirm"): void;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<Emits>();

  const handleConfirm = () => {
    emit("confirm");
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
          <!-- Icon -->
          <div
            class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4"
          >
            <svg
              class="h-6 w-6 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <!-- Content -->
          <div class="text-center">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Delete Note</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Are you sure you want to delete this note?
            </p>
            <p v-if="noteTitle" class="text-sm font-medium text-gray-900 dark:text-white mb-6">
              "{{ noteTitle }}"
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-6">
              This action cannot be undone.
            </p>
          </div>

          <!-- Actions -->
          <div class="flex justify-center space-x-3">
            <button
              type="button"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              @click="handleClose"
            >
              Cancel
            </button>
            <button
              type="button"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
              @click="handleConfirm"
            >
              Delete Note
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
