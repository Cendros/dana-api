import { and, eq, gt } from "drizzle-orm";
import { db } from "../db"
import { accessibilityStuctureTable, checkSocietyTable, eventTable, structureTable } from "../db/schema"

export const getStructures = async () => {
    const structures = await db.select().from(structureTable).all();
    return structures;
}

export const getStructureById = async (id: number) => {
    const structure = await db.query.structureTable.findFirst({
        where: eq(structureTable.id, id)
    })
    return structure;
}

export const newStructure = async (name: string, address: string, city: string, postalCode: string, latitude: string, longitude: string) => {
    await db.insert(structureTable)
        .values({
            name,
            address,
            city,
            postalCode,
            latitude,
            longitude
        })
}
export const newAccessibility = async(accessibilityId: number, structureId:number)=>{
    await db.insert(accessibilityStuctureTable)
        .values({
            structureId,
            accessibilityId
        })
}

export const getStructuresBySociety = async (societyId: number) => {
    let structures = await db.selectDistinct({ structure: structureTable })
        .from(checkSocietyTable)
        .leftJoin(eventTable, eq(eventTable.id, checkSocietyTable.eventId))
        .leftJoin(structureTable, eq(structureTable.id, eventTable.structureId))
        .where(
            and(
                eq(checkSocietyTable.societyId, societyId),
                gt(checkSocietyTable.quantity, 0)
            )
        )
    
    const res = structures.map(structure => structure.structure);
    
    return res;
}