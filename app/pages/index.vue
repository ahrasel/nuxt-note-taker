<script setup lang="ts">
  import { ref } from "vue";

  definePageMeta({
    layout: "auth",
  });

  interface LoginForm {
    username: string;
    password: string;
  }

  interface LoginResponse {
    success: boolean;
    message: string;
    user: {
      id: number;
      username: string;
      email: string | null;
    };
    token: string;
  }

  const form = ref<LoginForm>({
    username: "",
    password: "",
  });

  const isLoading = ref(false);
  const error = ref("");

  const handleLogin = async () => {
    if (!form.value.username || !form.value.password) {
      error.value = "Username and password are required";
      return;
    }

    isLoading.value = true;
    error.value = "";

    try {
      const data = await $fetch<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: form.value,
      });

      if (data.success) {
        // Redirect to dashboard after successful login
        await navigateTo("/dashboard");
      } else {
        error.value = data.message || "Login failed. Please try again.";
      }
    } catch (err: unknown) {
      if (err && typeof err === "object" && "data" in err) {
        const errorData = err.data as { message?: string };
        error.value = errorData.message || "Login failed. Please try again.";
      } else {
        error.value = "Login failed. Please try again.";
      }
      console.error("Login error:", err);
    } finally {
      isLoading.value = false;
    }
  };
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors"
  >
    <div class="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Login to Your Account
      </h2>
      <form class="space-y-5" @submit.prevent="handleLogin">
        <div>
          <label class="block text-gray-700 dark:text-gray-300 mb-2" for="username">Username</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="username"
          />
        </div>
        <div>
          <label class="block text-gray-700 dark:text-gray-300 mb-2" for="password">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="••••••••"
          />
        </div>
        <!-- Error message -->
        <div v-if="error" class="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {{ error }}
        </div>
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded transition-colors"
        >
          {{ isLoading ? "Logging in..." : "Login" }}
        </button>
      </form>

      <!-- Links -->
      <div class="mt-6 text-center space-y-2">
        <NuxtLink
          to="/forgot-password"
          class="block text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm transition-colors duration-200"
        >
          Forgot your password?
        </NuxtLink>
        <div class="text-gray-600 dark:text-gray-400 text-sm">
          Don't have an account?
          <NuxtLink
            to="/register"
            class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
          >
            Sign up here
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
