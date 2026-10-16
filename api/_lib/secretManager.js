import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';

function getEncryptionKey() {
  const secret =
    process.env.BDCOURIER_ENCRYPTION_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    'bdcourier-secret-encryption-seed-2026';
  return crypto.scryptSync(secret, 'bdcourier_salt_v1', 32);
}

/**
 * Encrypts an API key at rest using AES-256-GCM authenticated encryption.
 */
export function encryptApiKey(apiKey) {
  if (!apiKey || typeof apiKey !== 'string') return null;
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(apiKey.trim(), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag().toString('hex');

  return {
    encrypted,
    iv: iv.toString('hex'),
    tag
  };
}

/**
 * Decrypts an encrypted API key using stored ciphertext, IV and authentication tag.
 */
export function decryptApiKey(encrypted, ivHex, tagHex) {
  if (!encrypted || !ivHex || !tagHex) return null;
  try {
    const key = getEncryptionKey();
    const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(ivHex, 'hex'));
    decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    console.error('[Crypto] Decryption failed:', err.message);
    return null;
  }
}

/**
 * Generates a masked indicator for display in admin panel (e.g. "bdc_••••••••3a9f").
 */
export function maskApiKey(apiKey) {
  if (!apiKey || typeof apiKey !== 'string') return '';
  const trimmed = apiKey.trim();
  if (trimmed.length <= 6) return '••••••••';
  const start = trimmed.slice(0, 4);
  const end = trimmed.slice(-4);
  return `${start}••••••••••••${end}`;
}

export default {
  encryptApiKey,
  decryptApiKey,
  maskApiKey
};
