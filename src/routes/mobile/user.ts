import bearer from "@elysiajs/bearer";
import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { getBalance } from "../../services/user";
import { UserTypes } from "../../consts/userTypes";

export const userController = new Elysia({ prefix: '/user'})
    .use(jwt({
        name: 'jwt',
        secret: process.env.JWT_SECRET!
    }))
    .use(bearer())

    .get('/balance', async ({ set, jwt, bearer }) => {
        const tokenData = await jwt.verify(bearer);

        if (!tokenData || tokenData.role !== UserTypes.Employee.toString()) {
            set.status = 401;
            return 'Unauthorized';
        }

        const balance = await getBalance(Number.parseInt(tokenData.id));
        return { balance: balance };
    }, {
        detail: {
            summary: 'Get the balance of a user',
            tags: ['Mobile']
        }
    })