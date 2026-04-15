import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  listParticipants,
  getParticipantById,
  createParticipant,
  updateParticipant,
  deleteParticipant,
  countParticipants,
  listEvents,
  getEventById,
  createEvent,
  updateEvent,
  countActiveEvents,
  listRegistrations,
  getRegistrationsByEvent,
  createRegistration,
  countRegistrations,
  countRegistrationsForEvent,
  getRecentRegistrations,
  listProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "./db";
import { notifyOwner } from "./_core/notification";

// Admin guard middleware
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Acesso restrito a administradores." });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ---- Public: Events ----
  publicEvents: router({
    list: publicProcedure.query(async () => {
      return listEvents(true);
    }),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      const event = await getEventById(input.id);
      if (!event) throw new TRPCError({ code: "NOT_FOUND" });
      const spotsUsed = await countRegistrationsForEvent(input.id);
      return { ...event, spotsUsed };
    }),
  }),

  // ---- Public: Registrations ----
  publicRegistrations: router({
    create: publicProcedure
      .input(
        z.object({
          eventId: z.number(),
          participantName: z.string().min(2),
          participantEmail: z.string().email().optional().or(z.literal("")),
          participantPhone: z.string().optional(),
          activityType: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const event = await getEventById(input.eventId);
        if (!event) throw new TRPCError({ code: "NOT_FOUND", message: "Evento não encontrado." });
        if (event.status !== "ativo")
          throw new TRPCError({ code: "BAD_REQUEST", message: "Este evento não está mais aceitando inscrições." });

        if (event.maxSpots) {
          const used = await countRegistrationsForEvent(input.eventId);
          if (used >= event.maxSpots) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Não há mais vagas disponíveis para este evento." });
          }
        }

        await createRegistration({
          eventId: input.eventId,
          participantName: input.participantName,
          participantEmail: input.participantEmail || null,
          participantPhone: input.participantPhone || null,
          activityType: input.activityType || null,
          notes: input.notes || null,
          status: "confirmada",
        });

        // Notify admin
        await notifyOwner({
          title: `Nova inscrição: ${event.title}`,
          content: `${input.participantName} se inscreveu no evento "${event.title}". Contato: ${input.participantEmail || input.participantPhone || "não informado"}.`,
        });

        return { success: true };
      }),
  }),

  // ---- Admin: Participants ----
  participants: router({
    list: adminProcedure
      .input(z.object({ search: z.string().optional() }))
      .query(async ({ input }) => listParticipants(input.search)),

    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const p = await getParticipantById(input.id);
        if (!p) throw new TRPCError({ code: "NOT_FOUND" });
        return p;
      }),

    create: adminProcedure
      .input(
        z.object({
          name: z.string().min(2),
          email: z.string().email().optional().or(z.literal("")),
          phone: z.string().optional(),
          address: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await createParticipant({
          name: input.name,
          email: input.email || null,
          phone: input.phone || null,
          address: input.address || null,
          notes: input.notes || null,
        });
        return { success: true };
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().min(2).optional(),
          email: z.string().email().optional().or(z.literal("")),
          phone: z.string().optional(),
          address: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateParticipant(id, data);
        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteParticipant(input.id);
        return { success: true };
      }),
  }),

  // ---- Admin: Events ----
  events: router({
    list: adminProcedure.query(async () => listEvents()),

    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const event = await getEventById(input.id);
        if (!event) throw new TRPCError({ code: "NOT_FOUND" });
        const spotsUsed = await countRegistrationsForEvent(input.id);
        const registrationsList = await getRegistrationsByEvent(input.id);
        return { ...event, spotsUsed, registrations: registrationsList };
      }),

    create: adminProcedure
      .input(
        z.object({
          title: z.string().min(2),
          description: z.string().optional(),
          location: z.string().optional(),
          eventDate: z.string(),
          endDate: z.string().optional(),
          maxSpots: z.number().optional(),
          activityType: z.enum([
            "acolhimento",
            "educacao",
            "empoderamento",
            "atuacao_politica",
            "outro",
          ]),
          imageUrl: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await createEvent({
          title: input.title,
          description: input.description || null,
          location: input.location || null,
          eventDate: new Date(input.eventDate),
          endDate: input.endDate ? new Date(input.endDate) : null,
          maxSpots: input.maxSpots || null,
          activityType: input.activityType,
          imageUrl: input.imageUrl || null,
          status: "ativo",
        });
        return { success: true };
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().min(2).optional(),
          description: z.string().optional(),
          location: z.string().optional(),
          eventDate: z.string().optional(),
          endDate: z.string().optional(),
          maxSpots: z.number().optional(),
          activityType: z
            .enum(["acolhimento", "educacao", "empoderamento", "atuacao_politica", "outro"])
            .optional(),
          status: z.enum(["ativo", "encerrado", "cancelado"]).optional(),
          imageUrl: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, eventDate, endDate, ...rest } = input;
        const data: Record<string, unknown> = { ...rest };
        if (eventDate) data.eventDate = new Date(eventDate);
        if (endDate) data.endDate = new Date(endDate);
        await updateEvent(id, data as any);
        return { success: true };
      }),
  }),

  // ---- Admin: Registrations ----
  registrations: router({
    list: adminProcedure
      .input(z.object({ eventId: z.number().optional() }))
      .query(async ({ input }) => listRegistrations(input.eventId)),

    exportByEvent: adminProcedure
      .input(z.object({ eventId: z.number() }))
      .query(async ({ input }) => {
        const event = await getEventById(input.eventId);
        const regs = await getRegistrationsByEvent(input.eventId);
        return { event, registrations: regs };
      }),
  }),

  // ---- Admin: Projects ----
  projects: router({
    list: adminProcedure.query(async () => listProjects()),

    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const p = await getProjectById(input.id);
        if (!p) throw new TRPCError({ code: "NOT_FOUND" });
        return p;
      }),

    create: adminProcedure
      .input(
        z.object({
          name: z.string().min(2),
          description: z.string().optional(),
          area: z.enum(["acolhimento", "educacao", "empoderamento", "atuacao_politica", "outro"]),
          status: z.enum(["planejamento", "em_andamento", "concluido", "suspenso"]),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
          responsibleName: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await createProject({
          name: input.name,
          description: input.description || null,
          area: input.area,
          status: input.status,
          startDate: input.startDate ? new Date(input.startDate) : null,
          endDate: input.endDate ? new Date(input.endDate) : null,
          responsibleName: input.responsibleName || null,
          notes: input.notes || null,
        });
        return { success: true };
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().min(2).optional(),
          description: z.string().optional(),
          area: z
            .enum(["acolhimento", "educacao", "empoderamento", "atuacao_politica", "outro"])
            .optional(),
          status: z
            .enum(["planejamento", "em_andamento", "concluido", "suspenso"])
            .optional(),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
          responsibleName: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, startDate, endDate, ...rest } = input;
        const data: Record<string, unknown> = { ...rest };
        if (startDate) data.startDate = new Date(startDate);
        if (endDate) data.endDate = new Date(endDate);
        await updateProject(id, data as any);
        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteProject(input.id);
        return { success: true };
      }),
  }),

  // ---- Admin: Dashboard ----
  dashboard: router({
    metrics: adminProcedure.query(async () => {
      const [totalParticipants, activeEvents, totalRegistrations, recentRegs] = await Promise.all([
        countParticipants(),
        countActiveEvents(),
        countRegistrations(),
        getRecentRegistrations(5),
      ]);
      return { totalParticipants, activeEvents, totalRegistrations, recentRegistrations: recentRegs };
    }),
  }),
});

export type AppRouter = typeof appRouter;
