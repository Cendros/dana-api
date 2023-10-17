import Elysia, { t } from "elysia";
import jwt from "@elysiajs/jwt";
import { registerUser, verifyCredentials } from "../services/auth";
import { getSocietyById } from "../services/society";
import { getStructureById } from "../services/structure";

export const authController = new Elysia({ prefix: '/auth' })
    .use(jwt({
        name: 'jwt',
        secret: process.env.JWT_SECRET!
    }))
    
    // .post('/login', async ({ jwt, body }) => {
    //     const user = await verifyCredentials(body.email, body.password);
    //     if (!user)
    //         return { invalid: true };
    //     const token = await jwt.sign(user);
    //     return { token: token };
    // }, {
    //     body: t.Object({
    //         email: t.String(),
    //         password: t.String(),
    //     }),
    //     detail: {
    //         summary: "Log a user and send JWT",
    //         tags: ['Auth']
    //     }
    // })

    // .post('/register', async ({ set, body: {email, password, type, societyId = undefined, structureId = undefined} }) => {
    //     // if (!userTypes.find((valid) => valid === type)) {
    //     //     set.status = 400;
    //     //     return 'Bas request';
    //     // }
    //     // const society = societyId ? await getSocietyById(societyId) : undefined;
        
    //     // if (type === userTypes[2] && !society)
    //     //     throw new Error("Society not found");

    //     // const structure = structureId ? await getStructureById(structureId) : undefined;
        
    //     // if (type === userTypes[1] && !structure)
    //     //     throw new Error("Structure not found");
        
    //     // const hash = await Bun.password.hash(password);
        
    //     // await registerUser(email, hash, (type as UserTypes), society?.id, structure?.id);

    //     // return { registered: true }
    // }, {
    //     body: t.Object(
    //         {
    //             email: t.String(),
    //             password: t.String(),
    //             type: t.String(),
    //             societyId: t.Optional(t.Integer()),
    //             structureId: t.Optional(t.Integer())
    //         },
    //     ),
    //     detail: {
    //         summary: 'Register a new user',
    //         tags: ['Auth']
    //     }
    // })