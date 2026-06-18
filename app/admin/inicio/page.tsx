import AdminChrome from "@/components/AdminChrome";
import HomeEditor from "./HomeEditor";
import { getHomeContent } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const home = await getHomeContent();
  return (
    <AdminChrome>
      <HomeEditor home={home} />
    </AdminChrome>
  );
}
