export function validatePassword(password: string): string | null {
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?/{}[\]~])[A-Za-z\d!@#$%^&*()_\-+=<>?/{}[\]~]{8,}$/;

    if (!password) return "Mot de passe requis";

    if (!passwordRegex.test(password)) {
        return "Le mot de passe doit contenir : 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial.";
    }

    return null;
}