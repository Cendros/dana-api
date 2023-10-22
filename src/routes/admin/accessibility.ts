import Elysia, { t } from "elysia";
import { newAccessibility } from "../../services/accessibility";
import { AccessibilityType } from "../../types/accessibility";
import jwt from "@elysiajs/jwt";
import bearer from "@elysiajs/bearer";
import { UserTypes } from "../../consts/userTypes";

export const accessibilityController = new Elysia({ prefix: '/accessibility' })
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

        await newAccessibility(body.name, body.icon, body.type as AccessibilityType)
        return { created: true }
    }, {
    body: t.Object(
        {
            name: t.String(),
            icon: t.String(),
            type: t.String()
        },
    ),
    detail: {
        summary: 'Create a new accessibility',
        tags: ['Admin']
    }
})