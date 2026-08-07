'use client';

import { useEffect } from 'react';
import Link from "next/link";
import { Rocket } from "lucide-react";

export default function NotFound() {
  useEffect(() => {
    document.body.setAttribute('data-route-status', 'not-found');

    return () => {
      document.body.removeAttribute('data-route-status');
    };
  }, []);

  return (
    <main className="not-found" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", textAlign: "center", padding: "2rem" }}>
      <div className="card">
        <div className="icon">
            <img src="/construction.png" alt="" />
        </div>

      

       
<div style={{ display: "flex",justifyContent: "center", gap: "1rem", marginTop: "1rem" }}>
        <Link href="/" className="button" style={{ display: "flex", alignItems: "center",  color: "#fff", backgroundColor: "#818cf8", padding: "0.5rem 1rem", borderRadius: "0.375rem", textDecoration: "none" }}>
          Home
        </Link>
        <Link href="/contact" className="button" style={{ display: "flex", alignItems: "center",  color: "#fff", backgroundColor: "#818cf8", padding: "0.5rem 1rem", borderRadius: "0.375rem", textDecoration: "none" }}>
            Contact Support
        </Link>
         <Link href="/contact" className="button" style={{ display: "flex", alignItems: "center",  color: "#fff", backgroundColor: "#818cf8", padding: "0.5rem 1rem", borderRadius: "0.375rem", textDecoration: "none" }}>
            Join Community
        </Link>
        </div>
      </div>
    </main>
  );
}