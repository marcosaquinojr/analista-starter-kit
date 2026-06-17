import Toaster from "@/components/Toaster";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin">
      {children}
      <Toaster />
    </div>
  );
}
