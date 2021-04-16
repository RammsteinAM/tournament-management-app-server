import prisma from "../../../prisma/prisma";
import { UserData, UserEditData, UserInstanceData } from "./auth.types";

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

    async getById(): Promise<UserData> {
        return await prisma.user.findUnique({ where: { id: this.id } });
    }

    async getByEmail(): Promise<UserData> {
        return await prisma.user.findFirst({ where: { email: {equals: this.email, mode: 'insensitive'}},  });
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
        return await prisma.user.update({
            where: { id: this.id },
            data: {
                isVerified: true,
                verificationToken: ''
            }
        });
    }

    async updateById(): Promise<UserData> {
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