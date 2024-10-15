<template>
  <div class="bg-white p-4 rounded-lg shadow">
    <div class="flex items-center mb-2">
      <component :is="icon" class="w-5 h-5" />
      <h2 class="text-xl font-semibold ml-2">{{ title }}</h2>
    </div>
    <textarea
      class="w-full h-64 p-2 border rounded font-mono"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      :readonly="readonly"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

defineProps<{
  title: string;
  icon: any;
  modelValue: string;
  readonly?: boolean;
}>();

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>