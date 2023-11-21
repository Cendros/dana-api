import { and, eq, gt } from "drizzle-orm";
import { db } from "../db"
import { accessibilityStuctureTable, checkSocietyTable, eventTable, structureTable } from "../db/schema"

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
}
export const newAccessibility = async( accessibilityId: number,structureId:number)=>{
    await db.insert(accessibilityStuctureTable)
        .values({
            structureId: structureId,
            accessibilityId : accessibilityId
        })
}

export const getStructuresBySociety = async (societyId: number) => {
    let events = await db.select({ structure: structureTable })
        .from(checkSocietyTable)
        .leftJoin(eventTable, eq(eventTable.id, checkSocietyTable.eventId))
        .leftJoin(structureTable, eq(structureTable.id, eventTable.structureId))
        .where(
            and(
                eq(checkSocietyTable.societyId, societyId),
                gt(checkSocietyTable.quantity, 0)
            )
        )
    
    return events;
}
