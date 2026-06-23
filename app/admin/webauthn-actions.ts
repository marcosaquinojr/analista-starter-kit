"use server";

import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  type AuthenticatorTransportFuture,
} from "@simplewebauthn/server";
import type {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
} from "@simplewebauthn/server";
import {
  getSessionUser,
  setSession,
  type Role,
} from "@/lib/auth";
import { getUserById } from "@/lib/users";
import { revalidatePath } from "next/cache";
import {
  RP_NAME,
  rpInfo,
  setChallenge,
  takeChallenge,
  listUserCredentials,
  getCredentialById,
  insertCredential,
  bumpCounter,
  deleteCredential,
  toB64url,
  fromB64url,
} from "@/lib/webauthn";

type PasskeyRegState = {
  ok?: boolean;
  error?: string;
  options?: PublicKeyCredentialCreationOptionsJSON;
};
type PasskeyAuthState = {
  ok?: boolean;
  error?: string;
  redirectTo?: string;
  options?: PublicKeyCredentialRequestOptionsJSON;
};

// ── REGISTRO (logado) — cadastra o dispositivo ────────────────────────────
export async function passkeyRegisterOptions(): Promise<PasskeyRegState> {
  const session = await getSessionUser();
  if (!session) return { error: "Sessão expirada. Faça login de novo." };
  const user = await getUserById(session.uid);
  if (!user) return { error: "Usuário não encontrado." };

  const { rpID } = await rpInfo();
  const existing = await listUserCredentials(user.id);

  const options = await generateRegistrationOptions({
    rpName: RP_NAME,
    rpID,
    userName: user.email,
    userID: new TextEncoder().encode(user.id),
    userDisplayName: user.name?.trim() || user.email,
    attestationType: "none",
    excludeCredentials: existing.map((c) => ({
      id: c.id,
      transports: (c.transports
        ? c.transports.split(",").filter(Boolean)
        : undefined) as AuthenticatorTransportFuture[] | undefined,
    })),
    authenticatorSelection: {
      residentKey: "required",
      userVerification: "preferred",
      authenticatorAttachment: "platform",
    },
  });

  await setChallenge(options.challenge);
  return { ok: true, options };
}

export async function passkeyRegisterVerify(
  response: RegistrationResponseJSON,
  deviceName: string,
): Promise<PasskeyRegState> {
  const session = await getSessionUser();
  if (!session) return { error: "Sessão expirada. Faça login de novo." };

  const expectedChallenge = await takeChallenge();
  if (!expectedChallenge) return { error: "Desafio expirado. Tente de novo." };

  const { rpID, origin } = await rpInfo();
  try {
    const verification = await verifyRegistrationResponse({
      response,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      requireUserVerification: false,
    });
    if (!verification.verified || !verification.registrationInfo) {
      return { error: "Não foi possível validar o dispositivo." };
    }
    const { credential } = verification.registrationInfo;
    await insertCredential({
      id: credential.id,
      userId: session.uid,
      publicKey: toB64url(credential.publicKey),
      counter: credential.counter,
      transports: (credential.transports ?? []).join(","),
      deviceName: deviceName.trim().slice(0, 60),
    });
    return { ok: true };
  } catch {
    return { error: "Falha ao cadastrar. Tente de novo." };
  }
}

// ── AUTENTICAÇÃO (público) — login pelo desbloqueio do dispositivo ─────────
export async function passkeyAuthOptions(): Promise<PasskeyAuthState> {
  const { rpID } = await rpInfo();
  const options = await generateAuthenticationOptions({
    rpID,
    userVerification: "preferred",
    // sem allowCredentials → usa credencial "discoverable" (sem precisar do e-mail)
  });
  await setChallenge(options.challenge);
  return { ok: true, options };
}

export async function passkeyAuthVerify(
  response: AuthenticationResponseJSON,
): Promise<PasskeyAuthState> {
  const expectedChallenge = await takeChallenge();
  if (!expectedChallenge) return { error: "Desafio expirado. Tente de novo." };

  const cred = await getCredentialById(response.id);
  if (!cred) return { error: "Dispositivo não reconhecido. Use e-mail e senha." };

  const user = await getUserById(cred.userId);
  if (!user || user.status !== "active") {
    return { error: "Conta indisponível." };
  }

  const { rpID, origin } = await rpInfo();
  try {
    const verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      requireUserVerification: false,
      credential: {
        id: cred.id,
        publicKey: fromB64url(cred.publicKey),
        counter: cred.counter,
        transports: (cred.transports
          ? cred.transports.split(",").filter(Boolean)
          : undefined) as AuthenticatorTransportFuture[] | undefined,
      },
    });
    if (!verification.verified) {
      return { error: "Não foi possível autenticar o dispositivo." };
    }
    await bumpCounter(cred.id, verification.authenticationInfo.newCounter);
    await setSession({
      uid: user.id,
      email: user.email,
      role: user.role as Role,
    });
    return { ok: true, redirectTo: "/inicio?welcome=1" };
  } catch {
    return { error: "Falha na autenticação. Tente de novo." };
  }
}

// ── Remover um dispositivo cadastrado (logado) ────────────────────────────
export async function passkeyRemove(formData: FormData): Promise<void> {
  const session = await getSessionUser();
  if (!session) return;
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await deleteCredential(id, session.uid);
  revalidatePath("/conta");
}
