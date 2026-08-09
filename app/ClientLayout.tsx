'use client';

import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { useState } from "react";
import { usePrismTheme } from "./hooks/usePrismTheme";


export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  usePrismTheme();

  return (
    <div className="relative h-full w-full">
      <nav className="w-full h-16" style={{ boxShadow: "var(--shadow)" }}>
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </nav>

      <div style={{
        height: "calc(100% - 4rem)",
        width: "100%",
        overflow: "hidden",
        display: "flex",
      }}>
        <aside style={{
          height: "100%",
          width: "16rem",
          minWidth: "16rem",
          maxWidth: "16rem",
          overflow: "auto",
          display: sidebarOpen ? "block" : "none",
        }}>
          <Sidebar />
        </aside>
        <div className="h-full w-full overflow-auto">
          <div className="flex flex-col h-fit min-h-full">
            <main className="h-fit flex flex-col grow w-full">
              {children}
            </main>
            <Footer />
          </div>
        </div>
      </div>

    </div>
  );
}
