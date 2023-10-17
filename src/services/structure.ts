import { eq } from "drizzle-orm";
import { db } from "../db"
import { checkTable, structureTable } from "../db/schema"

export const getStructures = async () => {
    const structures = await db.select().from(structureTable).all();
    return structures;
}

export const getStructureById = async (id: number) => {
    const society = await db.query.structureTable.findFirst({
        where: eq(structureTable.id, id)
    })
    return society;
}

export const newStructure = async (name: string, address: string, city: string, postalCode: string) => {
    await db.insert(structureTable)
        .values({
            name: name,
            address: address,
            city: city,
            postalCode: postalCode
        })
        .returning();
}

export const setCheckValue = async (structureId: number, value: number) => {
    const updated = await db.update(structureTable)
        .set({ checkValue: value })
        .where(eq(structureTable.id, structureId))
        .returning({ value: structureTable.id});

    //? Suppression des chèques devenus invalides
    if (!!updated.length)
        await db.delete(checkTable).where(eq(checkTable.structureId, structureId));
}

export const deleteStructure = async (id: number) => {
    const deleted = await db.delete(structureTable).where(eq(structureTable.id, id)).returning({ deletedId: structureTable.id });
    return !!deleted.length;
}