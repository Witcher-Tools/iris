export function trimString(string, maxLength = 30) {
    if (string === null || string === undefined) return "";

    if (string.length <= maxLength) return string;

    return `...${string.slice(-maxLength)}`;
}