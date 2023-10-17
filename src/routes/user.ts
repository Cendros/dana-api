import Elysia from "elysia";
import { deleteUser, generateNewCode128, getCode128, getUserById, getUsers } from "../services/user";
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