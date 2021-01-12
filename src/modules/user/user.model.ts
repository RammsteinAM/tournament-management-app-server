import prisma from "../../../prisma/prisma";
import { encryptPasswordAsync } from "../../../src/utils/encryption";
import {
    deleteUserByEmail as deleteUserByEmailService,

} from "./user.service";
import { UserCreateData, UserData } from "./user.types";
// export default class User {
//     email: string;
//     displayName: string;
//     isVerified: boolean;
//     private password: string;
//     private token: string;
//     constructor(data: UserData) {
//         this.email = data.email;
//         this.password = data.password;
//         this.displayName = data.displayName;
//         this.token = data.verificationCode;
//         this.isVerified = false;
//     }

//     // async getUser(): Promise<UserData> {

//     //     return await getUserByEmailService(this.email);

//     // }

//     async create(): Promise<UserData> {
//         const encryptedPassword = await this.getEncryptedPassword();
//         return await createUserService({ email: this.email, password: encryptedPassword, displayName: this.displayName });
//     }

//     async verify(): Promise<UserData> {
//         return await verifyUserService({ token: this.token })
//     }

//     async signIn(): Promise<UserData> {
//         //const encryptedPassword = await this.getEncryptedPassword();
//         return await userAuthService({ email: this.email, password: this.password });
//     }

//     private async getEncryptedPassword(): Promise<string> {
//         return encryptPasswordAsync(this.password);
//     }

//     // async delete(): Promise<void> {
//     //     await deleteUserByEmailService({ email: this.email });
//     // }

// }

interface IUser {
    id?: number;
    email: string;
    password?: string;
    displayName?: string;
    verificationCode?: string;
    isVerified?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export default class User {
    id: number;
    email: string;
    displayName: string;
    isVerified: boolean;
    private password: string;
    private createdAt: Date;
    private updatedAt: Date;
    constructor(data: UserData) {
        this.id = data.id;
        this.email = data.email;
        this.password = data.password;
        this.displayName = data.displayName;
        this.isVerified = false;
    }

    async findUserByEmail(): Promise<boolean> {
        return !!await prisma.user.findUnique({ where: { email: this.email } });
    }

    async getUserById(): Promise<UserData> {
        return await prisma.user.findUnique({ where: { id: this.id } });
    }

    async getUserByEmail(): Promise<UserData> {
        return await prisma.user.findUnique({ where: { email: this.email } });
    }

    async create(): Promise<UserData> {
        return await prisma.user.create({
            data:
            {
                email: this.email,
                password: this.password,
                displayName: this.displayName
            }
        });
    }

    async setVerificationToken(token: string): Promise<UserData> {
        return await prisma.user.update({
            where: { id: this.id },
            data: { verificationToken: token }
        });
    }

    async verify(): Promise<UserData> {
        // return await verifyUserService({ token: this.token })
        return await prisma.user.update({
            where: { id: this.id },
            data: { isVerified: true }
        });
    }

    // async delete(): Promise<void> {
    //     await deleteUserByEmailService({ email: this.email });
    // }

}