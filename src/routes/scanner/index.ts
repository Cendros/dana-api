import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { getUserById } from "../../services/user";

export const scannerController = new Elysia({ prefix: '/scanner' })
    .use(jwt({
            name: 'jwt',
            secret: process.env.JWT_SECRET!
    }))

    .get('/', async ({ set, jwt, query: { code } }) => {
        const tokenData = await jwt.verify(code!);

        if (!tokenData) {
            set.status = 401;
            return 'Unauthorized';
        }

        const user = await getUserById(Number(tokenData.id));

        if (!user)  {
            set.status = 400;
            return 'Unauthorized';
        }

        return {scanned: true};
    })