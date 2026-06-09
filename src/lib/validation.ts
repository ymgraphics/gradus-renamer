const FORBIDDEN_CHARS = /[<>:"/\\|?*]/g;
const MULTIPLE_SPACES = /\s{2,}/g;

export function sanitizeFilename(value: string): string {
  return value
    .replace(FORBIDDEN_CHARS, '')
    .replace(MULTIPLE_SPACES, ' ')
    .trim();
}

export function validateSubject(subject: string): { valid: boolean; message: string } {
  const trimmed = subject.trim();
  if (!trimmed) {
    return { valid: false, message: 'Subject cannot be empty' };
  }
  if (trimmed.length > 200) {
    return { valid: false, message: 'Subject must be less than 200 characters' };
  }
  return { valid: true, message: '' };
}

export function validateNamingForm(client: string, format: string, subject: string): { valid: boolean; message: string } {
  if (!client) {
    return { valid: false, message: 'Please select a client' };
  }
  if (!format) {
    return { valid: false, message: 'Please select a format' };
  }
  return validateSubject(subject);
}

export function generateFilename(client: string, format: string, subject: string): string {
  const sanitized = sanitizeFilename(subject);
  if (!client || !format || !sanitized) return '';
  return `Gradus - ${client} - ${format} - ${sanitized}`;
}

export function generateBatchFilename(
  client: string,
  format: string,
  subject: string,
  index: number,
  total: number
): string {
  const base = generateFilename(client, format, subject);
  if (!base) return '';
  if (total <= 1) return base;
  const padded = String(index + 1).padStart(2, '0');
  return `${base} ${padded}`;
}
