import { eq } from "drizzle-orm";
import { db } from "../db"
import { societyTable } from "../db/schema"

export const getSocieties = async () => {
    const societies = await db.select().from(societyTable).all();
    return societies;
}

export const getSocietyById = async (id: number) => {
    const society = await db.query.societyTable.findFirst({
        where: eq(societyTable.id, id)
    })
    return society;
}

export const newSociety = async (name: string) => {
    await db.insert(societyTable).values({
        name: name
    });
}

export const deleteSociety = async (id: number) => {
    const deleted = await db.delete(societyTable).where(eq(societyTable.id, id)).returning({ deletedId: societyTable.id });
    return !!deleted.length;
}