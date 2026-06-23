import { redirect } from "next/navigation";
import LandingPage from "@/components/LandingPage";
import { getSessionUser } from "@/lib/auth";

export default async function Home() {
  const user = await getSessionUser();
  if (user) redirect("/inicio");
  return <LandingPage />;
}
