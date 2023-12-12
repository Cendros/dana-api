import Elysia, { t } from "elysia";
import jwt from "@elysiajs/jwt";
import bearer from "@elysiajs/bearer";
import { UserTypes } from "../../consts/userTypes";
import { bookEvent, getEventsBySociety, getEventsByUser } from "../../services/event";

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

        const events = await getEventsBySociety(Number.parseInt(tokenData.id), Number.parseInt(tokenData.societyId));
        return { events };
    }, {
        detail: {
            summary: 'get events available for the user',
            tags: ['Mobile']
        }
    })

    .post('/book', async ({ set, jwt, bearer, body: {eventId}}) => {
        const tokenData = await jwt.verify(bearer);

        if (!tokenData || tokenData.role !== UserTypes.Employee.toString()) {
            set.status = 401;
            return 'Unauthorized';
        }

        const res = await bookEvent(Number.parseInt(tokenData.id), eventId);

        return res;
    }, {
        body: t.Object({
            eventId: t.Number(),
        }),
        detail: {
            summary: 'book an event',
            tags: ['Mobile']
        }
    })

    .get('/my', async ({ set, jwt, bearer }) => {
        const tokenData = await jwt.verify(bearer);

        if (!tokenData || tokenData.role !== UserTypes.Employee.toString()) {
            set.status = 401;
            return 'Unauthorized';
        }

        const events = await getEventsByUser(Number.parseInt(tokenData.id));

        return events;
    }, {
        detail: {
            summary: 'get events available for the user',
            tags: ['Mobile']
        }
    })