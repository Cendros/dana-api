import { and, desc, eq, gt, isNotNull, sql } from "drizzle-orm";
import { db } from "../db"
import { structureTable, employeeUserTable, checkSocietyTable } from "../db/schema"

export const getCheckFromUser = async (userId: number) => {
    // const checks = await db
    //     .select({
    //         structureId: checkTable.structureId,
    //         structureName: structureTable.name,
    //         image: structureTable.image,
    //         quantity: checkTable.quantity,
    //         value: structureTable.checkValue
    //     })
    //     .from(checkTable)
    //     .where(and(eq(checkTable.userId, userId), isNotNull(structureTable.checkValue)))
    //     .leftJoin(structureTable, eq(checkTable. structureId, structureTable.id))
    //     .orderBy(desc(checkTable.quantity));
    // return checks;
}

export const refillCheckToUser = async (userId: number, structureId: number, quantity: number) => {
    // await db.insert(checkTable)
    //     .values({ userId: userId, structureId: structureId, quantity: quantity })
    //     .onConflictDoUpdate({
    //         target: [checkTable.userId, checkTable.structureId],
    //         set: {quantity: sql`${checkTable.quantity} + ${quantity}`}
    //     })
}

export const useCheck = async (code: string, structureId: number) => {
    // const user = await db.query.employeeUserTable.findFirst({
    //     where: eq(employeeUserTable.code128, code)
    // });

    // if (!user)
    //     return false;

    // const updated = await db.update(checkTable)
    //     .set({ quantity: sql`${checkTable.quantity} - 1` })
    //     .where(and(gt(checkTable.quantity, 0), eq(checkTable.userId, user.id), eq(checkTable.structureId, structureId)))
    //     .returning({ updated: checkTable.userId })
    // return !!updated.length;
}