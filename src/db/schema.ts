import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { accessibilitiesType } from "../types/accessibility";

export const eventTable = sqliteTable('event', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    structureId: integer('structure_id').notNull().references(() => structureTable.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    value: integer('value').notNull(),
    date: integer('date', { mode: 'timestamp' }),
    dateExpiration: integer('date_expiration', { mode: 'timestamp' }),
    image: text('image'),
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
    id: integer('id').primaryKey({ autoIncrement: true }),
    eventId: integer('event_id').notNull().references(() => eventTable.id, { onDelete: 'cascade' }),
    userId: integer('user_id').notNull().references(() => employeeUserTable.id, { onDelete: 'cascade' }),
})

export const employeeUserTable = sqliteTable("employee_user", {
    id: integer('id').primaryKey({ autoIncrement: true }),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    societyId: integer('society_id').references(() => societyTable.id, { onDelete: 'cascade' }),
    balance: integer('balance')
})

export const societyUserTable = sqliteTable("society_user", {
    id: integer('id').primaryKey({ autoIncrement: true }),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    societyId: integer('society_id').references(() => societyTable.id, { onDelete: 'cascade' }),  
})

export const structureUserTable = sqliteTable("stucture_user", {
    id: integer('id').primaryKey({ autoIncrement: true }),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    structureId: integer('structure_id').references(() => structureTable.id, { onDelete: 'cascade' }),
})

export const adminUserTable = sqliteTable("admin_user", {
    id: integer('id').primaryKey({ autoIncrement: true }),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
})

export const structureTable = sqliteTable("structure", {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    address: text('address'),
    city: text('city'),
    postalCode: text('postalCode'),
    image: text('image'),
    longitude: text('longitude'),
    latitude: text('latitude')
})

export const societyTable = sqliteTable("society", {
    id: integer('id', {mode: "number"}).primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    address: text('address'),
    city: text('city'),
    postalCode: text('postalCode'),
})
export const accessibilityTable = sqliteTable("accessibility", {
    id: integer('id', {mode: "number"}).primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    icon: text('icon'),
    type: text('type',{enum:accessibilitiesType}),
})

export const accessibilityStuctureTable = sqliteTable('accessibility_structure', {
    accessibilityId: integer('accessibility_id').notNull().references(() => accessibilityTable.id, { onDelete: 'cascade' }),
    structureId: integer('structure_id').notNull().references(() => structureTable.id, { onDelete: 'cascade' }),
}, (table) => {
    return {
        pk: primaryKey(table.accessibilityId, table.structureId)
    }
})

export type Event = InferSelectModel<typeof eventTable>;
export type NewEvent = InferInsertModel<typeof eventTable>;
export type CheckEvent = InferSelectModel<typeof checkSocietyTable>;
export type CheckUser = InferSelectModel<typeof checkUserTable>;
export type EmployeeUser = InferSelectModel<typeof employeeUserTable>;
export type SocietyUser = InferSelectModel<typeof societyUserTable>;
export type StructureUser = InferSelectModel<typeof structureUserTable>;
export type AdminUser = InferSelectModel<typeof adminUserTable>;
export type Structure = InferSelectModel<typeof structureTable>;
export type Society = InferSelectModel<typeof societyTable>;
export type Accessibility = InferSelectModel<typeof accessibilityTable >