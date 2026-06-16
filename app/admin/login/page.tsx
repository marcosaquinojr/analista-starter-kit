import AuthShell from "@/components/AuthShell";
import LoginForm from "./LoginForm";
import { CtMark } from "@/components/Logo";
import { getLastUpdated } from "@/lib/chapters";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const last = await getLastUpdated();

  return (
    <AuthShell footer={last ? `Última atualização em ${last}` : undefined}>
      <div className="landing-logo">
        <CtMark size={42} />
      </div>
      <h1 className="landing-title">Citiesoft Academy</h1>
      <p className="landing-sub">
        Entre com a conta que você recebeu por convite.
      </p>
      <LoginForm />
    </AuthShell>
  );
}
