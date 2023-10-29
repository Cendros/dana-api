import { eq } from "drizzle-orm";
import { db } from "../db"
import { NewEvent, checkSocietyTable, eventTable, societyTable } from "../db/schema"

export const newEvent = async (event: NewEvent) => {
    const created = await db.insert(eventTable).values(event);
    return !!created.rowsAffected;
}

export const assignToSociety = async (eventId: number, societyId: number, quantity: number) => {
    const event = await db.query.eventTable.findFirst({
        where: eq(eventTable.id, eventId)
    });
    if (!event)
        return { error: "This event doesn't exist."};

    const ticketsRemaining = (event.quantity || 0) - quantity;

    if (ticketsRemaining < 0)
        return { error: "There is not enough tickets available for this event."};

    const society = await db.query.societyTable.findFirst({
        where: eq(societyTable.id, societyId)
    });
    if (!society)
        return { error: "This society doesn't exist."};

    const assigned = await db.insert(checkSocietyTable).values({
        eventId: eventId,
        societyId: societyId,
        quantity: quantity
    });

    if (!assigned.rowsAffected)
        return { error: "Failed to assign tickets."};
    
    await db.update(eventTable)
        .set({ quantity: ticketsRemaining })
        .where(eq(eventTable.id, eventId));
    
    return { assigned: true };
}