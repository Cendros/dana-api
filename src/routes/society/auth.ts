import Elysia, { t } from "elysia";
import jwt from "@elysiajs/jwt";
import { getSocietyById } from "../../services/society";
import { logSociety, registerSociety } from "../../services/auth";

export const authController = new Elysia()
    .use(jwt({
        name: 'jwt',
        secret: process.env.JWT_SECRET!
    }))
    
    .post('/login', async ({ jwt, body }) => {
        const user = await logSociety(body.email, body.password);
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
            summary: "Log a society owner and send JWT",
            tags: ['Society']
        }
    })

    .post('/register', async ({ set, body: {email, password, societyId} }) => {
        const society = societyId ? await getSocietyById(societyId) : undefined;
        
        if (!society) {
            set.status = 400
            throw new Error("Society not found");
        }
        
        const hash = await Bun.password.hash(password);
        
        await registerSociety(email, hash, society.id);

        return { registered: true }
    }, {
        body: t.Object(
            {
                email: t.String(),
                password: t.String(),
                societyId: t.Integer(),
            },
        ),
        detail: {
            summary: 'Register a new society user',
            tags: ['Society']
        }
    })