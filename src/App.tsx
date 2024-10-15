import React, { useState, useEffect } from 'react';
import { Code, FileText, Play } from 'lucide-react';

function App() {
  const [htmlContent, setHtmlContent] = useState('<div><h1>Hello, World!</h1><p>Edit me!</p></div>');
  const [xmlContent, setXmlContent] = useState('');
  const [xsltContent, setXsltContent] = useState(`
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
  const [outputHtml, setOutputHtml] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      updateXmlContent(htmlContent);
    } catch (err) {
      setError(`Error updating XML content: ${err}`);
    }
  }, [htmlContent]);

  useEffect(() => {
    try {
      transformXmlToHtml();
    } catch (err) {
      setError(`Error transforming XML to HTML: ${err}`);
    }
  }, [xmlContent, xsltContent]);

  const updateXmlContent = (html: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const xml = new XMLSerializer().serializeToString(tempDiv);
    setXmlContent(xml);
  };

  const transformXmlToHtml = () => {
    const xsltProcessor = new XSLTProcessor();
    const parser = new DOMParser();

    const xsltDoc = parser.parseFromString(xsltContent, 'text/xml');
    xsltProcessor.importStylesheet(xsltDoc);

    const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');

    const resultDoc = xsltProcessor.transformToDocument(xmlDoc);

    const serializer = new XMLSerializer();
    const resultHtml = serializer.serializeToString(resultDoc);

    setOutputHtml(resultHtml);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">HTML-XML-XSLT Editor</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <EditorPane
          title="HTML Input"
          icon={<FileText className="w-5 h-5" />}
          content={htmlContent}
          setContent={setHtmlContent}
        />
        <EditorPane
          title="XML Output"
          icon={<Code className="w-5 h-5" />}
          content={xmlContent}
          readOnly
        />
        <EditorPane
          title="XSLT"
          icon={<Play className="w-5 h-5" />}
          content={xsltContent}
          setContent={setXsltContent}
        />
      </div>
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Transformed HTML Output</h2>
        <div
          className="bg-white p-4 rounded-lg shadow"
          dangerouslySetInnerHTML={{ __html: outputHtml }}
        />
      </div>
    </div>
  );
}

interface EditorPaneProps {
  title: string;
  icon: React.ReactNode;
  content: string;
  setContent?: (content: string) => void;
  readOnly?: boolean;
}

function EditorPane({ title, icon, content, setContent, readOnly = false }: EditorPaneProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center mb-2">
        {icon}
        <h2 className="text-xl font-semibold ml-2">{title}</h2>
      </div>
      <textarea
        className="w-full h-64 p-2 border rounded font-mono"
        value={content}
        onChange={(e) => setContent && setContent(e.target.value)}
        readOnly={readOnly}
      />
    </div>
  );
}

export default App;