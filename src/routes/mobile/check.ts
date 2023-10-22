import Elysia from "elysia";
import { getCheckFromUser } from "../../services/check";
import jwt from "@elysiajs/jwt";
import bearer from "@elysiajs/bearer";
import { UserTypes } from "../../consts/userTypes";

export const checkController = new Elysia({ prefix: '/check' })
    .use(jwt({
        name: 'jwt',
        secret: process.env.JWT_SECRET!
    }))
    .use(bearer())

    .get('/checks', async ({ set, jwt, bearer }) => {
        const tokenData = await jwt.verify(bearer);

        if (!tokenData || tokenData.role !== UserTypes.Employee.toString()) {
            set.status = 401;
            return 'Unauthorized';
        }

        const checks = await getCheckFromUser(Number.parseInt(tokenData.id));
        return { checks: checks };
    }, {
        detail: {
            summary: 'get checks of user',
            tags: ['Mobile']
        }
    })