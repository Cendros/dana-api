import { InferSelectModel } from "drizzle-orm";
import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const eventTable = sqliteTable('event', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    structureId: integer('structure_id').notNull().references(() => structureTable.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    value: integer('value').notNull(),
    date: integer('date', { mode: 'timestamp' }),
    dateExpiration: integer('date_expiration', { mode: 'timestamp' }),
    image: text('name'),
    description: text('description'),
    quantity: integer('quantity')
})

export const checkSocietyTable = sqliteTable('check_society', {
    eventId: integer('event_id').notNull().references(() => eventTable.id, { onDelete: 'cascade' }),
    societyId: integer('society_id').notNull().references(() => societyTable.id, { onDelete: 'cascade' }),
    quantity: integer('quantity').notNull(),
}, (table) => {
    return {
        pk: primaryKey(table.eventId, table.societyId)
    }
})

export const checkUserTable = sqliteTable('check_user', {
    eventId: integer('event_id').notNull().references(() => eventTable.id, { onDelete: 'cascade' }),
    userId: integer('user_id').notNull().references(() => employeeUserTable.id, { onDelete: 'cascade' }),
    quantity: integer('quantity').notNull(),
}, (table) => {
    return {
        pk: primaryKey(table.eventId, table.userId)
    }
})

export const employeeUserTable = sqliteTable("employee_user", {
    id: integer('id').primaryKey({ autoIncrement: true }),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    societyId: integer('society_id').references(() => societyTable.id, { onDelete: 'cascade' }),
    solde: integer('solde')
})

export const societyUserTable = sqliteTable("society_user", {
    id: integer('id').primaryKey({ autoIncrement: true }),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    societyId: integer('society_id').references(() => societyTable.id, { onDelete: 'cascade' }),
    maritalStatus: integer('marital_status', { mode: 'boolean' }),
    children: integer('children'),
    startDate: integer('start_date', { mode: 'timestamp' }),
})

export const structureUserTable = sqliteTable("stucture_user", {
    id: integer('id').primaryKey({ autoIncrement: true }),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    structureId: integer('structure_id').references(() => structureTable.id, { onDelete: 'cascade' }),
})

export const structureTable = sqliteTable("structure", {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    address: text('address'),
    city: text('city'),
    postalCode: text('postalCode'),
    checkValue: integer('check_value'),
    image: text('image')
})

export const societyTable = sqliteTable("society", {
    id: integer('id', {mode: "number"}).primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
})

export type Event = InferSelectModel<typeof eventTable>;
export type CheckEvent = InferSelectModel<typeof checkSocietyTable>;
export type CheckUser = InferSelectModel<typeof checkUserTable>;
export type EmployeeUser = InferSelectModel<typeof employeeUserTable>;
export type SocietyUser = InferSelectModel<typeof societyUserTable>;
export type StructureUser = InferSelectModel<typeof structureUserTable>;
export type Structure = InferSelectModel<typeof structureTable>;
export type Society = InferSelectModel<typeof societyTable>;