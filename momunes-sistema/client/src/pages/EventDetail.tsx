import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import PublicLayout from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, ArrowLeft, Clock } from "lucide-react";

const activityLabels: Record<string, string> = {
  acolhimento: "Acolhimento",
  educacao: "Educação",
  empoderamento: "Empoderamento",
  atuacao_politica: "Atuação Política",
  outro: "Outro",
};

export default function EventDetail() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id || "0");

  const { data: event, isLoading } = trpc.publicEvents.getById.useQuery({ id }, { enabled: !!id });

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 max-w-4xl py-20">
          <div className="animate-pulse space-y-4">
            <div className="h-8 rounded w-1/3" style={{ background: "oklch(0.90 0.02 50)" }}></div>
            <div className="h-4 rounded w-2/3" style={{ background: "oklch(0.90 0.02 50)" }}></div>
            <div className="h-64 rounded" style={{ background: "oklch(0.90 0.02 50)" }}></div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (!event) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 max-w-4xl py-20 text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Evento não encontrado
          </h2>
          <Link href="/eventos">
            <Button>Ver todos os eventos</Button>
          </Link>
        </div>
      </PublicLayout>
    );
  }

  const spotsLeft = event.maxSpots ? event.maxSpots - (event.spotsUsed || 0) : null;
  const isFull = spotsLeft !== null && spotsLeft <= 0;

  return (
    <PublicLayout>
      {/* Header */}
      <section className="py-16" style={{ background: "oklch(0.15 0.02 30)" }}>
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href="/eventos">
            <button className="flex items-center gap-2 text-sm mb-6 transition-colors"
              style={{ color: "oklch(0.72 0.12 75)" }}>
              <ArrowLeft size={16} />
              Voltar para eventos
            </button>
          </Link>

          <span className="text-xs font-semibold px-3 py-1 rounded-full mb-4 inline-block"
            style={{ background: "oklch(0.72 0.12 75 / 0.15)", color: "oklch(0.72 0.12 75)" }}>
            {activityLabels[event.activityType] || "Outro"}
          </span>

          <h1 className="text-3xl md:text-5xl font-bold text-white mt-3 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            {event.title}
          </h1>
          <div className="divider-gold w-24 mb-6"></div>

          <div className="flex flex-wrap gap-6 text-gray-300">
            <div className="flex items-center gap-2">
              <Calendar size={16} style={{ color: "oklch(0.72 0.12 75)" }} />
              {new Date(event.eventDate).toLocaleDateString("pt-BR", {
                weekday: "long", day: "2-digit", month: "long", year: "numeric"
              })}
            </div>
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin size={16} style={{ color: "oklch(0.72 0.12 75)" }} />
                {event.location}
              </div>
            )}
            {event.maxSpots && (
              <div className="flex items-center gap-2">
                <Users size={16} style={{ color: "oklch(0.72 0.12 75)" }} />
                {isFull ? "Vagas esgotadas" : `${spotsLeft} vagas disponíveis`}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16" style={{ background: "oklch(0.97 0.01 60)" }}>
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Description */}
            <div className="lg:col-span-2">
              <div className="card-afro rounded-xl p-8 mb-6">
                <h2 className="text-xl font-bold mb-4"
                  style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.15 0.02 30)" }}>
                  Sobre o Evento
                </h2>
                <div className="divider-gold w-16 mb-4"></div>
                <p className="text-gray-600 leading-relaxed">
                  {event.description || "Nenhuma descrição disponível para este evento."}
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Info Card */}
              <div className="card-afro rounded-xl p-6">
                <h3 className="font-bold mb-4"
                  style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.15 0.02 30)" }}>
                  Informações
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Data</div>
                    <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "oklch(0.15 0.02 30)" }}>
                      <Calendar size={14} style={{ color: "oklch(0.52 0.14 35)" }} />
                      {new Date(event.eventDate).toLocaleDateString("pt-BR", {
                        day: "2-digit", month: "long", year: "numeric"
                      })}
                    </div>
                  </div>
                  {event.location && (
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Local</div>
                      <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "oklch(0.15 0.02 30)" }}>
                        <MapPin size={14} style={{ color: "oklch(0.52 0.14 35)" }} />
                        {event.location}
                      </div>
                    </div>
                  )}
                  {event.maxSpots && (
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Vagas</div>
                      <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "oklch(0.15 0.02 30)" }}>
                        <Users size={14} style={{ color: "oklch(0.52 0.14 35)" }} />
                        {isFull ? "Esgotadas" : `${spotsLeft} de ${event.maxSpots}`}
                      </div>
                      {!isFull && event.maxSpots && (
                        <div className="mt-2 h-2 rounded-full overflow-hidden"
                          style={{ background: "oklch(0.90 0.02 50)" }}>
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${Math.min(100, ((event.spotsUsed || 0) / event.maxSpots) * 100)}%`,
                              background: "linear-gradient(90deg, oklch(0.52 0.14 35), oklch(0.72 0.12 75))"
                            }}
                          ></div>
                        </div>
                      )}
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Frente</div>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full"
                      style={{ background: "oklch(0.93 0.04 35)", color: "oklch(0.35 0.10 35)" }}>
                      {activityLabels[event.activityType] || "Outro"}
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              {!isFull ? (
                <Link href={`/inscricao/${event.id}`}>
                  <Button className="w-full text-white font-semibold py-6"
                    style={{ background: "oklch(0.52 0.14 35)", border: "none" }}>
                    Inscrever-se Agora
                  </Button>
                </Link>
              ) : (
                <div className="text-center p-4 rounded-xl text-sm text-gray-500"
                  style={{ background: "oklch(0.90 0.02 50)" }}>
                  Vagas esgotadas para este evento.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
