import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  date,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Participantes
export const participants = mysqlTable("participants", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 30 }),
  address: text("address"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Participant = typeof participants.$inferSelect;
export type InsertParticipant = typeof participants.$inferInsert;

// Eventos
export const events = mysqlTable("events", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  location: varchar("location", { length: 255 }),
  eventDate: timestamp("eventDate").notNull(),
  endDate: timestamp("endDate"),
  maxSpots: int("maxSpots"),
  activityType: mysqlEnum("activityType", [
    "acolhimento",
    "educacao",
    "empoderamento",
    "atuacao_politica",
    "outro",
  ])
    .default("outro")
    .notNull(),
  status: mysqlEnum("status", ["ativo", "encerrado", "cancelado"])
    .default("ativo")
    .notNull(),
  imageUrl: text("imageUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

// Inscrições
export const registrations = mysqlTable("registrations", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("eventId").notNull(),
  participantName: varchar("participantName", { length: 255 }).notNull(),
  participantEmail: varchar("participantEmail", { length: 320 }),
  participantPhone: varchar("participantPhone", { length: 30 }),
  activityType: varchar("activityType", { length: 100 }),
  notes: text("notes"),
  status: mysqlEnum("status", ["confirmada", "cancelada", "lista_espera"])
    .default("confirmada")
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Registration = typeof registrations.$inferSelect;
export type InsertRegistration = typeof registrations.$inferInsert;

// Projetos
export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  area: mysqlEnum("area", [
    "acolhimento",
    "educacao",
    "empoderamento",
    "atuacao_politica",
    "outro",
  ])
    .default("outro")
    .notNull(),
  status: mysqlEnum("status", ["planejamento", "em_andamento", "concluido", "suspenso"])
    .default("planejamento")
    .notNull(),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  responsibleName: varchar("responsibleName", { length: 255 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;
