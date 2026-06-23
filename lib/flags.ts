/**
 * Feature flags simples. Mantém código pronto mas permite ligar/desligar.
 */

// Login por digital/passkey (WebAuthn). Desligado por enquanto — a infra
// (tabela, actions) continua pronta; basta voltar para `true` para reativar.
export const PASSKEY_ENABLED = false;
