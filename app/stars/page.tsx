'use client';

import { useEffect } from 'react';

export default function RedirectPage() {
  useEffect(() => {
    // Redirect to stars.html (file in public folder)
    window.location.href = '/stars.html';
  }, []);

  // This content will be shown briefly before the redirect happens
  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-xl">Redirecting to stars page...</p>
    </div>
  );
}
