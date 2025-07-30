import {hash,genSalt,compare} from 'bcrypt'

export const hashPassword = async (password) => {
    const salt = await genSalt(10);
    return hash(password, salt);
}

export const comparePassword = async (plainPassword,hashedPassword) => {
    console.log('Comparing passwords: [HIDDEN] vs', hashedPassword.substring(0, 20) + '...');
    return compare(plainPassword,hashedPassword);
}
