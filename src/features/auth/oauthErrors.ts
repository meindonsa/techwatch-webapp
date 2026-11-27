/**
 * Messages affichés pour les codes d'erreur renvoyés par l'API dans `/login?error=<code>`
 * après un échec de connexion Google / GitHub (voir API.md, « Connexion Google & GitHub »).
 */
const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  email_exists:
    'Un compte existe déjà avec cet email. Connecte-toi avec ton mot de passe, puis lie Google ou GitHub depuis ton profil.',
  email_not_verified: "Ton email n'est pas vérifié chez ce fournisseur. Vérifie-le puis réessaie.",
  access_denied: 'Connexion annulée.',
  invalid_state: 'La session de connexion a expiré. Réessaie.',
  invalid_code: 'Le lien de connexion a expiré. Réessaie.',
  not_configured: "Ce mode de connexion n'est pas disponible pour le moment.",
  provider_error: 'Le service de connexion ne répond pas. Réessaie dans un instant.',
}

const DEFAULT_MESSAGE = 'Une erreur est survenue lors de la connexion'

export function getOAuthErrorMessage(code: unknown): string {
  return typeof code === 'string'
    ? (OAUTH_ERROR_MESSAGES[code] ?? DEFAULT_MESSAGE)
    : DEFAULT_MESSAGE
}
