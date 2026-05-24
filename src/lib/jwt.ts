/**
 * Simple JWT decoding utility
 * Note: This does NOT verify the signature, only decodes the payload
 * Signature verification happens on the backend
 */
export interface JwtPayload {
    exp?: number;
    [key: string]: unknown;
}

export function decodeJwt(token: string): JwtPayload | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            return null;
        }

        const payload = parts[1];
        const decoded = JSON.parse(atob(payload));
        return decoded as JwtPayload;
    } catch {
        return null;
    }
}

export function getTokenExpirationTime(token: string): number | null {
    const decoded = decodeJwt(token);
    if (!decoded || !decoded.exp) {
        return null;
    }
    return decoded.exp * 1000; // Convert to milliseconds
}

export function isTokenExpired(token: string, offsetMs = 0): boolean {
    const expirationTime = getTokenExpirationTime(token);
    if (!expirationTime) {
        return true;
    }
    return Date.now() >= expirationTime - offsetMs;
}
