import Elysia, { t } from "elysia";
import jwt from "@elysiajs/jwt";
import { getSocietyById } from "../services/society";
import { logEmployee, logSociety, logStructure, registerEmployee, registerSociety, registerStructure } from "../services/auth";
import { getStructureById } from "../services/structure";

export const authController = new Elysia({ prefix: '/auth' })
    .use(jwt({
        name: 'jwt',
        secret: process.env.JWT_SECRET!
    }))
    
    .post('/login/app', async ({ jwt, body }) => {
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
            tags: ['Auth']
        }
    })
    
    .post('/login/society', async ({ jwt, body }) => {
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
            tags: ['Auth']
        }
    })
    
    .post('/login/structure', async ({ jwt, body }) => {
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
            tags: ['Auth']
        }
    })

    .post('/register/employee', async ({ set, body: {email, password, societyId} }) => {
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
            tags: ['Auth']
        }
    })

    .post('/register/society', async ({ set, body: {email, password, societyId} }) => {
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
            tags: ['Auth']
        }
    })

    .post('/register/structure', async ({ set, body: {email, password, structureId} }) => {
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
            tags: ['Auth']
        }
    })