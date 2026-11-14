import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { LoginForm } from "@/components/admin/login-form";
import { SESSION_COOKIE, authConfigured, verifySession } from "@/lib/auth";

export const metadata: Metadata = { title: "Sign in" };
export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const session = await verifySession((await cookies()).get(SESSION_COOKIE)?.value);
  if (session) redirect("/admin");
  return (
    <div className="py-10">
      <LoginForm configured={authConfigured()} next={next} />
    </div>
  );
}
