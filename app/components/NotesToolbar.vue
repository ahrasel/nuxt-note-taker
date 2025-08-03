<template>
  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
    <!-- Categories and View Toggle -->
    <div class="flex flex-wrap items-center gap-2">
      <!-- View Filter -->
      <select
        :value="selectedView"
        class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
        @change="$emit('update:selectedView', ($event.target as HTMLSelectElement).value)"
      >
        <option value="active">Active Notes</option>
        <option value="completed">Completed</option>
        <option value="archived">Archived</option>
        <option value="all">All Notes</option>
      </select>

      <select
        :value="selectedCategory"
        class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
        @change="$emit('update:selectedCategory', ($event.target as HTMLSelectElement).value)"
      >
        <option value="">All Categories</option>
        <option v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>

      <!-- View Toggle -->
      <div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        <button
          :class="[
            'p-2 rounded transition-colors',
            isGridView
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
          ]"
          @click="$emit('update:isGridView', true)"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
        </button>
        <button
          :class="[
            'p-2 rounded transition-colors',
            !isGridView
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
          ]"
          @click="$emit('update:isGridView', false)"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Add Note Button -->
    <button
      class="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
      @click="$emit('addNote')"
    >
      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      <span>New Note</span>
    </button>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    selectedView: string;
    selectedCategory: string;
    categories: string[];
    isGridView: boolean;
  }

  defineProps<Props>();

  defineEmits<{
    "update:selectedView": [value: string];
    "update:selectedCategory": [value: string];
    "update:isGridView": [value: boolean];
    addNote: [];
  }>();
</script>
