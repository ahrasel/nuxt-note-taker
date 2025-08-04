interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  success: boolean;
  user?: User;
}

export default defineNuxtRouteMiddleware(async (to) => {
  // Skip middleware on server-side rendering for non-protected routes
  if (import.meta.server) return;

  // Check if we're trying to access a protected route
  const protectedRoutes = ["/dashboard", "/completed", "/archived"];
  const isProtectedRoute = protectedRoutes.some((route) => to.path.startsWith(route));

  if (!isProtectedRoute) return;

  try {
    // Try to get current user
    const response = await $fetch<AuthResponse>("/api/auth/me", {
      method: "GET",
    });

    if (!response.success || !response.user) {
      // Redirect to login if not authenticated
      return navigateTo("/");
    }
  } catch (error) {
    // If authentication check fails, redirect to login
    console.warn("Authentication check failed:", error);
    return navigateTo("/");
  }
});
