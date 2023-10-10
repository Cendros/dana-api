import Elysia, { t } from "elysia";
import { deleteStructure, getStructures, newStructure, setCheckValue } from "../services/structure";
import { deleteCheckValue } from "../services/check";

export const structureController = new Elysia({ prefix: '/structure',  }) 
    .get('/', async () => {
        const structures = await getStructures();
        return {structures: structures};
    }, { 
        detail: {
            summary: 'get all structures',
            tags: ['Structure']
        }
    })

    .post('/new', async ({ body }) => {
        await newStructure(body.name, body.address, body.city, body.postalCode);
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
            summary: 'Create a new structure',
            tags: ['Structure']
        }
    })

    .put('/value', async ({ body }) => {
        await setCheckValue(body.structureId, body.value);
        return { modified: true };
    }, {
        body: t.Object(
            {
                structureId: t.Integer(),
                value: t.Integer(),
            },
        ),
        detail: {
            summary: "Change the value for the checks of a structure",
            tags: ['Structure']
        }
    })

    .delete('/:id', async ({ params: { id } }) => {
        await deleteCheckValue(Number.parseInt(id))
        const deleted = await deleteStructure(Number.parseInt(id));
        return { deleted: deleted };
    }, {
        detail: {
            summary: 'delete structure by id',
            tags: ['Structure']
        }
    })