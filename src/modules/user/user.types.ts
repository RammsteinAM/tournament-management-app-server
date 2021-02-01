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

export interface UserResetPasswordRequestData {
    password: string;
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
    passwordResetToken?: string;
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
    id: number;
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
export type SocialUserLoginData = UserLoginData & { social: boolean };

// export interface UserDeleteData {
//     email: string;
// }

export type UserVerificationData = {
    token: string;
}

export type UserLoginCheckData = {
    refreshToken: string;
}

export interface UserLoginCheckResData extends UserCreationData {
    accessToken?: string;
    social?: boolean;
}

export type UserResetPasswordData = {
    token: string;
    password: string;
}

export type DecodedTokenData = {
    id: number;
    social?: boolean;
}