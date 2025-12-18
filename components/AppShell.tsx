import { ReactNode } from "react";
import TopNav from "../app/TopNav";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <TopNav />
      <div className="max-w-2xl mx-auto px-4 py-8">{children}</div>
    </div>
  );
}
