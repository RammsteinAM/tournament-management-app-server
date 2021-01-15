import passwordGenerator from 'generate-password';

export const createSocialUserPassword = (): string => passwordGenerator.generate({
    length: 20,
    numbers: true,
    symbols: true
})