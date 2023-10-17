import { eq } from "drizzle-orm";
import { db } from "../db"
import { structureTable } from "../db/schema"

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