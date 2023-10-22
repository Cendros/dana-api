import Elysia, { t } from "elysia";
import jwt from "@elysiajs/jwt";
import bearer from "@elysiajs/bearer";
import { UserTypes } from "../../consts/userTypes";
import { newSociety } from "../../services/society";
import { authController } from "./auth";
import { refill } from "../../services/user";


export const societyController = new Elysia({ prefix: '/society' })
    .use(jwt({
        name: 'jwt',
        secret: process.env.JWT_SECRET!
    }))
    .use(bearer())

    .use(authController)

    .post('/new', async ({ set, jwt, bearer, body }) => {
        const tokenData = await jwt.verify(bearer);

        if (!tokenData || tokenData.role !== UserTypes.Society.toString()) {
            set.status = 401;
            return 'Unauthorized';
        }
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

    .post('/refill', async ({ set, jwt, bearer, body }) => {
        const tokenData = await jwt.verify(bearer);

        if (!tokenData || tokenData.role !== UserTypes.Society.toString()) {
            set.status = 401;
            return 'Unauthorized';
        }

        const edited = await refill(Number(tokenData.societyId), body.balance);
        return { edited: edited };
    }, {
        body: t.Object(
            {
                balance: t.Integer(),
            },
        ),
        detail: {
            summary: 'Refill employees balance',
            tags: ['Society']
        }
    })