import Elysia, { t } from "elysia";
import { getChecks, refillCheckToUser, useCheck } from "../services/check";

export const checkController = new Elysia({ prefix: '/check' })
    .get('/', async () => {
        const checks = await getChecks();
        return { checks: checks };
    }, { detail: {
        summary: "Get all checks",
        tags: ['Check']
    }})

    .post('/refill', async ({ body }) => {
        await refillCheckToUser(body.userId, body.structureId, body.quantity);
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

    .put('/use', async ({ body }) => {
        const used = await useCheck(body.userId, body.structureId);
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