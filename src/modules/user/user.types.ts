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
    email: string;
    password?: string;
    displayName?: string;
    verificationCode?: string;
    isVerified?: boolean;
}

// export interface UserDeleteData {
//     email: string;
// }

export interface UserVerificationData {
    email: string;
    verificationCode: string;
}