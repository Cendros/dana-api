import Elysia, { t } from "elysia";
import { deleteUser, generateNewCode128, getCode128, getUserById, getUsers, registerUser } from "../services/user";
import { getSocietyById } from "../services/society";
import { userTypes, UserTypes } from "../types/user";
import jwt from "@elysiajs/jwt";
import bearer from "@elysiajs/bearer";

export const userController = new Elysia({ prefix: '/user',  }) 
    .use(jwt({
        name: 'jwt',
        secret: process.env.JWT_SECRET!
    }))
    .use(bearer())

    .get('/', async () => {
        const users = await getUsers();
        return { users: users };
    }, { detail: {
        summary: 'get all users',
        tags: ['User']
    }})

    .get('/:id', async ({ params: {id} }) => {
        const user = await getUserById(Number.parseInt(id));
        return { user: user };
    }, { detail: {
        summary: 'get a user by id',
        tags: ['User']
    }})

    .post('/register', async ({ set, body: {email, password, societyId, type} }) => {
        if (!userTypes.find((valid) => valid === type)) {
            set.status = 400;
            return 'Bas request';
        }
        const society = await getSocietyById(societyId);
        
        if (!society)
            throw new Error("Society not found");
        
        const hash = await Bun.password.hash(password);
        
        await registerUser(email, hash, societyId, (type as UserTypes));

        return { registered: true }
    }, {
        body: t.Object(
            {
                email: t.String(),
                password: t.String(),
                societyId: t.Integer(),
                type: t.String()
            },
        ),
        detail: {
            summary: 'Register a new user',
            tags: ['User']
        }
    })

    .delete('/:id', async ({ params: {id} }) => {
        const deleted = await deleteUser(Number.parseInt(id));
        return { deleted: deleted };
    }, { 
        detail: {
            summary: 'delete user by id',
            tags: ['User']
        }
    })

    .get('/code128', async ({ set, jwt, bearer }) => {
        const tokenData = await jwt.verify(bearer);
        
        if (!tokenData) {
            set.status = 401;
            return 'Unauthorized';
        }

        let code = await getCode128(Number.parseInt(tokenData.id));
        if (code)
            return { code: code };

        code = await generateNewCode128(Number.parseInt(tokenData.id));
        if (!code) {
            set.status = 500;
            return 'Internal server error';
        }

        return { code: code };
    }, {
        detail: {
            summary: 'Get the code 128',
            tags: ['User']
        }
    })