'use client';

import { useEffect, useRef, useState } from 'react';

interface LivePreviewProps {
  html?: string;
  css?: string;
  javascript?: string;
  height?: string;
}

export function LivePreview({
  html = '',
  css = '',
  javascript = '',
  height = '600px',
}: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    const document = iframeRef.current.contentDocument;
    if (!document) return;

    try {
      setError(null);

      // Build the complete HTML document
      const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      padding: 20px;
    }
    ${css}
  </style>
</head>
<body>
  ${html}
  <script>
    // Error handling
    window.onerror = function(message, source, lineno, colno, error) {
      console.error('Preview Error:', message);
      document.body.innerHTML = '<div style="color: red; padding: 20px; background: #fee; border: 1px solid red; border-radius: 8px;"><strong>Error:</strong> ' + message + '</div>';
      return true;
    };

    // User's JavaScript
    try {
      ${javascript}
    } catch (e) {
      console.error('JavaScript Error:', e);
      document.body.innerHTML = '<div style="color: red; padding: 20px; background: #fee; border: 1px solid red; border-radius: 8px;"><strong>JavaScript Error:</strong> ' + e.message + '</div>';
    }
  </script>
</body>
</html>
      `;

      document.open();
      document.write(fullHtml);
      document.close();
    } catch (err: any) {
      setError(err.message);
    }
  }, [html, css, javascript]);

  return (
    <div className="relative w-full" style={{ height }}>
      {error && (
        <div className="absolute top-0 left-0 right-0 bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg m-4 z-10">
          <strong>Preview Error:</strong> {error}
        </div>
      )}
      <iframe
        ref={iframeRef}
        className="w-full h-full border-0 bg-white rounded-lg"
        title="Live Preview"
        sandbox="allow-scripts"
      />
    </div>
  );
}
