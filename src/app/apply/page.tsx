import type { Metadata } from "next";

import { PageHeader } from "@/components/site/page-header";
import { ApplyForm } from "@/components/apply/apply-form";

export const metadata: Metadata = {
  title: "Apply",
  description: "Apply to join Wolfgang e-Sports as an individual player or as an existing team.",
};

export default function ApplyPage() {
  return (
    <>
      <PageHeader
        index="06"
        eyebrow="Apply"
        title="Join the pack."
        description="Players and teams who want to compete under the Wolfgang banner can apply here. It takes about ten minutes, and every application is reviewed by our team."
      />
      <section className="container-x py-16 sm:py-20">
        <ApplyForm />
      </section>
    </>
  );
}
