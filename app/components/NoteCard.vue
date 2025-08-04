<template>
  <div
    :class="[
      'bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 dark:border-gray-700 relative',
      isGridView ? 'p-4' : 'p-4 sm:p-6',
      note.color,
      { 'opacity-60': note.completed },
    ]"
  >
    <!-- Dropdown Menu -->
    <div class="absolute top-3 right-3">
      <button
        class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        @click.stop="$emit('toggleDropdown', note.id)"
      >
        <svg class="h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
          />
        </svg>
      </button>

      <!-- Dropdown Menu -->
      <div
        v-if="isDropdownOpen"
        class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-600 z-20"
        @click.stop
      >
        <div class="py-1">
          <button
            class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
            @click="$emit('edit', note)"
          >
            <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit
          </button>

          <button
            class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
            @click="$emit('pin', note)"
          >
            <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            {{ note.pinned ? "Unpin" : "Pin" }}
          </button>

          <button
            class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
            @click="$emit('complete', note)"
          >
            <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {{ note.completed ? "Mark Incomplete" : "Mark Complete" }}
          </button>

          <button
            class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
            @click="$emit('archive', note)"
          >
            <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 8l6 6 6-6"
              />
            </svg>
            {{ note.archived ? "Unarchive" : "Archive" }}
          </button>

          <div class="border-t border-gray-200 dark:border-gray-600" />

          <button
            class="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
            @click="$emit('delete', note)"
          >
            <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Note Content -->
    <div class="cursor-pointer pr-8" @click="$emit('view', note)">
      <!-- Pin indicator -->
      <div v-if="note.pinned" class="absolute top-2 left-2">
        <svg class="h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 5a2 2 0 012-2h6a2 2 0 012 2v16l-5-3-5 3V5z" />
        </svg>
      </div>

      <!-- Status indicators -->
      <div class="flex items-center gap-2 mb-2">
        <span
          v-if="note.completed"
          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
        >
          <svg class="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
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
          Archived
        </span>
      </div>

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
</template>

<script setup lang="ts">
  import type { Note } from "~/stores/notes";

  interface Props {
    note: Note;
    isGridView: boolean;
    isDropdownOpen: boolean;
  }

  defineProps<Props>();

  defineEmits<{
    toggleDropdown: [id: string];
    edit: [note: Note];
    pin: [note: Note];
    complete: [note: Note];
    archive: [note: Note];
    delete: [note: Note];
    view: [note: Note];
  }>();

  // Date formatting utility
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
</script>
