import AuthShell from "@/components/AuthShell";
import LoginForm from "./LoginForm";
import PasskeyLoginButton from "@/components/PasskeyLoginButton";
import { CtMark } from "@/components/Logo";

export default function LoginPage() {
  return (
    <AuthShell>
      <div className="landing-logo">
        <CtMark size={42} />
      </div>
      <h1 className="landing-title">Citiesoft Academy</h1>
      <p className="landing-sub">
        Entre com a conta que você recebeu por convite.
      </p>
      <LoginForm />
      <PasskeyLoginButton />
    </AuthShell>
  );
}
