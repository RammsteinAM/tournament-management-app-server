export interface UserCreateData {
    email: string;
    password: string;
    displayName: string;
}

export interface UserEditData {
    password?: string;
    displayName?: string;
}

export interface UserEditRequestData extends UserEditData {
    currentPassword?: string;
}

export interface UserAuthData {
    email: string;
    password: string;
}

export interface UserPasswordResetData {
    email: string;
}

export interface UserData {
    id: number;
    email: string;
    password: string;
    displayName?: string;
    isVerified: boolean;
    googleId?: string;
    facebookId?: string;
    verificationToken?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserInstanceData {
    id?: number;
    email?: string;
    password?: string;
    displayName?: string;
    isVerified?: boolean;
    googleId?: string;
    facebookId?: string;
    verificationToken?: string;
}

export interface UserCreationData {
    displayName: string;
    email: string;
}

export interface UserVerifiedData extends UserCreationData {
    isVerified: boolean;
}

export interface UserLoginTokenData {
    accessToken: string;
    refreshToken: string;
}

export type UserLoginData = UserCreationData & UserLoginTokenData;

// export interface UserDeleteData {
//     email: string;
// }

export type UserVerificationData = {
    token: string;
}

export type DecodedTokenData = {
    id: number;
}