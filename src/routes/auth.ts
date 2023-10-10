import Elysia, { t } from "elysia";
import jwt from "@elysiajs/jwt";
import { verifyCredentials } from "../services/auth";

export const authController = new Elysia({ prefix: '/auth' })
    .use(jwt({
        name: 'jwt',
        secret: process.env.JWT_SECRET!
    }))
    
    .post('/login', async ({ jwt, body }) => {
        const user = await verifyCredentials(body.email, body.password);
        if (!user)
            return { invalid: true };
        const token = await jwt.sign(user);
        return { token: token };
    }, {
        body: t.Object({
            email: t.String(),
            password: t.String(),
        }),
        detail: {
            summary: "Log a user and send JWT",
            tags: ['Auth']
        }
    })