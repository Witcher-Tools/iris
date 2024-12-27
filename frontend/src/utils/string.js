export function trimString(path, n = 2) {
    if (!path) return '';

    const normalizedPath = path.replace(/\\/g, '/');
    const parts = normalizedPath.split('/');

    return `.../${parts.slice(-n).join('/')}`;
}