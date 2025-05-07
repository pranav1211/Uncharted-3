// app/OVERINTELECUTALY/page.tsx
import React from 'react';
import path from 'path';
import fs from 'fs';

export default async function OverintelecutalyPage() {
  // Read HTML file from the OVERINTELECUTALY directory
  let htmlContent = '';
  try {
    // Path to the index.html file in the same directory as this page.tsx
    const filePath = path.join(process.cwd(), 'app', 'OVERINTELECUTALY', 'index.html');
    htmlContent = fs.readFileSync(filePath, 'utf8');
    
    // Update paths for images and other resources to ensure they're correctly referenced
    // This assumes your images are in the same OVERINTELECUTALY directory
    htmlContent = htmlContent.replace(
      /(src|href)="(?!http|https|\/\/|data:|#|\/)((?!\/)[^"]*)"/g,
      (match, attr, url) => `${attr}="/OVERINTELECUTALY/${url}"`
    );
  } catch (error) {
    console.error('Error reading HTML file:', error);
    return <div>Error loading content</div>;
  }
  
  return (
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
}