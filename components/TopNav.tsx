import Link from "next/link";
import { Search, Plus } from "lucide-react";
import { Button } from "shadcn/ui/button";

export default function TopNav() {
  return (
    <nav className="w-full border-b bg-white/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/search" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Search
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/donors/new" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Donor
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
