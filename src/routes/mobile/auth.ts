import Elysia, { t } from "elysia";
import jwt from "@elysiajs/jwt";
import { getSocietyById } from "../../services/society";
import { logEmployee, registerEmployee } from "../../services/auth";

export const authController = new Elysia()
    .use(jwt({
        name: 'jwt',
        secret: process.env.JWT_SECRET!
    }))
    
    .post('/login', async ({ jwt, body }) => {
        const user = await logEmployee(body.email, body.password);
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
            summary: "Log an employee and send JWT",
            tags: ['Mobile']
        }
    })

    .post('/register', async ({ set, body: {email, password, societyId} }) => {
        const society = societyId ? await getSocietyById(societyId) : undefined;
        
        if (!society) {
            set.status = 400
            throw new Error("Society not found");
        }
        
        const hash = await Bun.password.hash(password);
        
        await registerEmployee(email, hash, society.id);

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
            summary: 'Register a new employee',
            tags: ['Mobile']
        }
    })