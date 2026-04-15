import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import PublicLayout from "@/components/PublicLayout";
import { Calendar, MapPin, Users, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const activityLabels: Record<string, string> = {
  acolhimento: "Acolhimento",
  educacao: "Educação",
  empoderamento: "Empoderamento",
  atuacao_politica: "Atuação Política",
  outro: "Outro",
};

const activityColors: Record<string, { bg: string; color: string }> = {
  acolhimento: { bg: "oklch(0.93 0.04 35)", color: "oklch(0.35 0.10 35)" },
  educacao: { bg: "oklch(0.90 0.05 145)", color: "oklch(0.25 0.08 145)" },
  empoderamento: { bg: "oklch(0.93 0.06 75)", color: "oklch(0.35 0.10 70)" },
  atuacao_politica: { bg: "oklch(0.90 0.04 280)", color: "oklch(0.30 0.08 280)" },
  outro: { bg: "oklch(0.90 0.02 50)", color: "oklch(0.35 0.04 50)" },
};

export default function Events() {
  const { data: events, isLoading } = trpc.publicEvents.list.useQuery();

  return (
    <PublicLayout>
      {/* Header */}
      <section className="py-16" style={{ background: "oklch(0.15 0.02 30)" }}>
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="pattern-afro absolute inset-0 opacity-20 pointer-events-none"></div>
          <p className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: "oklch(0.72 0.12 75)" }}>
            Participe
          </p>
          <h1 className="text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Eventos e Atividades
          </h1>
          <div className="divider-gold w-24 mb-4"></div>
          <p className="text-gray-300 max-w-xl">
            Confira os eventos e atividades abertos para inscrição. Venha fazer parte da nossa comunidade!
          </p>
        </div>
      </section>

      {/* Events List */}
      <section className="py-16" style={{ background: "oklch(0.97 0.01 60)" }}>
        <div className="container mx-auto px-4 max-w-6xl">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl h-64 animate-pulse"
                  style={{ background: "oklch(0.90 0.02 50)" }}></div>
              ))}
            </div>
          ) : events && events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => {
                const colors = activityColors[event.activityType] || activityColors.outro;
                return (
                  <div key={event.id} className="card-afro rounded-xl overflow-hidden">
                    <div className="h-2 w-full"
                      style={{ background: "linear-gradient(90deg, oklch(0.52 0.14 35), oklch(0.72 0.12 75))" }}></div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold px-3 py-1 rounded-full"
                          style={{ background: colors.bg, color: colors.color }}>
                          {activityLabels[event.activityType] || "Outro"}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full text-white"
                          style={{ background: "oklch(0.52 0.14 35)" }}>
                          Aberto
                        </span>
                      </div>

                      <h3 className="font-bold text-xl mb-2"
                        style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.15 0.02 30)" }}>
                        {event.title}
                      </h3>

                      {event.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                          {event.description}
                        </p>
                      )}

                      <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar size={14} style={{ color: "oklch(0.52 0.14 35)" }} />
                          {new Date(event.eventDate).toLocaleDateString("pt-BR", {
                            weekday: "long", day: "2-digit", month: "long", year: "numeric"
                          })}
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin size={14} style={{ color: "oklch(0.52 0.14 35)" }} />
                            {event.location}
                          </div>
                        )}
                        {event.maxSpots && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Users size={14} style={{ color: "oklch(0.52 0.14 35)" }} />
                            {event.maxSpots} vagas
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <Link href={`/eventos/${event.id}`} className="flex-1">
                          <Button variant="outline" className="w-full text-sm"
                            style={{ borderColor: "oklch(0.52 0.14 35)", color: "oklch(0.52 0.14 35)" }}>
                            Ver Detalhes
                          </Button>
                        </Link>
                        <Link href={`/inscricao/${event.id}`} className="flex-1">
                          <Button className="w-full text-sm text-white"
                            style={{ background: "oklch(0.52 0.14 35)", border: "none" }}>
                            Inscrever-se
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "oklch(0.93 0.04 35)" }}>
                <Calendar size={28} style={{ color: "oklch(0.52 0.14 35)" }} />
              </div>
              <h3 className="text-xl font-bold mb-2"
                style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.15 0.02 30)" }}>
                Nenhum evento disponível no momento
              </h3>
              <p className="text-gray-500">Fique atenta às nossas redes sociais para novidades!</p>
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
