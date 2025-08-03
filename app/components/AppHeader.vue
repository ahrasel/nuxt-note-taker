<template>
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
              type="text"
              placeholder="Search notes..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              :value="searchQuery"
              @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
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
          <!-- Navigation Links -->
          <nav class="hidden md:flex space-x-4">
            <NuxtLink
              to="/dashboard"
              class="px-3 py-2 rounded-md text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400"
              active-class="text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400"
            >
              Active
            </NuxtLink>
            <NuxtLink
              to="/completed"
              class="px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              active-class="text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400"
            >
              Completed
            </NuxtLink>
            <NuxtLink
              to="/archived"
              class="px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              active-class="text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400"
            >
              Archived
            </NuxtLink>
          </nav>

          <!-- Theme Toggle -->
          <button
            class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            @click="$emit('toggleDarkMode')"
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
          <div class="relative" :data-dropdown-open="isProfileDropdownOpen">
            <button
              class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              @click.stop="toggleProfileDropdown"
            >
              <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span v-if="!authLoading" class="text-white text-sm font-medium">
                  {{ user?.username ? user.username.charAt(0).toUpperCase() : "U" }}
                </span>
                <svg v-else class="h-4 w-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
              <span class="hidden sm:block text-gray-700 dark:text-gray-300 text-sm">
                {{ authLoading ? "Loading..." : user?.username || "User" }}
              </span>
              <svg
                class="h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <!-- Profile Dropdown -->
            <div
              v-if="isProfileDropdownOpen"
              class="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-600 z-20"
              @click.stop
            >
              <div class="py-2">
                <!-- User Info -->
                <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                  <div class="flex items-center space-x-3">
                    <div
                      class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center"
                    >
                      <span class="text-white font-medium">
                        {{ user?.username ? user.username.charAt(0).toUpperCase() : "U" }}
                      </span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {{ user?.username || "User" }}
                      </p>
                      <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {{ user?.email || "user@example.com" }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Menu Items -->
                <div class="py-1">
                  <button
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    @click="$emit('profile')"
                  >
                    <svg class="h-4 w-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Profile Settings
                  </button>

                  <div class="border-t border-gray-200 dark:border-gray-600 my-1" />

                  <button
                    :disabled="authLoading"
                    class="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    @click="$emit('logout')"
                  >
                    <svg class="h-4 w-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    {{ authLoading ? "Signing out..." : "Sign out" }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
  interface User {
    id: number;
    username: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  }

  interface Props {
    user?: User | null;
    authLoading?: boolean;
    searchQuery: string;
  }

  defineProps<Props>();

  defineEmits<{
    "update:searchQuery": [value: string];
    toggleDarkMode: [];
    profile: [];
    logout: [];
  }>();

  // Profile dropdown state
  const isProfileDropdownOpen = ref(false);

  const toggleProfileDropdown = () => {
    isProfileDropdownOpen.value = !isProfileDropdownOpen.value;
  };

  // Close dropdown when clicking outside
  onMounted(() => {
    document.addEventListener("click", () => {
      isProfileDropdownOpen.value = false;
    });
  });
</script>
