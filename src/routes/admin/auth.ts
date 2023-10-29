import Elysia, { t } from "elysia";
import jwt from "@elysiajs/jwt";
import { logAdmin, registerAdmin } from "../../services/auth";

export const authController = new Elysia()
    .use(jwt({
        name: 'jwt',
        secret: process.env.JWT_SECRET!
    }))
    
    .post('/login', async ({ jwt, body }) => {
        const user = await logAdmin(body.email, body.password);
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
            summary: "Log an admin and send JWT",
            tags: ['Admin']
        }
    })

    .post('/register', async ({ set, body: {email, password} }) => {
        const hash = await Bun.password.hash(password);
        
        await registerAdmin(email, hash);

        return { registered: true }
    }, {
        body: t.Object(
            {
                email: t.String(),
                password: t.String(),
            },
        ),
        detail: {
            summary: 'Register a new admin user',
            tags: ['Admin']
        }
    })