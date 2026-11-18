import type { Metadata } from "next";

import { ApplyForm } from "@/components/apply/apply-form";

export const metadata: Metadata = {
  title: "Apply",
  description: "Apply to join Wolfgang e-Sports as an individual player or as an existing team.",
};

export default function ApplyPage() {
  return (
    <section className="container-x pt-32 pb-16 sm:pt-40 sm:pb-20">
      <h1 className="sr-only">Apply to join Wolfgang e-Sports</h1>
      <ApplyForm />
    </section>
  );
}
