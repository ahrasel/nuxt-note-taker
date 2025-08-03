<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <!-- Header -->
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
                v-model="notesStore.searchQuery"
                type="text"
                placeholder="Search notes..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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
              @click="toggleDarkMode"
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
                  <svg
                    v-else
                    class="h-4 w-4 text-white animate-spin"
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
                      @click="handleProfile"
                    >
                      <svg
                        class="h-4 w-4 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
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
                      @click="handleLogout"
                    >
                      <svg
                        class="h-4 w-4 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
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

    <!-- Mobile Search Bar -->
    <div
      class="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3"
    >
      <div class="relative">
        <input
          v-model="notesStore.searchQuery"
          type="text"
          placeholder="Search notes..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Toolbar -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <!-- Categories and View Toggle -->
        <div class="flex flex-wrap items-center gap-2">
          <!-- View Filter -->
          <select
            v-model="notesStore.selectedView"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          >
            <option value="active">Active Notes</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
            <option value="all">All Notes</option>
          </select>

          <select
            v-model="notesStore.selectedCategory"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          >
            <option value="">All Categories</option>
            <option v-for="category in notesStore.categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>

          <!-- View Toggle -->
          <div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              :class="[
                'p-2 rounded transition-colors',
                notesStore.isGridView
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
              ]"
              @click="notesStore.isGridView = true"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
            <button
              :class="[
                'p-2 rounded transition-colors',
                !notesStore.isGridView
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
              ]"
              @click="notesStore.isGridView = false"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Add Note Button -->
        <button
          class="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
          @click="openNoteModal()"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>New Note</span>
        </button>
      </div>

      <!-- Notes Grid/List -->
      <div
        :class="[
          'gap-4',
          notesStore.isGridView
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'flex flex-col space-y-4',
        ]"
      >
        <div
          v-for="note in notesStore.filteredNotes"
          :key="note.id"
          :class="[
            'bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 dark:border-gray-700 relative',
            notesStore.isGridView ? 'p-4' : 'p-4 sm:p-6',
            note.color,
            { 'opacity-60': note.isCompleted },
          ]"
        >
          <!-- Dropdown Menu -->
          <div class="absolute top-3 right-3">
            <button
              class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              @click.stop="toggleDropdown(note.id)"
            >
              <svg class="h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
                />
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <div
              v-if="openDropdownId === note.id"
              class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-600 z-20"
              @click.stop
            >
              <div class="py-1">
                <button
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  @click="handleEdit(note)"
                >
                  <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit
                </button>

                <button
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  @click="handlePin(note)"
                >
                  <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                  {{ note.isPinned ? "Unpin" : "Pin" }}
                </button>

                <button
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  @click="handleComplete(note)"
                >
                  <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {{ note.isCompleted ? "Mark Incomplete" : "Mark Complete" }}
                </button>

                <button
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  @click="handleArchive(note)"
                >
                  <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 8l6 6 6-6"
                    />
                  </svg>
                  {{ note.isArchived ? "Unarchive" : "Archive" }}
                </button>

                <div class="border-t border-gray-200 dark:border-gray-600" />

                <button
                  class="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
                  @click="handleDelete(note)"
                >
                  <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>

          <!-- Note Content -->
          <div class="cursor-pointer pr-8" @click="openNoteModal(note)">
            <!-- Pin indicator -->
            <div v-if="note.isPinned" class="absolute top-2 left-2">
              <svg class="h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 5a2 2 0 012-2h6a2 2 0 012 2v16l-5-3-5 3V5z" />
              </svg>
            </div>

            <!-- Status indicators -->
            <div class="flex items-center gap-2 mb-2">
              <span
                v-if="note.isCompleted"
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
              >
                <svg class="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                Completed
              </span>

              <span
                v-if="note.isArchived"
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
              >
                Archived
              </span>
            </div>

            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white mb-2"
              :class="{ 'line-through': note.isCompleted }"
            >
              {{ note.title }}
            </h3>
            <p
              class="text-gray-600 dark:text-gray-400 text-sm mb-4"
              :class="{ 'line-through': note.isCompleted }"
            >
              {{ note.content }}
            </p>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              <span>{{ note.category }}</span> • <span>{{ formatDate(note.updated) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="notesStore.filteredNotes.length === 0" class="text-center py-12">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900 dark:text-white">No notes found</h3>
        <p class="mt-1 text-gray-500 dark:text-gray-400">
          {{
            notesStore.searchQuery || notesStore.selectedCategory
              ? "Try adjusting your search or filters"
              : "Get started by creating your first note"
          }}
        </p>
        <div class="mt-6">
          <button
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            @click="openNoteModal()"
          >
            <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Note
          </button>
        </div>
      </div>
    </main>

    <!-- Modals -->
    <NoteModal
      :is-open="isNoteModalOpen"
      :note="editingNote"
      @close="closeNoteModal"
      @save="handleSaveNote"
      @update="handleUpdateNote"
    />

    <DeleteModal
      :is-open="isDeleteModalOpen"
      :note-title="deletingNote?.title || ''"
      @close="closeDeleteModal"
      @confirm="confirmDelete"
    />

    <!-- Toast Notification -->
    <div
      v-if="showToast"
      class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300"
    >
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useNotesStore } from "~/stores/notes";
  import type { Note } from "~/stores/notes";
  import { useAuth } from "~/composables/useAuth";
  import NoteModal from "~/components/NoteModal.vue";
  import DeleteModal from "~/components/DeleteModal.vue";

  definePageMeta({
    layout: "default",
  });

  // Store
  const notesStore = useNotesStore();

  // Auth
  const { user, logout, initializeAuth, isLoading: authLoading } = useAuth();

  // Modal states
  const isNoteModalOpen = ref(false);
  const isDeleteModalOpen = ref(false);
  const editingNote = ref<Note | null>(null);
  const deletingNote = ref<Note | null>(null);
  const openDropdownId = ref<number | null>(null);
  const isProfileDropdownOpen = ref(false);

  // Toast notification
  const showToast = ref(false);
  const toastMessage = ref("");

  // Modal handlers
  const openNoteModal = (note?: Note) => {
    editingNote.value = note || null;
    isNoteModalOpen.value = true;
  };

  const closeNoteModal = () => {
    isNoteModalOpen.value = false;
    editingNote.value = null;
  };

  const openDeleteModal = (note: Note) => {
    deletingNote.value = note;
    isDeleteModalOpen.value = true;
  };

  const closeDeleteModal = () => {
    isDeleteModalOpen.value = false;
    deletingNote.value = null;
  };

  const confirmDelete = () => {
    if (deletingNote.value) {
      notesStore.deleteNote(deletingNote.value.id);
      closeDeleteModal();
    }
  };

  const handleSaveNote = (noteData: Omit<Note, "id" | "createdAt" | "updated">) => {
    notesStore.addNote(noteData);
    closeNoteModal();
  };

  const handleUpdateNote = (id: number, updates: Partial<Note>) => {
    notesStore.updateNote(id, updates);
    closeNoteModal();
  };

  const toggleDropdown = (noteId: number) => {
    openDropdownId.value = openDropdownId.value === noteId ? null : noteId;
  };

  const handleEdit = (note: Note) => {
    openNoteModal(note);
    openDropdownId.value = null;
  };

  const handleDelete = (note: Note) => {
    openDeleteModal(note);
    openDropdownId.value = null;
  };

  const handlePin = (note: Note) => {
    notesStore.updateNote(note.id, { ...note, isPinned: !note.isPinned });
    openDropdownId.value = null;
  };

  const handleComplete = (note: Note) => {
    notesStore.updateNote(note.id, { ...note, isCompleted: !note.isCompleted });
    openDropdownId.value = null;
  };

  const handleArchive = (note: Note) => {
    notesStore.updateNote(note.id, { ...note, isArchived: !note.isArchived });
    openDropdownId.value = null;
  };

  // Profile dropdown handlers
  const toggleProfileDropdown = () => {
    console.log("Toggling profile dropdown, current state:", isProfileDropdownOpen.value);
    isProfileDropdownOpen.value = !isProfileDropdownOpen.value;
    console.log("New state:", isProfileDropdownOpen.value);
  };

  const handleProfile = () => {
    // TODO: Navigate to profile settings page
    console.log("Navigate to profile settings");
    isProfileDropdownOpen.value = false;
  };

  const handleLogout = async () => {
    try {
      await logout();
      isProfileDropdownOpen.value = false;
      showToastMessage("Successfully signed out");
    } catch (error) {
      console.error("Logout failed:", error);
      showToastMessage("Failed to sign out. Please try again.", "error");
    }
  };

  // Toast notification helper
  const showToastMessage = (message: string, _type: "success" | "error" = "success") => {
    toastMessage.value = message;
    showToast.value = true;

    setTimeout(() => {
      showToast.value = false;
    }, 3000);
  };

  // Dark mode toggle
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
  };

  // Date formatting utility
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Close dropdown when clicking outside
  onMounted(() => {
    // Initialize auth on component mount
    initializeAuth();

    document.addEventListener("click", () => {
      openDropdownId.value = null;
      isProfileDropdownOpen.value = false;
    });
  });
</script>

<style scoped>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-clamp: 2;
  }

  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-clamp: 3;
  }
</style>
