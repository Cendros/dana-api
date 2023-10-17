import Elysia, { t } from "elysia";
import { deleteSociety, getSocieties, getSocietyById, newSociety } from "../services/society";

export const societyController = new Elysia({ prefix: '/society',  }) 
    .get('/', async () => {
        const societies = await getSocieties();
        return {societies: societies};
    }, { detail: {
        summary: 'Get all societies',
        tags: ['DEV']
    }})

    .post('/new', async ({ body }) => {
        await newSociety(body.name,body.address,body.city,body.postalCode);
        return { created: true }
    }, {
        body: t.Object(
            {
                name: t.String(),
                address: t.String(),
                city: t.String(),
                postalCode: t.String()
            },
        ),
        detail: {
            summary: 'Create a new society',
            tags: ['Society']
        }
    })

    .delete('/:id', async ({ params: {id} }) => {
        const deleted = await deleteSociety(Number.parseInt(id));
        return { deleted: deleted };
    }, { detail: {
        summary: 'delete society by id',
        tags: ['Society']
    }})