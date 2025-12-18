
import { useRef, useState } from "react";
import Link from "next/link";
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
  // Store last search params for refresh
  const [lastSearch, setLastSearch] = useState<{ bloodGroup: string; location: string } | null>(null);

  const locationInputRef = useRef<HTMLInputElement>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const fetchResults = async (paramsObj: { bloodGroup: string; location: string }, seed?: string) => {
    setError(null);
    setLoading(true);
    try {
      // Normalize location for consistency
      const normalizedLocation = paramsObj.location.trim().toLowerCase();
      const params = new URLSearchParams({
        bloodGroup: paramsObj.bloodGroup,
        location: normalizedLocation,
      });
      if (seed) params.set('seed', seed);
      const res = await fetch(`/api/donors/search?${params.toString()}`);
      if (!res.ok) {
        let msg = 'Search failed.';
        try {
          const data = await res.json();
          msg = data?.error || msg;
        } catch {}
        throw new Error(msg);
      }
      const data = await res.json();
      setResults(data.donors || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch results.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitted(true);
    // Normalize location for validation
    const parse = SearchFormSchema.safeParse({ ...form, location: form.location.trim().toLowerCase() });
    if (!parse.success) {
      setError("Please fill in all fields.");
      if (locationInputRef.current) locationInputRef.current.focus();
      return;
    }
    setLastSearch({ bloodGroup: form.bloodGroup, location: form.location });
    await fetchResults({ bloodGroup: form.bloodGroup, location: form.location });
  };

  const handleRefresh = async () => {
    if (!lastSearch) return;
    setSubmitted(true);
    await fetchResults(lastSearch, Date.now().toString());
  };

  return (
    <main className="max-w-2xl mx-auto py-10 px-4">
      <PageHeader
        title="Search Donors"
        description="Find blood donors by group and location."
      />
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 mb-10" autoComplete="off">
        <label className="flex flex-col gap-1">
          <span className="font-medium">Blood Group</span>
          <select
            name="bloodGroup"
            value={form.bloodGroup}
            onChange={handleChange}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            required
            aria-label="Blood Group"
          >
            <option value="">Select blood group...</option>
            {bloodGroups.map(bg => (
              <option key={bg} value={bg}>{bg.replace("_", " ").replace("POSITIVE", "+").replace("NEGATIVE", "-")}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-medium">Location</span>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter city or area"
            required
            ref={locationInputRef}
            aria-label="Location"
            autoComplete="off"
          />
        </label>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <button
            type="submit"
            className="bg-primary text-white rounded px-4 py-2 font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
          <button
            type="button"
            onClick={handleRefresh}
            className="bg-secondary text-gray-900 rounded px-4 py-2 font-semibold border border-gray-300 hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            disabled={loading || !lastSearch}
            title={!lastSearch ? "Search first to enable refresh" : "Refresh results"}
          >
            Refresh results
          </button>
        </div>
      </form>
      {error && (
        <div className="mb-6">
          <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded flex items-center gap-2" role="alert">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0Z" /></svg>
            <span>{error}</span>
          </div>
        </div>
      )}
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
      {!loading && submitted && results.length === 0 && !error && (
        <div className="text-center text-gray-500 flex flex-col items-center gap-3">
          <span>No donors found for your search.</span>
          <Link href="/donors/new" className="inline-block bg-primary text-white px-4 py-2 rounded font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary mt-2">Add a donor</Link>
        </div>
      )}
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
              className="bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Call
            </a>
          </Card>
        ))}
      </div>
    </main>
  );
}
