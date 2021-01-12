import { OAuth2Client, TokenPayload } from 'google-auth-library';
const clientId = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(clientId);

export const googleVerify = async (token: string): Promise<TokenPayload> => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: clientId,
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];
    return payload;
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
}
//verify().catch(console.error);