import { Link, useParams, useLocation } from "wouter";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import PublicLayout from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, ArrowLeft, Calendar, MapPin, Users } from "lucide-react";
import { toast } from "sonner";

const activityLabels: Record<string, string> = {
  acolhimento: "Acolhimento",
  educacao: "Educação",
  empoderamento: "Empoderamento",
  atuacao_politica: "Atuação Política",
  outro: "Outro",
};

export default function Register() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id || "0");
  const [, navigate] = useLocation();
  const [submitted, setSubmitted] = useState(false);

  const { data: event, isLoading } = trpc.publicEvents.getById.useQuery({ id }, { enabled: !!id });

  const [form, setForm] = useState({
    participantName: "",
    participantEmail: "",
    participantPhone: "",
    activityType: "",
    notes: "",
  });

  const mutation = trpc.publicRegistrations.create.useMutation({
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: (err) => {
      toast.error(err.message || "Erro ao realizar inscrição. Tente novamente.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.participantName.trim()) {
      toast.error("Por favor, informe seu nome.");
      return;
    }
    mutation.mutate({
      eventId: id,
      participantName: form.participantName,
      participantEmail: form.participantEmail || undefined,
      participantPhone: form.participantPhone || undefined,
      activityType: form.activityType || undefined,
      notes: form.notes || undefined,
    });
  };

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 max-w-2xl py-20">
          <div className="animate-pulse space-y-4">
            <div className="h-8 rounded w-1/2" style={{ background: "oklch(0.90 0.02 50)" }}></div>
            <div className="h-64 rounded" style={{ background: "oklch(0.90 0.02 50)" }}></div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (!event) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 max-w-2xl py-20 text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Evento não encontrado
          </h2>
          <Link href="/eventos"><Button>Ver todos os eventos</Button></Link>
        </div>
      </PublicLayout>
    );
  }

  if (submitted) {
    return (
      <PublicLayout>
        <section className="py-20" style={{ background: "oklch(0.97 0.01 60)" }}>
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="card-afro rounded-2xl p-10 text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: "oklch(0.90 0.05 145)" }}>
                <CheckCircle size={40} style={{ color: "oklch(0.38 0.10 145)" }} />
              </div>
              <h2 className="text-3xl font-bold mb-3"
                style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.15 0.02 30)" }}>
                Inscrição Confirmada!
              </h2>
              <div className="divider-gold w-24 mx-auto mb-4"></div>
              <p className="text-gray-600 mb-2 text-lg">
                Sua inscrição em <strong>{event.title}</strong> foi realizada com sucesso.
              </p>
              <p className="text-gray-500 mb-8">
                Obrigada por participar das atividades do MOMUNES. Nos vemos em breve!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/eventos">
                  <Button variant="outline" style={{ borderColor: "oklch(0.52 0.14 35)", color: "oklch(0.52 0.14 35)" }}>
                    Ver outros eventos
                  </Button>
                </Link>
                <Link href="/">
                  <Button className="text-white" style={{ background: "oklch(0.52 0.14 35)", border: "none" }}>
                    Voltar ao início
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </PublicLayout>
    );
  }

  const spotsLeft = event.maxSpots ? event.maxSpots - (event.spotsUsed || 0) : null;
  const isFull = spotsLeft !== null && spotsLeft <= 0;

  return (
    <PublicLayout>
      {/* Header */}
      <section className="py-12" style={{ background: "oklch(0.15 0.02 30)" }}>
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href={`/eventos/${id}`}>
            <button className="flex items-center gap-2 text-sm mb-4"
              style={{ color: "oklch(0.72 0.12 75)" }}>
              <ArrowLeft size={16} />
              Voltar para o evento
            </button>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Inscrição
          </h1>
          <p className="text-gray-300">{event.title}</p>
        </div>
      </section>

      {/* Form */}
      <section className="py-12" style={{ background: "oklch(0.97 0.01 60)" }}>
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              {isFull ? (
                <div className="card-afro rounded-xl p-8 text-center">
                  <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Vagas Esgotadas
                  </h3>
                  <p className="text-gray-500">Não há mais vagas disponíveis para este evento.</p>
                </div>
              ) : (
                <div className="card-afro rounded-xl p-8">
                  <h2 className="text-xl font-bold mb-2"
                    style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.15 0.02 30)" }}>
                    Preencha seus dados
                  </h2>
                  <div className="divider-gold w-16 mb-6"></div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <Label htmlFor="name" className="text-sm font-semibold mb-1 block"
                        style={{ color: "oklch(0.25 0.04 35)" }}>
                        Nome completo *
                      </Label>
                      <Input
                        id="name"
                        placeholder="Seu nome completo"
                        value={form.participantName}
                        onChange={(e) => setForm({ ...form, participantName: e.target.value })}
                        required
                        className="border-2"
                        style={{ borderColor: "oklch(0.88 0.03 50)" }}
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-sm font-semibold mb-1 block"
                        style={{ color: "oklch(0.25 0.04 35)" }}>
                        E-mail
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={form.participantEmail}
                        onChange={(e) => setForm({ ...form, participantEmail: e.target.value })}
                        className="border-2"
                        style={{ borderColor: "oklch(0.88 0.03 50)" }}
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-sm font-semibold mb-1 block"
                        style={{ color: "oklch(0.25 0.04 35)" }}>
                        Telefone / WhatsApp
                      </Label>
                      <Input
                        id="phone"
                        placeholder="(15) 99999-9999"
                        value={form.participantPhone}
                        onChange={(e) => setForm({ ...form, participantPhone: e.target.value })}
                        className="border-2"
                        style={{ borderColor: "oklch(0.88 0.03 50)" }}
                      />
                    </div>

                    <div>
                      <Label htmlFor="activityType" className="text-sm font-semibold mb-1 block"
                        style={{ color: "oklch(0.25 0.04 35)" }}>
                        Tipo de atividade de interesse
                      </Label>
                      <Select
                        value={form.activityType}
                        onValueChange={(v) => setForm({ ...form, activityType: v })}
                      >
                        <SelectTrigger className="border-2" style={{ borderColor: "oklch(0.88 0.03 50)" }}>
                          <SelectValue placeholder="Selecione uma frente de atuação" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="acolhimento">Acolhimento</SelectItem>
                          <SelectItem value="educacao">Educação</SelectItem>
                          <SelectItem value="empoderamento">Empoderamento</SelectItem>
                          <SelectItem value="atuacao_politica">Atuação Política</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="notes" className="text-sm font-semibold mb-1 block"
                        style={{ color: "oklch(0.25 0.04 35)" }}>
                        Observações (opcional)
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="Alguma informação adicional que queira compartilhar..."
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        rows={3}
                        className="border-2"
                        style={{ borderColor: "oklch(0.88 0.03 50)" }}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full text-white font-semibold py-6 text-base"
                      style={{ background: "oklch(0.52 0.14 35)", border: "none" }}
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending ? "Enviando..." : "Confirmar Inscrição"}
                    </Button>
                  </form>
                </div>
              )}
            </div>

            {/* Event Summary */}
            <div>
              <div className="card-afro rounded-xl p-6">
                <h3 className="font-bold mb-4"
                  style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.15 0.02 30)" }}>
                  Resumo do Evento
                </h3>
                <div className="divider-gold w-16 mb-4"></div>
                <h4 className="font-semibold mb-3" style={{ color: "oklch(0.15 0.02 30)" }}>
                  {event.title}
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={14} style={{ color: "oklch(0.52 0.14 35)" }} />
                    {new Date(event.eventDate).toLocaleDateString("pt-BR", {
                      day: "2-digit", month: "long", year: "numeric"
                    })}
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={14} style={{ color: "oklch(0.52 0.14 35)" }} />
                      {event.location}
                    </div>
                  )}
                  {spotsLeft !== null && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users size={14} style={{ color: "oklch(0.52 0.14 35)" }} />
                      {spotsLeft} vagas restantes
                    </div>
                  )}
                </div>
                <div className="mt-4 pt-4" style={{ borderTop: "1px solid oklch(0.88 0.03 50)" }}>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full"
                    style={{ background: "oklch(0.93 0.04 35)", color: "oklch(0.35 0.10 35)" }}>
                    {activityLabels[event.activityType] || "Outro"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
