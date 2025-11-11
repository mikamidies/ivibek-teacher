/**
 * Декодирует JWT токен без проверки подписи
 * @param token - JWT токен
 * @returns Декодированный payload или null
 */
export function decodeJWT(token: string): any {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

/**
 * Проверяет истёк ли токен
 * @param token - JWT токен
 * @returns true если токен истёк, false в противном случае
 */
export function isTokenExpired(token: string | null | undefined): boolean {
  if (!token) return true;

  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return true;

  // exp в секундах, Date.now() в миллисекундах
  return payload.exp * 1000 < Date.now();
}

/**
 * Возвращает время до истечения токена в секундах
 * @param token - JWT токен
 * @returns Количество секунд до истечения или 0 если истёк
 */
export function getTokenExpiryTime(token: string | null | undefined): number {
  if (!token) return 0;

  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return 0;

  const expiryTime = payload.exp * 1000 - Date.now();
  return Math.max(0, Math.floor(expiryTime / 1000));
}

/**
 * Проверяет нужно ли обновить токен (< 5 минут до истечения)
 * @param token - JWT токен
 * @returns true если нужно обновить токен
 */
export function shouldRefreshToken(token: string | null | undefined): boolean {
  if (!token) return false;

  const timeLeft = getTokenExpiryTime(token);
  // Обновляем если осталось меньше 5 минут (300 секунд)
  return timeLeft > 0 && timeLeft < 300;
}
