import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { AdminLayout } from "./Dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Calendar, MapPin, Users, Eye, Pencil, XCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const activityLabels: Record<string, string> = {
  acolhimento: "Acolhimento",
  educacao: "Educação",
  empoderamento: "Empoderamento",
  atuacao_politica: "Atuação Política",
  outro: "Outro",
};

const statusColors: Record<string, { bg: string; color: string; label: string }> = {
  ativo: { bg: "oklch(0.18 0.06 145)", color: "oklch(0.72 0.12 145)", label: "Ativo" },
  encerrado: { bg: "oklch(0.20 0.04 50)", color: "oklch(0.65 0.05 50)", label: "Encerrado" },
  cancelado: { bg: "oklch(0.20 0.06 25)", color: "oklch(0.70 0.15 25)", label: "Cancelado" },
};

const emptyForm = {
  title: "",
  description: "",
  location: "",
  eventDate: "",
  endDate: "",
  maxSpots: "",
  activityType: "outro" as const,
  imageUrl: "",
};

export default function AdminEvents() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);

  const utils = trpc.useUtils();
  const { data: events, isLoading } = trpc.events.list.useQuery();

  const createMutation = trpc.events.create.useMutation({
    onSuccess: () => {
      toast.success("Evento criado com sucesso!");
      utils.events.list.invalidate();
      setDialogOpen(false);
      setForm(emptyForm);
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.events.update.useMutation({
    onSuccess: () => {
      toast.success("Evento atualizado!");
      utils.events.list.invalidate();
      setDialogOpen(false);
      setEditTarget(null);
    },
    onError: (err) => toast.error(err.message),
  });

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (e: any) => {
    setEditTarget(e);
    setForm({
      title: e.title,
      description: e.description || "",
      location: e.location || "",
      eventDate: e.eventDate ? new Date(e.eventDate).toISOString().slice(0, 16) : "",
      endDate: e.endDate ? new Date(e.endDate).toISOString().slice(0, 16) : "",
      maxSpots: e.maxSpots ? String(e.maxSpots) : "",
      activityType: e.activityType,
      imageUrl: e.imageUrl || "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.eventDate) {
      toast.error("Título e data são obrigatórios.");
      return;
    }
    const data = {
      title: form.title,
      description: form.description || undefined,
      location: form.location || undefined,
      eventDate: form.eventDate,
      endDate: form.endDate || undefined,
      maxSpots: form.maxSpots ? parseInt(form.maxSpots) : undefined,
      activityType: form.activityType,
      imageUrl: form.imageUrl || undefined,
    };
    if (editTarget) {
      updateMutation.mutate({ id: editTarget.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleClose = (id: number) => {
    updateMutation.mutate({ id, status: "encerrado" });
  };

  return (
    <AdminLayout title="Eventos e Atividades">
      <div className="flex justify-end mb-6">
        <Button onClick={openCreate} className="text-white"
          style={{ background: "oklch(0.52 0.14 35)", border: "none" }}>
          <Plus size={16} className="mr-2" />
          Novo Evento
        </Button>
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 rounded-xl animate-pulse"
              style={{ background: "oklch(0.17 0.03 30)" }}></div>
          ))}
        </div>
      ) : events && events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((event) => {
            const statusInfo = statusColors[event.status] || statusColors.ativo;
            return (
              <div key={event.id} className="rounded-xl p-5"
                style={{ background: "oklch(0.17 0.03 30)", border: "1px solid oklch(0.22 0.04 30)" }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white truncate" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {event.title}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block"
                      style={{ background: statusInfo.bg, color: statusInfo.color }}>
                      {statusInfo.label}
                    </span>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full ml-2 flex-shrink-0"
                    style={{ background: "oklch(0.22 0.06 35)", color: "oklch(0.72 0.10 35)" }}>
                    {activityLabels[event.activityType] || "Outro"}
                  </span>
                </div>

                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Calendar size={12} style={{ color: "oklch(0.72 0.12 75)" }} />
                    {new Date(event.eventDate).toLocaleDateString("pt-BR", {
                      day: "2-digit", month: "short", year: "numeric"
                    })}
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <MapPin size={12} style={{ color: "oklch(0.72 0.12 75)" }} />
                      {event.location}
                    </div>
                  )}
                  {event.maxSpots && (
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Users size={12} style={{ color: "oklch(0.72 0.12 75)" }} />
                      {event.maxSpots} vagas
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/admin/eventos/${event.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-xs"
                      style={{ borderColor: "oklch(0.30 0.04 30)", color: "oklch(0.72 0.12 75)", background: "transparent" }}>
                      <Eye size={12} className="mr-1" />
                      Ver Inscritos
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => openEdit(event)}
                    style={{ borderColor: "oklch(0.30 0.04 30)", color: "oklch(0.65 0.01 60)", background: "transparent" }}>
                    <Pencil size={12} />
                  </Button>
                  {event.status === "ativo" && (
                    <Button variant="outline" size="sm" onClick={() => handleClose(event.id)}
                      style={{ borderColor: "oklch(0.30 0.04 30)", color: "oklch(0.70 0.15 25)", background: "transparent" }}>
                      <XCircle size={12} />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 rounded-xl"
          style={{ background: "oklch(0.17 0.03 30)", border: "1px solid oklch(0.22 0.04 30)" }}>
          <Calendar size={32} className="mx-auto mb-3 text-gray-600" />
          <p className="text-gray-500">Nenhum evento cadastrado.</p>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto"
          style={{ background: "oklch(0.17 0.03 30)", border: "1px solid oklch(0.25 0.04 30)", color: "white" }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "'Playfair Display', serif", color: "white" }}>
              {editTarget ? "Editar Evento" : "Novo Evento"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-gray-300 text-sm">Título *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Nome do evento" required
                style={{ background: "oklch(0.13 0.02 30)", border: "1px solid oklch(0.25 0.04 30)", color: "white" }} />
            </div>
            <div>
              <Label className="text-gray-300 text-sm">Descrição</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Descrição do evento" rows={3}
                style={{ background: "oklch(0.13 0.02 30)", border: "1px solid oklch(0.25 0.04 30)", color: "white" }} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-gray-300 text-sm">Data de início *</Label>
                <Input type="datetime-local" value={form.eventDate}
                  onChange={(e) => setForm({ ...form, eventDate: e.target.value })} required
                  style={{ background: "oklch(0.13 0.02 30)", border: "1px solid oklch(0.25 0.04 30)", color: "white" }} />
              </div>
              <div>
                <Label className="text-gray-300 text-sm">Data de encerramento</Label>
                <Input type="datetime-local" value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  style={{ background: "oklch(0.13 0.02 30)", border: "1px solid oklch(0.25 0.04 30)", color: "white" }} />
              </div>
            </div>
            <div>
              <Label className="text-gray-300 text-sm">Local</Label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Local do evento"
                style={{ background: "oklch(0.13 0.02 30)", border: "1px solid oklch(0.25 0.04 30)", color: "white" }} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-gray-300 text-sm">Vagas (opcional)</Label>
                <Input type="number" value={form.maxSpots}
                  onChange={(e) => setForm({ ...form, maxSpots: e.target.value })}
                  placeholder="Ex: 30"
                  style={{ background: "oklch(0.13 0.02 30)", border: "1px solid oklch(0.25 0.04 30)", color: "white" }} />
              </div>
              <div>
                <Label className="text-gray-300 text-sm">Frente de atuação</Label>
                <Select value={form.activityType}
                  onValueChange={(v: any) => setForm({ ...form, activityType: v })}>
                  <SelectTrigger style={{ background: "oklch(0.13 0.02 30)", border: "1px solid oklch(0.25 0.04 30)", color: "white" }}>
                    <SelectValue />
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
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}
                style={{ borderColor: "oklch(0.30 0.04 30)", color: "oklch(0.60 0.01 60)", background: "transparent" }}>
                Cancelar
              </Button>
              <Button type="submit" className="text-white"
                style={{ background: "oklch(0.52 0.14 35)", border: "none" }}
                disabled={createMutation.isPending || updateMutation.isPending}>
                {editTarget ? "Salvar" : "Criar Evento"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
