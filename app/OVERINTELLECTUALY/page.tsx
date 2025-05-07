'use client';

import React, { useEffect, useState } from 'react';

export default function OverintelecutalyPage() {
  const [htmlContent, setHtmlContent] = useState<string>('');

  useEffect(() => {
    // Fetch the HTML file from the public folder
    fetch('/phish.html')
      .then(response => response.text())
      .then(html => {
        setHtmlContent(html);
      })
      .catch(error => {
        console.error('Error loading HTML file:', error);
      });
  }, []);

  return (
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
}