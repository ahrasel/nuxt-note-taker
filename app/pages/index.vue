<script setup lang="ts">
  // Remove the navigation functions since we'll use NuxtLink
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors"
  >
    <div class="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Login to Your Account
      </h2>
      <form class="space-y-5">
        <div>
          <label class="block text-gray-700 dark:text-gray-300 mb-2" for="username">Username</label>
          <input
            id="username"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="username"
          />
        </div>
        <div>
          <label class="block text-gray-700 dark:text-gray-300 mb-2" for="password">Password</label>
          <input
            id="password"
            type="password"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition-colors"
        >
          Login
        </button>
      </form>

      <!-- Links -->
      <div class="mt-6 text-center space-y-2">
        <NuxtLink
          :to="{ path: '/forgot-password' }"
          class="block text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm transition-colors duration-200"
        >
          Forgot your password?
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
