"use server";
import { DonorCreateSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { normalizeLocation, normalizePhone } from "@/lib/utils";

export type CreateDonorResult =
  | { ok: true; message: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

export async function createDonorAction(formData: FormData): Promise<CreateDonorResult> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = DonorCreateSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const [k, v] of Object.entries(parsed.error.flatten().fieldErrors)) {
      if (v && v.length) fieldErrors[k] = v[0];
    }
    return { ok: false, message: "Please correct the highlighted errors.", fieldErrors };
  }
  const data = parsed.data;
  // Normalize again for safety
  const location = normalizeLocation(data.location);
  const phone = normalizePhone(data.phone);
  try {
    // Prevent duplicate: same phone, bloodGroup, location
    const existing = await prisma.donor.findFirst({
      where: { phone, bloodGroup: data.bloodGroup, location },
    });
    if (existing) {
      return { ok: false, message: "A donor with this phone, blood group, and location already exists." };
    }
    await prisma.donor.create({
      data: { ...data, location, phone },
    });
    return { ok: true, message: "Donor created successfully." };
  } catch (e) {
    return { ok: false, message: "An unexpected error occurred. Please try again." };
  }
}
