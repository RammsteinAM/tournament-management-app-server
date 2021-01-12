export interface UserCreateData {
    email: string;
    password: string;
    displayName: string;
}

export interface UserAuthData {
    email: string;
    password: string;
}

export interface UserData {
    id?: number;
    email?: string;
    password?: string;
    displayName?: string;
    isVerified?: boolean;
    verificationToken?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface UserLoginData {
    accessToken: string;
    refreshToken: string;
}

// export interface UserDeleteData {
//     email: string;
// }

export type UserVerificationData = {
    token: string;
}

export type DecodedTokenData = {
    id: number;
}