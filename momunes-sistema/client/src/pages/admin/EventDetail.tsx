import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { AdminLayout } from "./Dashboard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Calendar, MapPin, Users, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const activityLabels: Record<string, string> = {
  acolhimento: "Acolhimento",
  educacao: "Educação",
  empoderamento: "Empoderamento",
  atuacao_politica: "Atuação Política",
  outro: "Outro",
};

function exportToCSV(eventTitle: string, registrations: any[]) {
  const headers = ["Nome", "E-mail", "Telefone", "Tipo de Atividade", "Observações", "Status", "Data de Inscrição"];
  const rows = registrations.map((r) => [
    r.participantName,
    r.participantEmail || "",
    r.participantPhone || "",
    r.activityType || "",
    r.notes || "",
    r.status,
    new Date(r.createdAt).toLocaleDateString("pt-BR"),
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const bom = "\uFEFF"; // UTF-8 BOM for Excel
  const blob = new Blob([bom + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `inscritos_${eventTitle.replace(/\s+/g, "_")}_${new Date().toLocaleDateString("pt-BR").replace(/\//g, "-")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success("Relatório exportado com sucesso!");
}

export default function AdminEventDetail() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id || "0");

  const { data: event, isLoading } = trpc.events.getById.useQuery({ id }, { enabled: !!id });

  if (isLoading) {
    return (
      <AdminLayout title="Carregando...">
        <div className="animate-pulse space-y-4">
          <div className="h-8 rounded w-1/3" style={{ background: "oklch(0.20 0.03 30)" }}></div>
          <div className="h-64 rounded" style={{ background: "oklch(0.17 0.03 30)" }}></div>
        </div>
      </AdminLayout>
    );
  }

  if (!event) {
    return (
      <AdminLayout title="Evento não encontrado">
        <Link href="/admin/eventos">
          <Button>← Voltar</Button>
        </Link>
      </AdminLayout>
    );
  }

  const spotsLeft = event.maxSpots ? event.maxSpots - (event.spotsUsed || 0) : null;

  return (
    <AdminLayout title={event.title}>
      {/* Back + Actions */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/admin/eventos">
          <button className="flex items-center gap-2 text-sm"
            style={{ color: "oklch(0.72 0.12 75)" }}>
            <ArrowLeft size={16} />
            Voltar para eventos
          </button>
        </Link>
        {event.registrations && event.registrations.length > 0 && (
          <Button
            onClick={() => exportToCSV(event.title, event.registrations)}
            className="text-white"
            style={{ background: "oklch(0.38 0.10 145)", border: "none" }}
          >
            <Download size={16} className="mr-2" />
            Exportar CSV
          </Button>
        )}
      </div>

      {/* Event Info */}
      <div className="rounded-xl p-6 mb-6"
        style={{ background: "oklch(0.17 0.03 30)", border: "1px solid oklch(0.22 0.04 30)" }}>
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              {event.title}
            </h2>
            <span className="text-xs px-2 py-1 rounded-full"
              style={{ background: "oklch(0.22 0.06 35)", color: "oklch(0.72 0.10 35)" }}>
              {activityLabels[event.activityType] || "Outro"}
            </span>
          </div>
          <span className={`text-sm px-3 py-1 rounded-full font-medium ${
            event.status === "ativo"
              ? "text-green-400"
              : "text-gray-400"
          }`}
            style={{
              background: event.status === "ativo" ? "oklch(0.18 0.06 145)" : "oklch(0.20 0.03 30)"
            }}>
            {event.status === "ativo" ? "Ativo" : event.status === "encerrado" ? "Encerrado" : "Cancelado"}
          </span>
        </div>

        {event.description && (
          <p className="text-gray-400 mb-4 text-sm leading-relaxed">{event.description}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar size={14} style={{ color: "oklch(0.72 0.12 75)" }} />
            {new Date(event.eventDate).toLocaleDateString("pt-BR", {
              day: "2-digit", month: "long", year: "numeric"
            })}
          </div>
          {event.location && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <MapPin size={14} style={{ color: "oklch(0.72 0.12 75)" }} />
              {event.location}
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Users size={14} style={{ color: "oklch(0.72 0.12 75)" }} />
            {event.spotsUsed || 0} inscritos
            {event.maxSpots && ` / ${event.maxSpots} vagas`}
          </div>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="rounded-xl overflow-hidden"
        style={{ background: "oklch(0.17 0.03 30)", border: "1px solid oklch(0.22 0.04 30)" }}>
        <div className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid oklch(0.22 0.04 30)" }}>
          <h3 className="font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            Lista de Inscritos ({event.registrations?.length || 0})
          </h3>
          {event.registrations && event.registrations.length > 0 && (
            <span className="text-xs text-gray-500">
              Clique em "Exportar CSV" para baixar o relatório
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid oklch(0.22 0.04 30)" }}>
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Nome</th>
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Contato</th>
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Atividade</th>
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Data</th>
              </tr>
            </thead>
            <tbody>
              {event.registrations && event.registrations.length > 0 ? (
                event.registrations.map((reg) => (
                  <tr key={reg.id} style={{ borderBottom: "1px solid oklch(0.20 0.03 30)" }}
                    className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ background: "oklch(0.52 0.14 35)" }}>
                          {reg.participantName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-white">{reg.participantName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-400">
                        {reg.participantEmail && <div>{reg.participantEmail}</div>}
                        {reg.participantPhone && <div>{reg.participantPhone}</div>}
                        {!reg.participantEmail && !reg.participantPhone && "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {reg.activityType ? activityLabels[reg.activityType] || reg.activityType : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-1 rounded-full flex items-center gap-1 w-fit"
                        style={{ background: "oklch(0.18 0.06 145)", color: "oklch(0.72 0.12 145)" }}>
                        <CheckCircle size={10} />
                        Confirmada
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(reg.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Nenhuma inscrição registrada para este evento.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
