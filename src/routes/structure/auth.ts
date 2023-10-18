import Elysia, { t } from "elysia";
import jwt from "@elysiajs/jwt";
import { logStructure, registerStructure } from "../../services/auth";
import { getStructureById } from "../../services/structure";

export const authController = new Elysia()
    .use(jwt({
        name: 'jwt',
        secret: process.env.JWT_SECRET!
    }))
    
    .post('/login', async ({ jwt, body }) => {
        const user = await logStructure(body.email, body.password);
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
            summary: "Log a structure user and send JWT",
            tags: ['Structure']
        }
    })

    .post('/register', async ({ set, body: {email, password, structureId} }) => {
        const structure = structureId ? await getStructureById(structureId) : undefined;
        
        if (!structure) {
            set.status = 400
            throw new Error("Structure not found");
        }
        
        const hash = await Bun.password.hash(password);
        
        await registerStructure(email, hash, structure.id);

        return { registered: true }
    }, {
        body: t.Object(
            {
                email: t.String(),
                password: t.String(),
                structureId: t.Integer(),
            },
        ),
        detail: {
            summary: 'Register a new society user',
            tags: ['Structure']
        }
    })