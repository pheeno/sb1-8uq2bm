<template>
  <div class="bg-white p-4 rounded-lg shadow">
    <div class="flex items-center mb-2">
      <component :is="icon" class="w-5 h-5" />
      <h2 class="text-xl font-semibold ml-2">{{ title }}</h2>
    </div>
    <div ref="editorElement" class="w-full h-64 border rounded"></div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, onMounted, ref, watch } from 'vue';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const props = defineProps<{
  title: string;
  icon: any;
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const editorElement = ref<HTMLElement | null>(null);
let quill: Quill | null = null;

onMounted(() => {
  if (editorElement.value) {
    quill = new Quill(editorElement.value, {
      theme: 'snow',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ 'header': 1 }, { 'header': 2 }],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'script': 'sub'}, { 'script': 'super' }],
          [{ 'indent': '-1'}, { 'indent': '+1' }],
          [{ 'direction': 'rtl' }],
          [{ 'size': ['small', false, 'large', 'huge'] }],
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'font': [] }],
          [{ 'align': [] }],
          ['clean']
        ]
      }
    });

    quill.root.innerHTML = props.modelValue;

    quill.on('text-change', () => {
      emit('update:modelValue', quill?.root.innerHTML || '');
    });
  }
});

watch(() => props.modelValue, (newValue) => {
  if (quill && quill.root.innerHTML !== newValue) {
    quill.root.innerHTML = newValue;
  }
});
</script>