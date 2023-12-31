import Elysia from "elysia";
import jwt from "@elysiajs/jwt";
import bearer from "@elysiajs/bearer";
import { UserTypes } from "../../consts/userTypes";
import { getStructureById, getStructuresBySociety } from "../../services/structure";

export const structureController = new Elysia({ prefix: '/structure' })
    .use(jwt({
        name: 'jwt',
        secret: process.env.JWT_SECRET!
    }))
    .use(bearer())

    .get('/my', async ({ set, jwt, bearer }) => {
        const tokenData = await jwt.verify(bearer);

        if (!tokenData || tokenData.role !== UserTypes.Employee.toString()) {
            set.status = 401;
            return 'Unauthorized';
        }

        const structures = await getStructuresBySociety(Number.parseInt(tokenData.societyId));
        return { structures };
    }, {
        detail: {
            summary: 'get structures available for the user',
            tags: ['Mobile']
        }
    })

    .get('/:id', async ({ set, jwt, bearer, params: { id } }) => {
        const tokenData = await jwt.verify(bearer);

        if (!tokenData || tokenData.role !== UserTypes.Employee.toString()) {
            set.status = 401;
            return 'Unauthorized';
        }

        const structure = await getStructureById(Number.parseInt(id));
        return { structure };
    }, {
        detail: {
            summary: 'get structures available for the user',
            tags: ['Mobile']
        }
    })