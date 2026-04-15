import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import PublicLayout from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Heart, BookOpen, Star, Shield } from "lucide-react";

const frentes = [
  {
    icon: Heart,
    title: "Acolhimento",
    label: "acolhimento",
    desc: "Casa de Acolhimento Recomeçar: moradia, assistência social, médica e psicológica para mulheres em situação de risco.",
    color: "oklch(0.52 0.14 35)",
    bg: "oklch(0.95 0.04 35)",
  },
  {
    icon: BookOpen,
    title: "Educação",
    label: "educacao",
    desc: "Creches com foco na valorização da cultura afro-brasileira e atividades educativas para crianças e jovens.",
    color: "oklch(0.38 0.10 145)",
    bg: "oklch(0.93 0.04 145)",
  },
  {
    icon: Star,
    title: "Empoderamento",
    label: "empoderamento",
    desc: "Projetos de igualdade de gênero e raça, cursos preparatórios e oficinas de geração de renda para mulheres.",
    color: "oklch(0.58 0.14 70)",
    bg: "oklch(0.95 0.06 75)",
  },
  {
    icon: Shield,
    title: "Atuação Política",
    label: "politica",
    desc: "Monitoramento de políticas públicas e combate ao racismo e discriminação étnico-racial na região de Sorocaba.",
    color: "oklch(0.40 0.12 280)",
    bg: "oklch(0.93 0.04 280)",
  },
];

export default function Home() {
  const { data: events } = trpc.publicEvents.list.useQuery();

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-36" style={{ background: "oklch(0.15 0.02 30)" }}>
        {/* Padrão decorativo */}
        <div className="absolute inset-0 pattern-afro opacity-40"></div>
        {/* Círculos decorativos */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-10"
          style={{ background: "oklch(0.72 0.12 75)" }}></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-10"
          style={{ background: "oklch(0.52 0.14 35)" }}></div>

        <div className="relative container mx-auto px-4 max-w-6xl">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{ background: "oklch(0.72 0.12 75 / 0.15)", color: "oklch(0.72 0.12 75)", border: "1px solid oklch(0.72 0.12 75 / 0.3)" }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "oklch(0.72 0.12 75)" }}></span>
              Fundado em 1997 · Sorocaba, SP
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              Movimento de{" "}
              <span style={{ color: "oklch(0.72 0.12 75)" }}>Mulheres Negras</span>{" "}
              de Sorocaba
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
              O MOMUNES é uma organização da sociedade civil sem fins lucrativos que atua no enfrentamento ao racismo, sexismo e desigualdades sociais, valorizando a identidade afro-brasileira e prestando apoio a mulheres e crianças em vulnerabilidade.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/eventos">
                <Button size="lg" className="text-white font-semibold px-8"
                  style={{ background: "oklch(0.52 0.14 35)", border: "none" }}>
                  Ver Eventos e Atividades
                </Button>
              </Link>
              <a href="#sobre">
                <Button size="lg" variant="outline" className="font-semibold px-8"
                  style={{ borderColor: "oklch(0.72 0.12 75 / 0.5)", color: "oklch(0.72 0.12 75)", background: "transparent" }}>
                  Conhecer o MOMUNES
                </Button>
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-12 pt-8"
              style={{ borderTop: "1px solid oklch(0.72 0.12 75 / 0.2)" }}>
              <div>
                <div className="text-3xl font-bold" style={{ color: "oklch(0.72 0.12 75)", fontFamily: "'Playfair Display', serif" }}>27+</div>
                <div className="text-sm text-gray-400">Anos de atuação</div>
              </div>
              <div>
                <div className="text-3xl font-bold" style={{ color: "oklch(0.72 0.12 75)", fontFamily: "'Playfair Display', serif" }}>4</div>
                <div className="text-sm text-gray-400">Frentes de atuação</div>
              </div>
              <div>
                <div className="text-3xl font-bold" style={{ color: "oklch(0.72 0.12 75)", fontFamily: "'Playfair Display', serif" }}>1997</div>
                <div className="text-sm text-gray-400">Ano de fundação</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="divider-gold"></div>

      {/* Frentes de Atuação */}
      <section id="sobre" className="py-20" style={{ background: "oklch(0.97 0.01 60)" }}>
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: "oklch(0.52 0.14 35)" }}>
              Nossa Missão
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4"
              style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.15 0.02 30)" }}>
              Frentes de Atuação
            </h2>
            <div className="divider-gold w-24 mx-auto mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              O MOMUNES atua em quatro frentes fundamentais para o fortalecimento da comunidade afro-brasileira e o enfrentamento das desigualdades sociais.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {frentes.map((frente) => {
              const Icon = frente.icon;
              return (
                <div key={frente.label} className="card-afro rounded-xl p-6 text-center group cursor-default">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110"
                    style={{ background: frente.bg }}>
                    <Icon size={24} style={{ color: frente.color }} />
                  </div>
                  <h3 className="font-bold text-lg mb-3"
                    style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.15 0.02 30)" }}>
                    {frente.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{frente.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sobre o MOMUNES */}
      <section className="py-20" style={{ background: "oklch(0.15 0.02 30)" }}>
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest mb-3"
                style={{ color: "oklch(0.72 0.12 75)" }}>
                Quem Somos
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                Uma história de resistência e empoderamento
              </h2>
              <div className="divider-gold w-24 mb-6"></div>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Fundado em 1997 por professoras negras em Sorocaba-SP, o MOMUNES nasceu com o objetivo de valorizar a identidade afro-brasileira e prestar apoio a mulheres e crianças em vulnerabilidade, restabelecendo vínculos comunitários.
              </p>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Ao longo de mais de 27 anos, construímos uma trajetória de luta, acolhimento e transformação social, oferecendo serviços essenciais e promovendo a cultura e os direitos da população negra.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg" style={{ background: "oklch(0.22 0.04 35)" }}>
                  <div className="font-bold text-xl mb-1" style={{ color: "oklch(0.72 0.12 75)", fontFamily: "'Playfair Display', serif" }}>Casa Recomeçar</div>
                  <div className="text-sm text-gray-400">Acolhimento para mulheres em situação de risco</div>
                </div>
                <div className="p-4 rounded-lg" style={{ background: "oklch(0.22 0.04 35)" }}>
                  <div className="font-bold text-xl mb-1" style={{ color: "oklch(0.72 0.12 75)", fontFamily: "'Playfair Display', serif" }}>Creches Afro</div>
                  <div className="text-sm text-gray-400">Educação infantil com recorte afro-brasileiro</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden aspect-square flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, oklch(0.25 0.06 35), oklch(0.35 0.10 40))" }}>
                {/* Decoração SVG afro-brasileira */}
                <svg viewBox="0 0 400 400" className="w-full h-full opacity-30">
                  <defs>
                    <pattern id="adinkra" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                      <circle cx="40" cy="40" r="30" fill="none" stroke="oklch(0.72 0.12 75)" strokeWidth="1.5"/>
                      <circle cx="40" cy="40" r="15" fill="none" stroke="oklch(0.72 0.12 75)" strokeWidth="1"/>
                      <line x1="10" y1="40" x2="70" y2="40" stroke="oklch(0.72 0.12 75)" strokeWidth="1"/>
                      <line x1="40" y1="10" x2="40" y2="70" stroke="oklch(0.72 0.12 75)" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="400" height="400" fill="url(#adinkra)"/>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="text-7xl font-bold mb-4"
                      style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.72 0.12 75)" }}>
                      M
                    </div>
                    <div className="text-white text-xl font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                      MOMUNES
                    </div>
                    <div className="text-gray-400 text-sm mt-2">Sorocaba · SP · 1997</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Eventos em Destaque */}
      {events && events.length > 0 && (
        <section className="py-20" style={{ background: "oklch(0.97 0.01 60)" }}>
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest mb-2"
                  style={{ color: "oklch(0.52 0.14 35)" }}>
                  Participe
                </p>
                <h2 className="text-3xl md:text-4xl font-bold"
                  style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.15 0.02 30)" }}>
                  Próximos Eventos
                </h2>
              </div>
              <Link href="/eventos">
                <Button variant="outline" style={{ borderColor: "oklch(0.52 0.14 35)", color: "oklch(0.52 0.14 35)" }}>
                  Ver todos
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.slice(0, 3).map((event) => (
                <Link key={event.id} href={`/eventos/${event.id}`}>
                  <div className="card-afro rounded-xl overflow-hidden cursor-pointer">
                    <div className="h-3 w-full"
                      style={{ background: "linear-gradient(90deg, oklch(0.52 0.14 35), oklch(0.72 0.12 75))" }}></div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-semibold px-2 py-1 rounded-full"
                          style={{ background: "oklch(0.93 0.04 35)", color: "oklch(0.35 0.10 35)" }}>
                          {event.activityType === "acolhimento" ? "Acolhimento"
                            : event.activityType === "educacao" ? "Educação"
                            : event.activityType === "empoderamento" ? "Empoderamento"
                            : event.activityType === "atuacao_politica" ? "Atuação Política"
                            : "Outro"}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg mb-2"
                        style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.15 0.02 30)" }}>
                        {event.title}
                      </h3>
                      {event.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                      )}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar size={14} style={{ color: "oklch(0.52 0.14 35)" }} />
                          {new Date(event.eventDate).toLocaleDateString("pt-BR", {
                            day: "2-digit", month: "long", year: "numeric"
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
                            {event.maxSpots} vagas disponíveis
                          </div>
                        )}
                      </div>
                      <div className="mt-4 pt-4" style={{ borderTop: "1px solid oklch(0.88 0.03 50)" }}>
                        <span className="text-sm font-semibold" style={{ color: "oklch(0.52 0.14 35)" }}>
                          Inscrever-se →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Final */}
      <section className="py-20 relative overflow-hidden" style={{ background: "oklch(0.52 0.14 35)" }}>
        <div className="absolute inset-0 pattern-afro opacity-20"></div>
        <div className="relative container mx-auto px-4 max-w-6xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Faça parte desta história
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Participe dos nossos eventos, atividades e projetos. Juntas somos mais fortes.
          </p>
          <Link href="/eventos">
            <Button size="lg" className="font-semibold px-10"
              style={{ background: "oklch(0.15 0.02 30)", color: "white", border: "none" }}>
              Ver Eventos Disponíveis
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
