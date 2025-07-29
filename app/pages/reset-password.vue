<script setup lang="ts">
  definePageMeta({
    layout: "auth",
  });

  // Token validation state
  const isValidating = ref(true);
  const isTokenValid = ref(false);
  const tokenError = ref("");

  // Get token from route query
  const route = useRoute();
  const token = route.query.token as string;

  // Simulate token validation (replace with real API call)
  onMounted(async () => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate token validation logic
      if (!token) {
        tokenError.value = "No reset token provided";
        isTokenValid.value = false;
      } else if (token === "expired") {
        tokenError.value = "Reset link has expired";
        isTokenValid.value = false;
      } else if (token === "invalid") {
        tokenError.value = "Invalid reset token";
        isTokenValid.value = false;
      } else {
        // Token is valid
        isTokenValid.value = true;
      }
    } catch {
      tokenError.value = "Failed to validate reset token";
      isTokenValid.value = false;
    } finally {
      isValidating.value = false;
    }
  });
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors px-4 sm:px-6 lg:px-8"
  >
    <div class="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8">
      <!-- Loading State -->
      <div v-if="isValidating" class="text-center py-8">
        <div class="mb-4">
          <div
            class="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto"
          >
            <svg
              class="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Validating Reset Link</h2>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          Please wait while we verify your reset token...
        </p>
      </div>

      <!-- Token Invalid State -->
      <div v-else-if="!isTokenValid" class="text-center py-8">
        <div class="mb-4">
          <div
            class="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto"
          >
            <svg
              class="w-8 h-8 text-red-600 dark:text-red-400"
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
        </div>
        <h2 class="text-2xl font-bold text-red-900 dark:text-red-100 mb-2">Invalid Reset Link</h2>
        <p class="text-red-600 dark:text-red-400 text-sm mb-6">
          {{ tokenError }}
        </p>

        <!-- Request New Reset Link -->
        <div class="space-y-4">
          <NuxtLink
            :to="{ path: '/forgot-password' }"
            class="inline-flex items-center justify-center w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Request New Reset Link
          </NuxtLink>

          <NuxtLink
            :to="{ path: '/' }"
            class="inline-flex items-center justify-center w-full py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium rounded-lg transition-colors duration-200"
          >
            Back to Login
          </NuxtLink>
        </div>

        <!-- Help Text -->
        <div class="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Common Issues:</h4>
          <ul class="text-xs text-gray-600 dark:text-gray-400 space-y-1 text-left">
            <li>• Reset links expire after 24 hours</li>
            <li>• Each reset link can only be used once</li>
            <li>• Make sure you're using the complete link from your email</li>
            <li>• Check your spam folder for the reset email</li>
          </ul>
        </div>
      </div>

      <!-- Valid Token - Show Password Form -->
      <div v-else>
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="mb-4">
            <div
              class="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto"
            >
              <svg
                class="w-8 h-8 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2m0 0V7a2 2 0 012-2m3 2a2 2 0 00-2-2M9 7h6m6 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h14z"
                />
              </svg>
            </div>
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Set New Password
          </h2>
          <p class="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Create a strong password for your account
          </p>
        </div>

        <!-- Form -->
        <form class="space-y-6">
          <div>
            <label
              class="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium"
              for="new-password"
            >
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
              placeholder="Enter your new password"
            />
          </div>

          <div>
            <label
              class="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium"
              for="confirm-password"
            >
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
              placeholder="Confirm your new password"
            />
          </div>

          <!-- Password Requirements -->
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Password Requirements:
            </h4>
            <ul class="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li class="flex items-center">
                <svg class="w-3 h-3 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                At least 8 characters long
              </li>
              <li class="flex items-center">
                <svg class="w-3 h-3 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                Contains uppercase and lowercase letters
              </li>
              <li class="flex items-center">
                <svg class="w-3 h-3 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                Contains at least one number
              </li>
              <li class="flex items-center">
                <svg class="w-3 h-3 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                Contains at least one special character
              </li>
            </ul>
          </div>

          <button
            type="submit"
            class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Update Password
          </button>
        </form>

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
            <div>
              <p class="text-green-800 dark:text-green-200 text-sm font-medium">
                Password updated successfully!
              </p>
              <p class="text-green-600 dark:text-green-300 text-xs mt-1">
                You can now login with your new password.
              </p>
            </div>
          </div>
        </div>

        <!-- Error Message (Hidden by default) -->
        <div
          class="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hidden"
        >
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
            <div>
              <p class="text-red-800 dark:text-red-200 text-sm font-medium">
                Passwords don't match
              </p>
              <p class="text-red-600 dark:text-red-300 text-xs mt-1">
                Please make sure both passwords are identical.
              </p>
            </div>
          </div>
        </div>

        <!-- Back to Login -->
        <div class="mt-6 text-center">
          <NuxtLink
            :to="{ path: '/' }"
            class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium transition-colors duration-200"
          >
            ← Back to Login
          </NuxtLink>
        </div>

        <!-- Security Notice -->
        <div
          class="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
        >
          <div class="flex items-start">
            <svg
              class="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              />
            </svg>
            <div>
              <p class="text-blue-800 dark:text-blue-200 text-xs font-medium">Security Tip</p>
              <p class="text-blue-600 dark:text-blue-300 text-xs mt-1">
                Use a unique password that you don't use for other accounts. Consider using a
                password manager.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
