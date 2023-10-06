import { and, desc, eq, gt, isNotNull, sql } from "drizzle-orm";
import { db } from "../db"
import { checkTable, structureTable } from "../db/schema"

export const getChecks = async () => {
    const checks = await db.select().from(checkTable).all();
    return checks;
}

export const getCheckFromUser = async (userId: number) => {
    const checks = await db
        .select({
            structureId: checkTable.structureId,
            structureName: structureTable.name,
            image: structureTable.image,
            quantity: checkTable.quantity,
            value: structureTable.checkValue
        })
        .from(checkTable)
        .where(and(eq(checkTable.userId, userId), isNotNull(structureTable.checkValue)))
        .leftJoin(structureTable, eq(checkTable. structureId, structureTable.id))
        .orderBy(desc(checkTable.quantity));
    return checks;
}

export const refillCheckToUser = async (userId: number, structureId: number, quantity: number) => {
    await db.insert(checkTable)
        .values({ userId: userId, structureId: structureId, quantity: quantity })
        .onConflictDoUpdate({
            target: [checkTable.userId, checkTable.structureId],
            set: {quantity: sql`${checkTable.quantity} + ${quantity}`}
        })
}

export const useCheck = async (userId: number, structureId: number) => {
    const updated = await db.update(checkTable)
        .set({ quantity: sql`${checkTable.quantity} - 1` })
        .where(and(gt(checkTable.quantity, 0), eq(checkTable.userId, userId), eq(checkTable.structureId, structureId)))
        .returning({ updated: checkTable.userId })
    return !!updated.length;
}

export const deleteCheckValue = async (structureId: number) => {
    //? Suppression des chèques et de la structure
    await db.delete(checkTable).where(eq(checkTable.structureId, structureId));
}