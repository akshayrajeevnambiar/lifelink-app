import { ReactNode } from "react";

export default function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">{title}</h1>
        {description && <p className="text-gray-500 text-sm">{description}</p>}
      </div>
      {actions && <div className="flex-shrink-0 flex gap-2">{actions}</div>}
    </div>
  );
}
