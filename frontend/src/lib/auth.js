const ACCESS_TOKEN_KEY = 'ainvestfeed:accessToken';
export function setAccessToken(token) {
    try {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
    }
    catch { }
}
export function getAccessToken() {
    try {
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    }
    catch {
        return null;
    }
}
export function clearAccessToken() {
    try {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
    catch { }
}
