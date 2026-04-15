import { eq, like, desc, count, and, gte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  participants,
  InsertParticipant,
  events,
  InsertEvent,
  registrations,
  InsertRegistration,
  projects,
  InsertProject,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ---- Users ----
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};

  const textFields = ["name", "email", "loginMethod"] as const;
  type TextField = (typeof textFields)[number];
  const assignNullable = (field: TextField) => {
    const value = user[field];
    if (value === undefined) return;
    const normalized = value ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  };
  textFields.forEach(assignNullable);

  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ---- Participants ----
export async function listParticipants(search?: string) {
  const db = await getDb();
  if (!db) return [];
  if (search) {
    return db
      .select()
      .from(participants)
      .where(like(participants.name, `%${search}%`))
      .orderBy(desc(participants.createdAt));
  }
  return db.select().from(participants).orderBy(desc(participants.createdAt));
}

export async function getParticipantById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(participants).where(eq(participants.id, id)).limit(1);
  return result[0];
}

export async function createParticipant(data: InsertParticipant) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(participants).values(data);
}

export async function updateParticipant(id: number, data: Partial<InsertParticipant>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(participants).set(data).where(eq(participants.id, id));
}

export async function deleteParticipant(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(participants).where(eq(participants.id, id));
}

export async function countParticipants() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: count() }).from(participants);
  return result[0]?.count ?? 0;
}

// ---- Events ----
export async function listEvents(onlyActive?: boolean) {
  const db = await getDb();
  if (!db) return [];
  if (onlyActive) {
    return db
      .select()
      .from(events)
      .where(eq(events.status, "ativo"))
      .orderBy(desc(events.eventDate));
  }
  return db.select().from(events).orderBy(desc(events.eventDate));
}

export async function getEventById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(events).where(eq(events.id, id)).limit(1);
  return result[0];
}

export async function createEvent(data: InsertEvent) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(events).values(data);
}

export async function updateEvent(id: number, data: Partial<InsertEvent>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(events).set(data).where(eq(events.id, id));
}

export async function countActiveEvents() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db
    .select({ count: count() })
    .from(events)
    .where(eq(events.status, "ativo"));
  return result[0]?.count ?? 0;
}

// ---- Registrations ----
export async function listRegistrations(eventId?: number) {
  const db = await getDb();
  if (!db) return [];
  if (eventId) {
    return db
      .select()
      .from(registrations)
      .where(eq(registrations.eventId, eventId))
      .orderBy(desc(registrations.createdAt));
  }
  return db.select().from(registrations).orderBy(desc(registrations.createdAt));
}

export async function getRegistrationsByEvent(eventId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(registrations)
    .where(eq(registrations.eventId, eventId))
    .orderBy(desc(registrations.createdAt));
}

export async function createRegistration(data: InsertRegistration) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(registrations).values(data);
}

export async function countRegistrations() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: count() }).from(registrations);
  return result[0]?.count ?? 0;
}

export async function countRegistrationsForEvent(eventId: number) {
  const db = await getDb();
  if (!db) return 0;
  const result = await db
    .select({ count: count() })
    .from(registrations)
    .where(
      and(
        eq(registrations.eventId, eventId),
        eq(registrations.status, "confirmada")
      )
    );
  return result[0]?.count ?? 0;
}

export async function getRecentRegistrations(limit = 10) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(registrations)
    .orderBy(desc(registrations.createdAt))
    .limit(limit);
}

// ---- Projects ----
export async function listProjects() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(projects).orderBy(desc(projects.createdAt));
}

export async function getProjectById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return result[0];
}

export async function createProject(data: InsertProject) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(projects).values(data);
}

export async function updateProject(id: number, data: Partial<InsertProject>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(projects).set(data).where(eq(projects.id, id));
}

export async function deleteProject(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(projects).where(eq(projects.id, id));
}
