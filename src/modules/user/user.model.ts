import { encryptPasswordAsync } from "../../../src/utils/encryption";
import {
    createUser as createUserService,
    verifyUser as verifyUserService,
    deleteUserByEmail as deleteUserByEmailService,
    userAuth as userAuthService,

} from "./user.service";
import { UserData } from "./user.types";

export default class User {
    email: string;
    displayName: string;
    isVerified: boolean;
    private password: string;
    private verificationCode: string;
    constructor(data: UserData) {
        this.email = data.email;
        this.password = data.password;
        this.displayName = data.displayName;
        this.verificationCode = data.verificationCode;
        this.isVerified = false;
    }

    // async getUser(): Promise<UserData> {

    //     return await getUserByEmailService(this.email);

    // }

    async create(): Promise<UserData> {
        const encryptedPassword = await this.getEncryptedPassword();
        return await createUserService({ email: this.email, password: encryptedPassword, displayName: this.displayName });
    }

    async verify(): Promise<void> {
        await verifyUserService({ email: this.email, verificationCode: this.verificationCode })
    }

    async signIn(): Promise<void> {
        //const encryptedPassword = await this.getEncryptedPassword();
        await userAuthService({ email: this.email, password: this.password });
    }

    private async getEncryptedPassword(): Promise<string> {
        return encryptPasswordAsync(this.password);
    }

    // async delete(): Promise<void> {
    //     await deleteUserByEmailService({ email: this.email });
    // }

}