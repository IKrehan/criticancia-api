import { Request, Response } from 'express';
import jwt from "jsonwebtoken";


interface TokenPayload {
    id: string;
    iat: number;
    exp: number;
}

export default (req: Request, res: Response, next) => {
    const header = req.header('auth');
    const token = header.split(' ')[1];

    if (!token) {
        res.status(401).send({ message: "No token provided" })
    }

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        const { id } = verified as TokenPayload;
        req.currentUserId = id;

        return next();
    } catch (err) {
        res.status(400).send({ message: "Invalid Token" })
    }
}