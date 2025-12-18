
import { useState } from "react";
import PageHeader from "../../components/PageHeader";
import { DonorSearchSchema, bloodGroups } from "@/lib/validation";
import { formatPhoneForDisplay } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import LoadingSkeleton from "../../components/LoadingSkeleton";

const SearchFormSchema = DonorSearchSchema.pick({ bloodGroup: true, location: true });

export default function SearchPage() {
  const [form, setForm] = useState({ bloodGroup: "", location: "" });
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitted(true);
    const parse = SearchFormSchema.safeParse(form);
    if (!parse.success) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams({
        bloodGroup: form.bloodGroup,
        location: form.location,
      });
      const res = await fetch(`/api/donors/search?${params.toString()}`);
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setResults(data.donors || []);
    } catch (err) {
      setError("Failed to fetch results.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto py-10 px-4">
      <PageHeader
        title="Search Donors"
        description="Find blood donors by group and location."
      />
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
        <label className="flex flex-col gap-1">
          Blood Group
          <select
            name="bloodGroup"
            value={form.bloodGroup}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          >
            <option value="">Select...</option>
            {bloodGroups.map(bg => (
              <option key={bg} value={bg}>{bg.replace("_", " ").replace("POSITIVE", "+").replace("NEGATIVE", "-")}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          Location
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            placeholder="Enter city or area"
            required
          />
        </label>
        <button
          type="submit"
          className="bg-primary text-white rounded px-4 py-2 font-semibold hover:bg-primary/90 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      {loading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse p-4 flex gap-4 items-center">
              <div className="bg-gray-200 rounded-full w-12 h-12" />
              <div className="flex-1 space-y-2">
                <div className="bg-gray-200 h-4 w-1/3 rounded" />
                <div className="bg-gray-200 h-3 w-1/2 rounded" />
              </div>
            </Card>
          ))}
        </div>
      )}
      {!loading && submitted && results.length === 0 && (
        <div className="text-center text-gray-500">No donors found for your search.</div>
      )}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="space-y-4">
        {results.map(donor => (
          <Card key={donor.id} className="flex flex-col sm:flex-row items-center gap-4 p-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-lg">{donor.name}</span>
                <Badge>{donor.bloodGroup.replace("_", " ").replace("POSITIVE", "+").replace("NEGATIVE", "-")}</Badge>
              </div>
              <div className="text-gray-600 text-sm mb-1">{donor.location}</div>
              <div className="text-gray-800 font-mono">{formatPhoneForDisplay(donor.phone)}</div>
            </div>
            <a
              href={`tel:${donor.phone}`}
              className="bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700"
            >
              Call
            </a>
          </Card>
        ))}
      </div>
    </main>
  );
}
