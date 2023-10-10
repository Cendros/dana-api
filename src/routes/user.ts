import Elysia, { t } from "elysia";
import { deleteUser, getUserById, getUsers, registerUser } from "../services/user";
import { getSocietyById } from "../services/society";
import { userTypes, UserTypes } from "../types/user";

export const userController = new Elysia({ prefix: '/user',  }) 
    .get('/', async () => {
        const users = await getUsers();
        return { users: users };
    }, { detail: {
        summary: 'get all users',
        tags: ['User']
    }})

    .get('/:id', async ({ params: {id} }) => {
        const user = await getUserById(Number.parseInt(id));
        return { user: user };
    }, { detail: {
        summary: 'get a user by id',
        tags: ['User']
    }})

    .post('/register', async ({ set, body: {email, password, societyId, type} }) => {
        if (!userTypes.find((valid) => valid === type)) {
            set.status = 400;
            return 'Bas request';
        }
        const society = await getSocietyById(societyId);
        
        if (!society)
            throw new Error("Society not found");
        
        const hash = await Bun.password.hash(password);
        
        await registerUser(email, hash, societyId, (type as UserTypes));

        return { registered: true }
    }, {
        body: t.Object(
            {
                email: t.String(),
                password: t.String(),
                societyId: t.Integer(),
                type: t.String()
            },
        ),
        detail: {
            summary: 'Register a new user',
            tags: ['User']
        }
    })

    .delete('/:id', async ({ params: {id} }) => {
        const deleted = await deleteUser(Number.parseInt(id));
        return { deleted: deleted };
    }, { detail: {
        summary: 'delete user by id',
        tags: ['User']
    }})