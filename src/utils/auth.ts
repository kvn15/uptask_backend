import bcrypt from 'bcrypt'

export const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10) // Genera un valor aleatorio y unico por contraseña
    return await bcrypt.hash(password, salt)
}

// Comprobar password
export const checkPassword = async (enteredPassword: string, passwordHash: string) => {
    return await bcrypt.compare(enteredPassword, passwordHash);
}