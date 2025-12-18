
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DonorCreateSchema, bloodGroups } from "../lib/validation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createDonorAction } from "../app/donors/new/actions/createDonorAction";

const bloodGroupOptions = [
  { label: "O+", value: "O_POSITIVE" },
  { label: "O-", value: "O_NEGATIVE" },
  { label: "A+", value: "A_POSITIVE" },
  { label: "A-", value: "A_NEGATIVE" },
  { label: "B+", value: "B_POSITIVE" },
  { label: "B-", value: "B_NEGATIVE" },
  { label: "AB+", value: "AB_POSITIVE" },
  { label: "AB-", value: "AB_NEGATIVE" },
];

export default function DonorForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(DonorCreateSchema),
    mode: "onTouched",
  });

  async function onSubmit(values: any) {
    setIsSubmitting(true);
    setServerError(null);
    const formData = new FormData();
    Object.entries(values).forEach(([k, v]) => formData.append(k, v as string));
    const result = await createDonorAction(formData);
    setIsSubmitting(false);
    if (result.ok) {
      // Show toast (replace with your preferred toast lib)
      alert(result.message);
      reset();
      router.push("/search");
    } else {
      setServerError(result.message);
    }
  }

  return (
    <Card className="max-w-md mx-auto w-full">
      <CardHeader>
        <CardTitle>Add Donor</CardTitle>
        <CardDescription>Fill in the details below to add a new donor.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
            <Input id="name" {...register("name")} placeholder="Donor name" aria-invalid={!!errors.name} />
            <p className="text-xs text-muted-foreground mt-1">Full name as on ID.</p>
            {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name.message as string}</div>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="bloodGroup">Blood Group</label>
            <select id="bloodGroup" {...register("bloodGroup")} className="w-full border rounded px-3 py-2" aria-invalid={!!errors.bloodGroup} defaultValue="">
              <option value="" disabled>Select...</option>
              {bloodGroupOptions.map((bg) => (
                <option key={bg.value} value={bg.value}>{bg.label}</option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground mt-1">Choose the correct blood group.</p>
            {errors.bloodGroup && <div className="text-red-500 text-xs mt-1">{errors.bloodGroup.message as string}</div>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="location">Location</label>
            <Input id="location" {...register("location")} placeholder="e.g. Toronto" aria-invalid={!!errors.location} />
            <p className="text-xs text-muted-foreground mt-1">City or region (e.g. Scarborough, North York).</p>
            {errors.location && <div className="text-red-500 text-xs mt-1">{errors.location.message as string}</div>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="phone">Phone</label>
            <Input id="phone" {...register("phone")} placeholder="e.g. +1 (416) 555-1234" aria-invalid={!!errors.phone} />
            <p className="text-xs text-muted-foreground mt-1">Digits only, or use +, spaces, dashes.</p>
            {errors.phone && <div className="text-red-500 text-xs mt-1">{errors.phone.message as string}</div>}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Donor"}
          </Button>
          {serverError && <div className="text-red-600 text-center text-sm mt-2">{serverError}</div>}
        </form>
      </CardContent>
    </Card>
  );
}
