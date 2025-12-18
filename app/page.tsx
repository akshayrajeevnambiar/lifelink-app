
  return (
    <div>
      <PageHeader
        title="Welcome to LifeLink"
        description="A modern SaaS UI for donor management."
        actions={null}
      />
      <EmptyState
        title="No donors yet"
        description="Get started by adding your first donor."
        action={
          <Button asChild>
            <a href="/donors/new">Add Donor</a>
          </Button>
        }
      />
    </div>
  );
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import { Button } from "shadcn/ui/button";
}
