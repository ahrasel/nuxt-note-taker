export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
}

interface FetchError {
  data?: {
    message?: string;
  };
}

export const useAuth = () => {
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Get current user
  const getMe = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await $fetch<AuthResponse>("/api/auth/me", {
        method: "GET",
      });

      if (response.success && response.user) {
        user.value = response.user;
      }

      return response;
    } catch (err: unknown) {
      const fetchError = err as FetchError;
      error.value = fetchError.data?.message || "Failed to get user information";
      user.value = null;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await $fetch<AuthResponse>("/api/auth/logout", {
        method: "POST",
      });

      if (response.success) {
        user.value = null;
        // Redirect to login page
        await navigateTo("/");
      }

      return response;
    } catch (err: unknown) {
      const fetchError = err as FetchError;
      error.value = fetchError.data?.message || "Failed to logout";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Initialize user on composable creation
  const initializeAuth = async () => {
    try {
      await getMe();
    } catch {
      // If getting user fails, user is not authenticated
      user.value = null;
    }
  };

  return {
    user: readonly(user),
    isLoading: readonly(isLoading),
    error: readonly(error),
    getMe,
    logout,
    initializeAuth,
  };
};
