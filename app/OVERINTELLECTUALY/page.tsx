'use client';

import React, { useEffect } from 'react';

export default function OverintelecutalyPage() {
  useEffect(() => {
    // Redirect to the HTML file in the public folder
    window.location.href = '/phish.html';
  }, []);

  return null; // Return null since there's no UI to render
}
