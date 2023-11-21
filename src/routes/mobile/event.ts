import Elysia from "elysia";
import jwt from "@elysiajs/jwt";
import bearer from "@elysiajs/bearer";
import { UserTypes } from "../../consts/userTypes";
import { getEventsBySociety } from "../../services/event";

export const eventController = new Elysia({ prefix: '/event' })
    .use(jwt({
        name: 'jwt',
        secret: process.env.JWT_SECRET!
    }))
    .use(bearer())

    .get('/next', async ({ set, jwt, bearer }) => {
        const tokenData = await jwt.verify(bearer);

        if (!tokenData || tokenData.role !== UserTypes.Employee.toString()) {
            set.status = 401;
            return 'Unauthorized';
        }

        const events = await getEventsBySociety(Number.parseInt(tokenData.societyId));
        return { events: [...events, ...events, ...events, ...events] };
    }, {
        detail: {
            summary: 'get events available for the user',
            tags: ['Mobile']
        }
    })