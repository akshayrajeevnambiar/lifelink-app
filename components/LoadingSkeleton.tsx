import { Card } from "shadcn/ui/card";

export default function LoadingSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <Card className="p-6 animate-pulse">
      <div className="space-y-3">
        {[...Array(lines)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded w-full" />
        ))}
      </div>
    </Card>
  );
}
