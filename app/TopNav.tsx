import Link from "next/link";
import { Search, Plus } from "lucide-react";

export default function TopNav() {
  return (
    <nav className="w-full border-b bg-white/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <Link href="/search" className="flex items-center gap-2 text-gray-700 hover:text-black font-medium">
            <Search className="w-5 h-5" />
            Search
          </Link>
          <Link href="/donors/new" className="flex items-center gap-2 text-gray-700 hover:text-black font-medium">
            <Plus className="w-5 h-5" />
            Add Donor
          </Link>
        </div>
      </div>
    </nav>
  );
}
