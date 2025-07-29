<script setup lang="ts">
  const reloadPage = () => {
    window.location.reload();
  };
</script>
<template>
  <NuxtErrorBoundary>
    <template #error="{ error }">
      <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div class="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
          <h1 class="text-3xl font-bold text-red-600 mb-4">Oops! Something went wrong.</h1>
          <p class="text-gray-700 mb-2">{{ error.message }}</p>
          <p class="text-gray-500 text-sm mb-6">
            Please try refreshing the page or contact support if the problem persists.
          </p>
          <button
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            @click="reloadPage"
          >
            Reload Page
          </button>
        </div>
      </div>
    </template>
  </NuxtErrorBoundary>
</template>
