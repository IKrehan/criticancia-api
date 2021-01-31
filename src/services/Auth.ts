'use strict';
import { IUser } from '../models/User';
import User from "../models/User";

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config()

interface IResponse {
    success: boolean;
    status: number;
    message: string;
    token?: string;
    refreshToken?: string;
    data?: IUser;
}

interface IVerified {
    id: string;
    iat: number;
    exp: number;
}

interface IUserCredentials {
    email: string;
    password: string
}


class AuthServices {
    public async store(user: IUser): Promise<IResponse> {
        try {            
            if (!this.checkEmail(user.email)) {
                return { success: false, status: 401, message: "Email is invalid" }
            }

            if (await User.findOne({ where: { email: user.email } })) {
                return { success: false, status: 401, message: "Email is already registered" };
            }


            const userCreated = await User.create(user);

            return { success: true, status: 201, message: "User successfully created!", data: userCreated }; //return user as data
        }
        catch (err) {
            console.log(err)
            return { success: false, status: 404, message: "Unknown error" };
        }
    }

    public async signIn(userCredentials: IUserCredentials): Promise<IResponse> {
        try {
            if (!this.checkEmail(userCredentials.email)) {
                return { success: false, status: 401, message: "Email is invalid" }
            }

            const user = await User.findOne({ where: { email: userCredentials.email } });
            if (user == null) {
                return { success: false, status: 404, message: 'Email not found' };
            }

            if (await bcrypt.compare(userCredentials.password, user.password)) {
                const token = await this.generateToken(user.id)

                const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET)
                await user.update({ api_token: refreshToken });

                return { success: true, status: 200, message: 'User logged', data: user, token: token, refreshToken: refreshToken };
            } else {
                return { success: false, status: 401, message: 'Incorrect Password' };
            }
        }
        catch (err) {
            console.log(err)
            return { success: false, status: 404, message: 'Unknown error' };
        }
    }

    public async signOut(refreshToken: string): Promise<IResponse> {
        try {
            const currentUser = await User.findOne({ where: { api_token: refreshToken } })
            currentUser.update({ api_token: null })
            return { success: true, status: 200, message: 'User logged out' };
        }
        catch (err) {
            console.log(err)
            return { success: false, status: 404, message: 'Unknown error' };
        }
    }

    public async refreshToken(refreshToken: string): Promise<IResponse> {
        if (!refreshToken) {
            return { success: false, status: 401, message: 'No token provided' };
        }

        try {
            let isTokenValid = await User.findOne({ where: { api_token: refreshToken } })

            if (!isTokenValid) {
                return { success: false, status: 403, message: 'Invalid token' };
            }

            const refreshTokenVerified = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

            if (refreshTokenVerified) {
                const accessToken = await this.generateToken((refreshTokenVerified as IVerified).id)
                return { success: true, status: 200, message: 'Token refreshed', token: accessToken };
            }

        } catch (err) {
            console.log(err)
            return { success: false, status: 400, message: "Unknown error" };
        }
    }

    async generateToken(userId) {
        return jwt.sign({ id: userId }, process.env.TOKEN_SECRET, { expiresIn: '30m' });
    }

    async checkEmail(email: string): Promise<boolean> {
        const re = /\S+@\S+\.\S+/;
        const emailIsValid = re.test(email);
        if (!emailIsValid) {
            return false;
        } else {
            return true;
        }
    }
}

export default new AuthServices();