<script setup lang="ts">
  definePageMeta({
    layout: "default",
  });

  // Sample data - replace with real data later
  const notes = ref([
    {
      id: 1,
      title: "Project Ideas",
      content: "List of upcoming project ideas and concepts to explore...",
      category: "Work",
      color: "bg-blue-100 dark:bg-blue-900/20",
      updated: "2 hours ago",
      isPinned: true,
    },
    {
      id: 2,
      title: "Meeting Notes",
      content: "Important points discussed in today's team meeting...",
      category: "Work",
      color: "bg-green-100 dark:bg-green-900/20",
      updated: "1 day ago",
      isPinned: false,
    },
    {
      id: 3,
      title: "Shopping List",
      content: "Groceries and items to buy this weekend...",
      category: "Personal",
      color: "bg-yellow-100 dark:bg-yellow-900/20",
      updated: "3 days ago",
      isPinned: true,
    },
    {
      id: 4,
      title: "Book Recommendations",
      content: "List of books recommended by friends and colleagues...",
      category: "Personal",
      color: "bg-purple-100 dark:bg-purple-900/20",
      updated: "1 week ago",
      isPinned: false,
    },
  ]);

  const searchQuery = ref("");
  const selectedCategory = ref("All");
  const categories = ["All", "Work", "Personal", "Ideas", "Important"];
  const isGridView = ref(true);
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <!-- Header -->
    <header
      class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo and Title -->
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                📝 NoteTaker
              </h1>
            </div>
          </div>

          <!-- Search Bar -->
          <div class="hidden md:block flex-1 max-w-lg mx-8">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search notes..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <svg
                class="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <!-- User Menu -->
          <div class="flex items-center space-x-4">
            <!-- Mobile Search Button -->
            <button
              class="md:hidden p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            <!-- Theme Toggle -->
            <button
              class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            </button>

            <!-- Profile -->
            <div class="relative">
              <button
                class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span class="text-white text-sm font-medium">U</span>
                </div>
                <span class="hidden sm:block text-gray-700 dark:text-gray-300 text-sm">User</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Mobile Search Bar -->
    <div
      class="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3"
    >
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search notes..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
        <svg
          class="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Toolbar -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <!-- Categories and View Toggle -->
        <div class="flex flex-wrap items-center gap-2">
          <select
            v-model="selectedCategory"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          >
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
              @click="isGridView = true"
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
              @click="isGridView = false"
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
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>New Note</span>
        </button>
      </div>

      <!-- Notes Grid/List -->
      <div
        :class="[
          'gap-4',
          isGridView
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'flex flex-col space-y-4',
        ]"
      >
        <div
          v-for="note in notes"
          :key="note.id"
          :class="[
            'bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer border border-gray-200 dark:border-gray-700',
            isGridView ? 'p-4' : 'p-4 sm:p-6',
          ]"
        >
          <!-- Note Header -->
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center space-x-2">
              <div :class="['w-3 h-3 rounded-full', note.color]" />
              <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">{{
                note.category
              }}</span>
            </div>
            <div class="flex items-center space-x-1">
              <button v-if="note.isPinned" class="text-yellow-500 hover:text-yellow-600">
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
              </button>
              <button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Note Content -->
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {{ note.title }}
          </h3>
          <p
            :class="[
              'text-gray-600 dark:text-gray-400 text-sm mb-4',
              isGridView ? 'line-clamp-3' : 'line-clamp-2',
            ]"
          >
            {{ note.content }}
          </p>

          <!-- Note Footer -->
          <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Updated {{ note.updated }}</span>
            <div class="flex items-center space-x-2">
              <button class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button class="hover:text-red-600 dark:hover:text-red-400 transition-colors">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="notes.length === 0" class="text-center py-12">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900 dark:text-white">No notes yet</h3>
        <p class="mt-1 text-gray-500 dark:text-gray-400">
          Get started by creating your first note.
        </p>
        <div class="mt-6">
          <button
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Note
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
