import Elysia, { t } from "elysia";
import jwt from "@elysiajs/jwt";
import bearer from "@elysiajs/bearer";
import { UserTypes } from "../../consts/userTypes";
import { assignToSociety, newEvent } from "../../services/event";
import { NewEvent } from "../../db/schema";

export const eventController = new Elysia({ prefix: '/event' })
    .use(jwt({
        name: 'jwt',
        secret: process.env.JWT_SECRET!
    }))
    .use(bearer())

    .post("/new", async({ set, jwt, bearer, body }) => {
        const tokenData = await jwt.verify(bearer);

        if (!tokenData || tokenData.role !== UserTypes.Admin.toString()) {
            set.status = 401;
            return 'Unauthorized';
        }

        const created = await newEvent({
            ...body,
            date: new Date(body.date),
            dateExpiration: body.dateExpiration ? new Date(body.dateExpiration) : null
        } as NewEvent);

        return { created: created }
    }, {
        body: t.Object(
            {
                structureId: t.Integer(),
                name: t.String(),
                value: t.Integer(),
                date: t.String({ format: "date-time" }),
                dateExpiration: t.Optional(t.String({format: "date-time" })),
                image: t.String(),
                description: t.String(),
                quantity: t.Integer()
            },
        ),
        detail: {
            summary: 'Create a new event',
            tags: ['Admin']
        }
    })

    .post("/assign", async({ set, jwt, bearer, body }) => {
        const tokenData = await jwt.verify(bearer);

        if (!tokenData || tokenData.role !== UserTypes.Admin.toString()) {
            set.status = 401;
            return 'Unauthorized';
        }

        const { assigned, error } = await assignToSociety(body.eventId, body.societyId, body.quantity);

        if (error) {
            set.status = 400;
            return error;
        }

        return { assigned: assigned }
    }, {
        body: t.Object(
            {
                eventId: t.Integer(),
                societyId: t.Integer(),
                quantity: t.Integer(),
            },
        ),
        detail: {
            summary: 'Assign checks to a society',
            tags: ['Admin']
        }
    })