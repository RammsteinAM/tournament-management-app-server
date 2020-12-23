import bcrypt from 'bcrypt';

export const encryptPasswordAsync = async (plainPassword: string): Promise<string> => {
    const saltRounds: number = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
    return await bcrypt.hash(plainPassword, saltRounds);
}

export const checkPasswordAsync = async (plainPassword: string, encryptedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(plainPassword, encryptedPassword);
}