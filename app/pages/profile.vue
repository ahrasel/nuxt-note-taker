<template>
  <div>
    <!-- Page Header -->
    <div class="flex items-center gap-4 mb-6">
      <NuxtLink to="/dashboard" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
      </NuxtLink>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">👤 Profile</h1>
    </div>

    <!-- Profile Card -->
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6"
    >
      <div class="flex items-center space-x-4">
        <div class="bg-blue-100 dark:bg-blue-900/20 rounded-full p-4">
          <svg
            class="h-8 w-8 text-blue-600 dark:text-blue-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ user?.username || "User" }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400">{{ user?.email || "No email set" }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Member since {{ formatDate(user?.createdAt || new Date().toISOString()) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div class="flex items-center">
          <div class="bg-green-100 dark:bg-green-900/20 rounded-full p-3">
            <svg
              class="h-6 w-6 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Notes</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.total }}</p>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div class="flex items-center">
          <div class="bg-blue-100 dark:bg-blue-900/20 rounded-full p-3">
            <svg
              class="h-6 w-6 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Notes</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.active }}</p>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div class="flex items-center">
          <div class="bg-purple-100 dark:bg-purple-900/20 rounded-full p-3">
            <svg
              class="h-6 w-6 text-purple-600 dark:text-purple-400"
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
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ stats.completed }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Account Actions -->
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
    >
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Actions</h3>
      <div class="space-y-4">
        <button
          class="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          @click="handleChangePassword"
        >
          Change Password
        </button>
        <button
          class="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ml-0 sm:ml-4"
          @click="handleLogout"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useAuth } from "~/composables/useAuth";
  import { useNotesStore } from "~/stores/notes";

  definePageMeta({
    layout: "default",
  });

  const { user, logout } = useAuth();
  const notesStore = useNotesStore();

  // Inject functions from AppLayout
  const showToastMessage = inject("showToastMessage") as (message: string) => void;

  // Stats
  const stats = ref({
    total: 0,
    active: 0,
    completed: 0,
    archived: 0,
  });

  // Load user notes statistics
  onMounted(async () => {
    try {
      await notesStore.fetchNotes();

      stats.value = {
        total: notesStore.notes.length,
        active: notesStore.notes.filter((note) => !note.completed && !note.archived).length,
        completed: notesStore.notes.filter((note) => note.completed).length,
        archived: notesStore.notes.filter((note) => note.archived).length,
      };
    } catch (error) {
      console.error("Failed to load user statistics:", error);
    }
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleChangePassword = () => {
    // TODO: Implement change password functionality
    showToastMessage("Change password feature coming soon!");
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
</script>
