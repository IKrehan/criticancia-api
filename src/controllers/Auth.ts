import { request, Request, Response } from 'express';

// import services
import Auth from "../services/Auth";


class AuthController {
    public async signUp(req: Request, res: Response) {
        const userResponse = await Auth.store(req.body);

        return res.status(userResponse.status).send(userResponse);
    }

    public async signIn(req: Request, res: Response) {
        if (!req.body.email || !req.body.password) {
            return res.status(400).send({ error: true, status: 400, message: "Email and password are necessary for signIn" })
        }
        
        const signInResponse = await Auth.signIn(req.body);

        return res.status(signInResponse.status)
            .send(signInResponse);
    }

    public async signOut(req: Request, res: Response) {
        const header = req.header('refreshToken');
        const refreshToken = header.split(' ')[1];
        
        const signOutResponse = await Auth.signOut(refreshToken);

        return res.status(signOutResponse.status).send(signOutResponse);
    }

    public async refreshToken(req: Request, res: Response) {
        const header = req.header('refresh-token');
        const refreshToken = header.split(' ')[1];

        const refreshTokenResponse = await Auth.refreshToken(refreshToken);

        return res.status(refreshTokenResponse.status).send(refreshTokenResponse);
    }
};


export default new AuthController();
