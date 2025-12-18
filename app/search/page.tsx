
import PageHeader from "../../components/PageHeader";
import { Input } from "../../components/ui/input";
import LoadingSkeleton from "../../components/LoadingSkeleton";

export default function SearchPage() {
  return (
    <div>
      <PageHeader
        title="Search Donors"
        description="Find donors by name or blood type."
        actions={null}
      />
      <div className="mb-6">
        <Input placeholder="Search donors..." className="w-full" />
      </div>
      <LoadingSkeleton lines={4} />
    </div>
  );
}
