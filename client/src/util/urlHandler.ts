export function normalizeWebsite(input: string) {
    return input
        .trim()
        .replace(/^https?:\/\//i, "") // remove http:// or https://
        .replace(/^www\./i, "www.") // optional: keep www if they typed it (or remove if you prefer)
        .replace(/\/+$/, ""); // remove trailing slashes
}

export function toHttpsUrl(input: string) {
    const value = input.trim();
    if (!value) return "";
    if (/^https?:\/\//i.test(value)) return value.toLowerCase();
    return `https://${value.toLowerCase()}`;
}
