export interface GoogleUserData {
    token: string;
}

export interface FacebookResponse {
    accessToken: string
    data_access_expiration_time: number
    email: string
    expiresIn: number
    graphDomain: string
    id: string
    name: string
    signedRequest: string
    userID: string
}

export interface FacebookVerifyResponse {
    data: {
        app_id: string,
        type: string,
        application: string,
        data_access_expires_at: number,
        expires_at: number,
        is_valid: boolean,
        scopes: any[],
        user_id: string
    }
}