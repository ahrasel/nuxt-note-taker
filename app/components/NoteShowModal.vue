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
          class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6"
        >
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Note Details</h3>
            <div class="flex items-center space-x-2">
              <!-- Copy Button -->
              <button
                v-if="note"
                title="Copy content"
                class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                @click="copyNoteText"
              >
                <svg
                  v-if="!justCopied"
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <svg
                  v-else
                  class="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </button>

              <!-- Edit Button -->
              <button
                v-if="note"
                title="Edit note"
                class="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                @click="handleEdit"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>

              <!-- Close Button -->
              <button
                title="Close"
                class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                @click="handleClose"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Note Content -->
          <div v-if="note" class="space-y-6">
            <!-- Title -->
            <div>
              <h2
                class="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                :class="{ 'line-through opacity-60': note.completed }"
              >
                {{ note.title }}
              </h2>
            </div>

            <!-- Meta Information -->
            <div
              class="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600 pb-4"
            >
              <!-- Category -->
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                <span>{{ note.category }}</span>
              </div>

              <!-- Status Badges -->
              <div class="flex items-center gap-2">
                <span
                  v-if="note.pinned"
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                >
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 5a2 2 0 012-2h6a2 2 0 012 2v16l-5-3-5 3V5z" />
                  </svg>
                  Pinned
                </span>

                <span
                  v-if="note.completed"
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                >
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Completed
                </span>

                <span
                  v-if="note.archived"
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                >
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 8l6 6 6-6"
                    />
                  </svg>
                  Archived
                </span>
              </div>

              <!-- Dates -->
              <div class="flex items-center text-xs">
                <span>Created: {{ formatDate(note.createdAt) }}</span>
                <span v-if="note.updatedAt !== note.createdAt" class="ml-2">
                  • Updated: {{ formatDate(note.updatedAt) }}
                </span>
              </div>
            </div>

            <!-- Content -->
            <div class="min-h-[200px]">
              <div
                v-if="note.content"
                class="prose prose-gray dark:prose-invert max-w-none"
                :class="{ 'line-through opacity-60': note.completed }"
              >
                <div class="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                  {{ note.content }}
                </div>
              </div>
              <div v-else class="text-gray-500 dark:text-gray-400 italic text-center py-8">
                No content available
              </div>
            </div>
          </div>

          <!-- Loading state -->
          <div v-else class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>

          <!-- Copy Success Toast -->
          <div
            v-if="showCopyToast"
            class="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-60 transition-all duration-300"
          >
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              Note content copied to clipboard!
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
  import type { Note } from "~/stores/notes";

  interface Props {
    isOpen: boolean;
    note?: Note | null;
  }

  interface Emits {
    (e: "close"): void;
    (e: "edit", note: Note): void;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<Emits>();

  // Reactive state
  const justCopied = ref(false);
  const showCopyToast = ref(false);

  // Date formatting utility
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Copy note text to clipboard
  const copyNoteText = async () => {
    if (!props.note) return;

    try {
      const textToCopy = props.note.content;
      await navigator.clipboard.writeText(textToCopy);

      // Show visual feedback
      justCopied.value = true;
      showCopyToast.value = true;

      // Reset copy icon after 2 seconds
      setTimeout(() => {
        justCopied.value = false;
      }, 2000);

      // Hide toast after 3 seconds
      setTimeout(() => {
        showCopyToast.value = false;
      }, 3000);
    } catch (error) {
      console.error("Failed to copy text:", error);
      // Fallback for older browsers
      try {
        const textArea = document.createElement("textarea");
        textArea.value = props.note.content;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);

        justCopied.value = true;
        showCopyToast.value = true;
        setTimeout(() => {
          justCopied.value = false;
        }, 2000);
        setTimeout(() => {
          showCopyToast.value = false;
        }, 3000);
      } catch (fallbackError) {
        console.error("Fallback copy also failed:", fallbackError);
      }
    }
  };

  const handleClose = () => {
    emit("close");
  };

  const handleEdit = () => {
    if (props.note) {
      emit("edit", props.note);
    }
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

  // Reset state when modal closes
  watch(
    () => props.isOpen,
    (isOpen) => {
      if (!isOpen) {
        justCopied.value = false;
        showCopyToast.value = false;
      }
    }
  );
</script>
