import Elysia, { t } from "elysia";
import { getCheckFromUser, getChecks, refillCheckToUser, useCheck } from "../services/check";
import jwt from "@elysiajs/jwt";
import { getSocietyIdById } from "../services/user";
import bearer from "@elysiajs/bearer";

export const checkController = new Elysia({ prefix: '/check' })
    .use(jwt({
        name: 'jwt',
        secret: process.env.JWT_SECRET!
    }))
    .use(bearer())

    .get('/', async () => {
        const checks = await getChecks();
        return { checks: checks };
    }, { detail: {
        summary: "Get all checks",
        tags: ['DEV']
    }})

    .get('/self', async ({ set, jwt, bearer }) => {   
        const tokenData = await jwt.verify(bearer);
        if (!tokenData) {
            set.status = 401;
            return 'Unauthorized';
        }

        const checks = await getCheckFromUser(Number.parseInt(tokenData.id));
        return { checks: checks };
    }, {
        detail: {
            summary: 'get checks of user',
            tags: ['Check']
        }
    })

    .post('/refill', async ({ set, jwt, bearer, body: {userId, structureId, quantity} }) => {
        const tokenData = await jwt.verify(bearer);
        console.log(tokenData);
        
        if (!tokenData || tokenData.type !== 'society') {
            set.status = 401;
            return 'Unauthorized';
        }

        const societyId = await getSocietyIdById(userId);
        if (Number.parseInt(tokenData.societyId) !== societyId) {
            set.status = 401;
            return 'Unauthorized';
        }

        await refillCheckToUser(userId, structureId, quantity);
        return { refilled: true };
    }, {
        body: t.Object(
            {
                userId: t.Integer(),
                structureId: t.Integer(),
                quantity: t.Integer(),
            },
        ),
        detail: {
            summary: "Refill checks for a user",
            tags: ['Check']
        }
    })

    .put('/use', async ({ set, jwt, bearer, body: { userId, structureId } }) => {
        const tokenData = await jwt.verify(bearer);
        
        if (!tokenData || tokenData.type !== 'machine' && tokenData.type !== 'structure') {
            set.status = 401;
            return 'Unauthorized';
        }

        const used = await useCheck(userId, structureId);
        return { used: used };
    }, {
        body: t.Object(
            {
                userId: t.Integer(),
                structureId: t.Integer(),
            },
        ),
        detail: {
            summary: "Use a check for a user",
            tags: ['Check']
        }
    })