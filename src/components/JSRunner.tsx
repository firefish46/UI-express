"use client";

import { useEffect } from "react";

export default function JSRunner({ scriptCode, componentId }: { scriptCode: string, componentId: string }) {
  useEffect(() => {
    if (!scriptCode) return;

    // Create a new script element
    const script = document.createElement("script");
    
    // Wrap in IIFE for safety and to handle the specific component
    script.innerHTML = `
      (function() {
        try {
          ${scriptCode}
        } catch (err) {
          console.error("JS Error in component ${componentId}:", err);
        }
      })();
    `;

    // Append to body to execute
    document.body.appendChild(script);

    // Cleanup: Remove the script when the user leaves the page 
    // or the component changes
    return () => {
      document.body.removeChild(script);
    };
  }, [scriptCode, componentId]);

  return null; // This component doesn't render anything visible
}