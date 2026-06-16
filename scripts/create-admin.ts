/**
 * Bootstrap do primeiro administrador. Cria (ou reaproveita) um usuário admin
 * em estado "convidado" e imprime o link de convite — abra o link pra definir
 * a senha. Não define senha aqui; segue o mesmo fluxo de convite do app.
 *
 *   node --env-file=.env.local node_modules/tsx/dist/cli.mjs scripts/create-admin.ts <email> [nome] [baseUrl]
 *
 * baseUrl padrão: http://localhost:3000 (use a URL de produção pra um link de prod).
 */
import { neon } from "@neondatabase/serverless";
import { randomUUID, randomBytes } from "node:crypto";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL não definida (use --env-file=.env.local)");

  const email = (process.argv[2] ?? "").trim().toLowerCase();
  const name = (process.argv[3] ?? "").trim();
  const baseUrl = (process.argv[4] ?? "http://localhost:3000").replace(/\/$/, "");
  if (!email || !email.includes("@")) {
    throw new Error("Uso: ... scripts/create-admin.ts <email> [nome] [baseUrl]");
  }

  const sql = neon(url);
  const token = randomBytes(24).toString("base64url");
  const expires = new Date(Date.now() + 7 * 86400000).toISOString();

  const existing = await sql`SELECT id, status FROM users WHERE email = ${email} LIMIT 1`;
  if (existing.length > 0) {
    if (existing[0].status === "active") {
      console.log(`\n  ${email} já é um usuário ativo. Nada a fazer.\n`);
      return;
    }
    await sql`
      UPDATE users
      SET role = 'admin', invite_token = ${token}, invite_expires_at = ${expires},
          status = 'invited', name = ${name || ""}
      WHERE email = ${email}`;
    console.log(`\n  ✓ convite de admin renovado para ${email}.`);
  } else {
    await sql`
      INSERT INTO users (id, email, name, role, password_hash, invite_token, invite_expires_at, status, created_at)
      VALUES (${randomUUID()}, ${email}, ${name || ""}, 'admin', NULL, ${token}, ${expires}, 'invited', ${new Date().toISOString()})`;
    console.log(`\n  ✓ admin convidado: ${email}`);
  }

  console.log(`\n  Abra este link para definir a senha e entrar:\n`);
  console.log(`    ${baseUrl}/convite/${token}\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
