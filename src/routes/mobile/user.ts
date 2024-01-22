import bearer from "@elysiajs/bearer";
import jwt from "@elysiajs/jwt";
import Elysia, { t } from "elysia";
import { getBalance, getProfile, getUserById, modifyInfos } from "../../services/user";
import { UserTypes } from "../../consts/userTypes";
import { isPasswordCorrect } from "../../services/auth";

export const userController = new Elysia({ prefix: '/user'})
    .use(jwt({
        name: 'jwt',
        secret: process.env.JWT_SECRET!
    }))
    .use(bearer())

    .get('/balance', async ({ set, jwt, bearer }) => {
        const tokenData = await jwt.verify(bearer);

        if (!tokenData || tokenData.role !== UserTypes.Employee.toString()) {
            set.status = 401;
            return 'Unauthorized';
        }

        const balance = await getBalance(Number.parseInt(tokenData.id));
        return { balance };
    }, {
        detail: {
            summary: 'Get the balance of a user',
            tags: ['Mobile']
        }
    })

    .get('/profile', async ({ set, jwt, bearer }) => {
        const tokenData = await jwt.verify(bearer);

        if (!tokenData || tokenData.role !== UserTypes.Employee.toString()) {
            set.status = 401;
            return 'Unauthorized';
        }

        const profile = await getProfile(Number(tokenData.id));
        return { profile };
    }, {
        detail: {
            summary: 'Get infos of a user',
            tags: ['Mobile']
        }
    })

    .post('/update', async ({ set, jwt, bearer, body }) => {
        const tokenData = await jwt.verify(bearer);

        if (!tokenData || tokenData.role !== UserTypes.Employee.toString()) {
            set.status = 401;
            return 'Unauthorized';
        }

        const { firstname, lastname, oldPassword, password } = body;

        if (oldPassword != undefined && password != undefined) {
            if (password.length < 8)
                return { error: "Votre mot de passe doit contenir au moins 8 caractères." };
            const valid = await isPasswordCorrect(oldPassword, Number(tokenData.id));
            if (!valid)
                return { error: "Votre mot de passe est incorrect." }
        }

        const hash = password ? await Bun.password.hash(password) : undefined;
        const edited = await modifyInfos(Number(tokenData.id), firstname, lastname, hash);
        return { edited };
    }, {
        body: t.Object({
            firstname: t.Optional(t.String()),
            lastname: t.Optional(t.String()),
            oldPassword: t.Optional(t.String()),
            password: t.Optional(t.String()),
        }),
        detail: {
            summary: 'Modify firstname, lastname and password',
            tags: ['Mobile']
        }
    })