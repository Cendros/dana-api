import Elysia, { t } from "elysia";
import jwt from "@elysiajs/jwt";
import bearer from "@elysiajs/bearer";
import { UserTypes } from "../../consts/userTypes";
import { newSociety } from "../../services/society";


export const societyController = new Elysia({ prefix: '/app' })
    .use(jwt({
        name: 'jwt',
        secret: process.env.JWT_SECRET!
    }))
    .use(bearer())

    .onBeforeHandle(async ({ set, jwt, bearer }) => {
        const tokenData = await jwt.verify(bearer);
        
        if (!tokenData || tokenData.role !== UserTypes.Society.toString()) {
            set.status = 401;
            return 'Unauthorized';
        }
    })

    .post('/new', async ({ body }) => {
        await newSociety(body.name, body.address, body.city, body.postalCode);
        return { created: true }
    }, {
        body: t.Object(
            {
                name: t.String(),
                address: t.String(),
                city: t.String(),
                postalCode: t.String()
            },
        ),
        detail: {
            summary: 'Create a new society',
            tags: ['Society']
        }
    })