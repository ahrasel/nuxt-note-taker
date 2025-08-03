<template>
  <div
    v-if="show"
    class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300"
  >
    {{ message }}
  </div>
</template>

<script setup lang="ts">
  interface Props {
    show: boolean;
    message: string;
  }

  defineProps<Props>();
</script>
