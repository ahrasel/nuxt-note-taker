<script setup lang="ts">
  definePageMeta({
    layout: "auth",
  });
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors px-4 sm:px-6 lg:px-8"
  >
    <div class="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Forgot Password?
        </h2>
        <p class="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          Don't worry! Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <!-- Form -->
      <form class="space-y-6">
        <div>
          <label
            class="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium"
            for="email"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
            placeholder="Enter your email address"
          />
        </div>

        <button
          type="submit"
          class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          Send Reset Link
        </button>
      </form>

      <!-- Back to Login -->
      <div class="mt-6 text-center">
        <NuxtLink
          :to="{ path: '/' }"
          class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium transition-colors duration-200"
        >
          ← Back to Login
        </NuxtLink>
      </div>

      <!-- Success Message (Hidden by default) -->
      <div
        class="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg hidden"
      >
        <div class="flex items-center">
          <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
          <p class="text-green-800 dark:text-green-200 text-sm">
            Reset link sent! Check your email inbox.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
