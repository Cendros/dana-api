import { and, eq, gt, sql } from "drizzle-orm";
import { db } from "../db";
import { NewEvent, checkSocietyTable, checkUserTable, employeeUserTable, eventTable, societyTable, structureTable } from "../db/schema";
import CRC32 from 'crc-32';

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

export const getEventsBySociety = async (userId: number, societyId: number) => {
    let events = await db.select({
            event: eventTable,
            quantity:checkSocietyTable.quantity,
            ticketId: checkUserTable.id,
            structure: structureTable.name
        })
        .from(checkSocietyTable)
        .leftJoin(eventTable, eq(eventTable.id, checkSocietyTable.eventId))
        .leftJoin(checkUserTable, and(eq(checkUserTable.userId, userId), sql`event.id = ${checkUserTable.eventId}`))
        .leftJoin(structureTable, eq(structureTable.id, eventTable.structureId))
        .where(
            and(
                eq(checkSocietyTable.societyId, societyId),
                gt(checkSocietyTable.quantity, 0),
                gt(eventTable.date, new Date()),
            )
        )
        .orderBy(eventTable.date)
        .limit(10);
    
    events = events.reduce((accu: Array<any>, event) => {
        accu.push({
            ...event.event,
            quantity: event.quantity,
            ticketId: event.ticketId,
            structureName: event.structure
        });
        return accu;
    }, []);
    
    return events;
}

export const getEventValue = async (id: number) => {
    const event = await db.query.eventTable.findFirst({
        columns: {
            value: true
        },
        where: eq(eventTable.id, id)
    });

    return event?.value;
}

export const getEventSociety = async (id: number, societyId: number) => {
    const eventSociety = await db.query.checkSocietyTable.findFirst({
        where: (event, { eq, and }) => (
            and(
                eq(event.eventId, id),
                eq(event.societyId, societyId)
            )
        )
    });

    return eventSociety;
}

export const getEventsByUser = async (userId: number) => {
    let events = await db.select({
        ticketId: checkUserTable.id,
        event: eventTable,
        structureId: structureTable.id,
        structureName: structureTable.name
    })
        .from(checkUserTable)
        .leftJoin(eventTable, eq(eventTable.id, checkUserTable.eventId))
        .leftJoin(structureTable, eq(structureTable.id, eventTable.structureId))
        .where(eq(checkUserTable.userId, userId));
    
    events = events.reduce((accu: Array<any>, event) => {
        accu.push({
            ...event.event,
            ticketId: event.ticketId,
            structureId: event.structureId,
            structureName: event.structureName
        });
        return accu;
    }, []);

    return events;
}

export const bookEvent = async (userId: number, eventId: number) => {
    const user = await db.query.employeeUserTable.findFirst({
        columns: {
            balance: true,
            societyId: true
        },
        where: eq(employeeUserTable.id, userId)
    })

    if (!user)
        return { error: "Il y a eu une erreur lors de la réservation." };
    
    const value = await getEventValue(eventId);

    if (!value)
        return { error: "Il y a eu une erreur lors de la réservation."};

    if (!user.balance || user.balance < value || !user.societyId)
        return { error: "Vous ne pouvez pas réserver cet évènement."};

    const eventSociety = await getEventSociety(eventId, user.societyId);

    if (!eventSociety || (eventSociety.quantity ?? 0) <= 0)
        return { error: "Vous ne pouvez pas réserver cet évènement."};

    await db.transaction(async tx => {
        let query = await tx.update(checkSocietyTable)
            .set({ quantity: sql`${checkSocietyTable.quantity} - 1` })
            .where(
                and(
                    eq(checkSocietyTable.eventId, eventSociety.eventId),
                    eq(checkSocietyTable.societyId, eventSociety.societyId)
                )
            );

        if (!query.rowsAffected) {
            tx.rollback();
            return false
        }

        query = await tx.update(employeeUserTable)
            .set({
                balance: user.balance! - value
            })
            .where(eq(employeeUserTable.id, userId));

        if (!query.rowsAffected) {
            tx.rollback();
            return false;
        }

        query = await tx.insert(checkUserTable).values({
            eventId: eventId,
            userId: userId
        });

        if (!query.rowsAffected) {
            tx.rollback();
            return false;
        }
    });

    const events = await db.select({
            ticketId: checkUserTable.id,
            event: eventTable,
            structure: structureTable
        })
            .from(checkUserTable)
            .leftJoin(eventTable, eq(eventTable.id, checkUserTable.eventId))
            .leftJoin(structureTable, eq(structureTable.id, eventTable.structureId))
            .where(
                and(
                    eq(checkUserTable.userId, userId),
                    eq(checkUserTable.eventId, eventId)
                )
            );

    return { ticket: {
        ...events[0].event,
        ticketId: events[0].ticketId,
        structureName: events[0].structure?.name
    } };
}