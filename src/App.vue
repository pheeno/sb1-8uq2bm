<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <h1 class="text-3xl font-bold mb-6">HTML-XML-XSLT Editor</h1>
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
      <strong class="font-bold">Error: </strong>
      <span class="block sm:inline">{{ error }}</span>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <RichTextEditor
        title="HTML Input"
        :icon="FileText"
        v-model="htmlContent"
      />
      <EditorPane
        title="XML Output"
        :icon="Code"
        :modelValue="xmlContent"
        readonly
      />
      <EditorPane
        title="XSLT"
        :icon="Play"
        v-model="xsltContent"
      />
    </div>
    <div class="mt-6">
      <h2 class="text-2xl font-bold mb-4">Transformed HTML Output</h2>
      <div
        class="bg-white p-4 rounded-lg shadow"
        v-html="outputHtml"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { FileText, Code, Play } from 'lucide-vue-next';
import EditorPane from './components/EditorPane.vue';
import RichTextEditor from './components/RichTextEditor.vue';

const htmlContent = ref('<div><h1>Hello, World!</h1><p>Edit me!</p></div>');
const xmlContent = ref('');
const xsltContent = ref(`
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" indent="yes"/>
  <xsl:template match="/">
    <xsl:apply-templates/>
  </xsl:template>
  <xsl:template match="@*|node()">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()"/>
    </xsl:copy>
  </xsl:template>
</xsl:stylesheet>
`);
const outputHtml = ref('');
const error = ref<string | null>(null);

const updateXmlContent = (html: string) => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  const xml = new XMLSerializer().serializeToString(tempDiv);
  xmlContent.value = xml;
};

const transformXmlToHtml = () => {
  const xsltProcessor = new XSLTProcessor();
  const parser = new DOMParser();

  const xsltDoc = parser.parseFromString(xsltContent.value, 'text/xml');
  xsltProcessor.importStylesheet(xsltDoc);

  const xmlDoc = parser.parseFromString(xmlContent.value, 'text/xml');

  const resultDoc = xsltProcessor.transformToDocument(xmlDoc);

  const serializer = new XMLSerializer();
  const resultHtml = serializer.serializeToString(resultDoc);

  outputHtml.value = resultHtml;
};

watch(htmlContent, (newValue) => {
  try {
    updateXmlContent(newValue);
  } catch (err) {
    error.value = `Error updating XML content: ${err}`;
  }
});

watch([xmlContent, xsltContent], () => {
  try {
    transformXmlToHtml();
  } catch (err) {
    error.value = `Error transforming XML to HTML: ${err}`;
  }
});
</script>