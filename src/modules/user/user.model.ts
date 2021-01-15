import prisma from "../../../prisma/prisma";
import { UserData, UserEditData, UserInstanceData } from "./user.types";
export default class User {
    id: number;
    email: string;
    displayName: string;
    isVerified: boolean;
    googleId: string;
    facebookId: string;
    private password: string;
    constructor(data: UserInstanceData) {
        this.id = data.id;
        this.email = data.email;
        this.password = data.password;
        this.displayName = data.displayName;
        this.isVerified = false;
        this.googleId = data.googleId;
        this.facebookId = data.facebookId;
    }

    async findByEmail(): Promise<boolean> {
        return !!await prisma.user.findUnique({ where: { email: this.email } });
    }

    async getById(): Promise<UserData> {
        return await prisma.user.findUnique({ where: { id: this.id } });
    }

    async getByEmail(): Promise<UserData> {
        return await prisma.user.findUnique({ where: { email: this.email } });
    }

    async getByGoogleId(): Promise<UserData> {
        return await prisma.user.findUnique({ where: { googleId: this.googleId } });
    }

    async getByFacebookId(): Promise<UserData> {
        return await prisma.user.findUnique({ where: { facebookId: this.facebookId } });
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

    async createSocial(): Promise<UserData> {
        return await prisma.user.create({
            data:
            {
                email: this.email,
                password: this.password,
                displayName: this.displayName,
                googleId: this.googleId,
                facebookId: this.facebookId,
                isVerified: true
            }
        });
    }

    async setGoogleId(): Promise<UserData> {
        return await prisma.user.update({
            where: {
                email: this.email
            },
            data: {
                googleId: this.googleId,
                isVerified: true
            }
        })
    }

    async setFacebookId(): Promise<UserData> {
        return await prisma.user.update({
            where: {
                email: this.email
            },
            data: {
                facebookId: this.facebookId,
                isVerified: true
            }
        })
    }

    async setVerificationToken(token: string): Promise<UserData> {
        return await prisma.user.update({
            where: { id: this.id },
            data: { verificationToken: token }
        });
    }

    async sePasswordResetToken(token: string): Promise<UserData> {
        return await prisma.user.update({
            where: { email: this.email },
            data: { passwordResetToken: token }
        });
    }

    async verify(): Promise<UserData> {
        // return await verifyUserService({ token: this.token })
        return await prisma.user.update({
            where: { id: this.id },
            data: { isVerified: true }
        });
    }

    async updateById(): Promise<UserData> {
        // let data: UserEditData;
        // if (this.displayName) data = { displayName: this.displayName };
        // if (this.password) data = { password: this.password };
        return await prisma.user.update({
            where: {
                id: this.id
            },
            data: {
                displayName: this.displayName || undefined,
                password: this.password || undefined
            }
        })
    }

    async deleteById(): Promise<UserData> {
        return await prisma.user.delete({
            where: {
                id: this.id
            }
        })
    }

}