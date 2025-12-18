import { ReactNode } from "react";
import { Card } from "shadcn/ui/card";
import { Badge } from "shadcn/ui/badge";

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <Card className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      {icon && <div className="mb-2 text-gray-400">{icon}</div>}
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && <p className="text-gray-500 text-sm mb-2">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </Card>
  );
}
