import { eq } from "drizzle-orm";
import { db } from "../db"
import { structure as structureTable } from "../db/schema"

export const getStructures = async () => {
    const structures = await db.select().from(structureTable).all();
    return structures;
}

export const newStructure = async (name: string, address: string, city: string, postalCode: string) => {
    await db.insert(structureTable).values({
        name: name,
        address: address,
        city: city,
        postalCode: postalCode
    });
}

export const deleteStructure = async (id: number) => {
    const deleted = await db.delete(structureTable).where(eq(structureTable.id, id)).returning({ deletedId: structureTable.id });
    return !!deleted.length;
}