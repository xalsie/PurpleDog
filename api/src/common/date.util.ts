export function parseFrenchDate(value?: string | null): Date | null {
    if (!value) return null;
    const [day, month, year] = value.split('/').map((part) => Number(part));
    if (!day || !month || !year) return null;
    const parsed = new Date(year, month - 1, day);
    return parsed &&
        parsed.getFullYear() === year &&
        parsed.getMonth() === month - 1 &&
        parsed.getDate() === day
        ? parsed
        : null;
}

export function calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }
    return age;
}
