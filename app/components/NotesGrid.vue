<template>
  <div
    :class="[
      'gap-4',
      isGridView
        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        : 'flex flex-col space-y-4',
    ]"
  >
    <NoteCard
      v-for="note in notes"
      :key="note.id"
      :note="note"
      :is-grid-view="isGridView"
      :is-dropdown-open="openDropdownId === note.id"
      @toggle-dropdown="handleToggleDropdown"
      @edit="$emit('edit', $event)"
      @pin="$emit('pin', $event)"
      @complete="$emit('complete', $event)"
      @archive="$emit('archive', $event)"
      @delete="$emit('delete', $event)"
      @view="$emit('view', $event)"
    />
  </div>
</template>

<script setup lang="ts">
  import type { Note } from "~/stores/notes";

  interface Props {
    notes: Note[];
    isGridView: boolean;
  }

  interface Emits {
    (e: "edit" | "pin" | "complete" | "archive" | "delete" | "view", note: Note): void;
  }

  const _props = defineProps<Props>();
  const _emit = defineEmits<Emits>();

  // Dropdown state
  const openDropdownId = ref<number | null>(null);

  const handleToggleDropdown = (noteId: number) => {
    openDropdownId.value = openDropdownId.value === noteId ? null : noteId;
  };

  // Close dropdown when clicking outside
  onMounted(() => {
    document.addEventListener("click", () => {
      openDropdownId.value = null;
    });
  });
</script>
