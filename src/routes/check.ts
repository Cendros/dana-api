import Elysia from "elysia";
import { getChecks } from "../services/check";

export const checkController = new Elysia({ prefix: '/check' })
    .get('/', async () => {
        const checks = await getChecks();
        return {checks: checks};
    }, { detail: {
        summary: "Get all checks",
        tags: ['Check']
    }})