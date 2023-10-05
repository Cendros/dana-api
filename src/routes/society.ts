import Elysia, { t } from "elysia";
import { deleteSociety, getSocieties, getSocietyById, newSociety } from "../services/society";

export const societyController = new Elysia({ prefix: '/society',  }) 
    .get('/', async () => {
        const societies = await getSocieties();
        return {societies: societies};
    }, { detail: {
        summary: 'get all societies',
        tags: ['Society']
    }})

    .get('/:id', async ({ params: {id} }) => {
        const society = await getSocietyById(Number.parseInt(id));
        return { society: society };
    }, { detail: {
        summary: 'get a society by id',
        tags: ['Society']
    }})

    .post('/new', async ({ body }) => {

        await newSociety(body.name);

        return { created: true }
    }, {
        body: t.Object(
            {
                name: t.String()
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