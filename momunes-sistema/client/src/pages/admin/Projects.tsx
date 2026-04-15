import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { AdminLayout } from "./Dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, FolderOpen, Pencil, Trash2, Calendar } from "lucide-react";
import { toast } from "sonner";

const areaLabels: Record<string, string> = {
  acolhimento: "Acolhimento",
  educacao: "Educação",
  empoderamento: "Empoderamento",
  atuacao_politica: "Atuação Política",
  outro: "Outro",
};

const statusLabels: Record<string, { label: string; bg: string; color: string }> = {
  planejamento: { label: "Planejamento", bg: "oklch(0.20 0.04 280)", color: "oklch(0.70 0.10 280)" },
  em_andamento: { label: "Em andamento", bg: "oklch(0.18 0.06 145)", color: "oklch(0.72 0.12 145)" },
  concluido: { label: "Concluído", bg: "oklch(0.22 0.06 75)", color: "oklch(0.72 0.12 75)" },
  suspenso: { label: "Suspenso", bg: "oklch(0.20 0.06 25)", color: "oklch(0.70 0.15 25)" },
};

const emptyForm = {
  name: "",
  description: "",
  area: "outro" as const,
  status: "planejamento" as const,
  startDate: "",
  endDate: "",
  responsibleName: "",
  notes: "",
};

export default function AdminProjects() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const utils = trpc.useUtils();
  const { data: projects, isLoading } = trpc.projects.list.useQuery();

  const createMutation = trpc.projects.create.useMutation({
    onSuccess: () => {
      toast.success("Projeto cadastrado com sucesso!");
      utils.projects.list.invalidate();
      setDialogOpen(false);
      setForm(emptyForm);
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.projects.update.useMutation({
    onSuccess: () => {
      toast.success("Projeto atualizado!");
      utils.projects.list.invalidate();
      setDialogOpen(false);
      setEditTarget(null);
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = trpc.projects.delete.useMutation({
    onSuccess: () => {
      toast.success("Projeto removido.");
      utils.projects.list.invalidate();
      setDeleteConfirm(null);
    },
    onError: (err) => toast.error(err.message),
  });

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (p: any) => {
    setEditTarget(p);
    setForm({
      name: p.name,
      description: p.description || "",
      area: p.area,
      status: p.status,
      startDate: p.startDate ? new Date(p.startDate).toISOString().slice(0, 10) : "",
      endDate: p.endDate ? new Date(p.endDate).toISOString().slice(0, 10) : "",
      responsibleName: p.responsibleName || "",
      notes: p.notes || "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Nome é obrigatório."); return; }
    const data = {
      name: form.name,
      description: form.description || undefined,
      area: form.area,
      status: form.status,
      startDate: form.startDate || undefined,
      endDate: form.endDate || undefined,
      responsibleName: form.responsibleName || undefined,
      notes: form.notes || undefined,
    };
    if (editTarget) {
      updateMutation.mutate({ id: editTarget.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <AdminLayout title="Projetos">
      <div className="flex justify-end mb-6">
        <Button onClick={openCreate} className="text-white"
          style={{ background: "oklch(0.52 0.14 35)", border: "none" }}>
          <Plus size={16} className="mr-2" />
          Novo Projeto
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-xl animate-pulse"
              style={{ background: "oklch(0.17 0.03 30)" }}></div>
          ))}
        </div>
      ) : projects && projects.length > 0 ? (
        <div className="space-y-3">
          {projects.map((project) => {
            const statusInfo = statusLabels[project.status] || statusLabels.planejamento;
            return (
              <div key={project.id} className="rounded-xl p-5"
                style={{ background: "oklch(0.17 0.03 30)", border: "1px solid oklch(0.22 0.04 30)" }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {project.name}
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: statusInfo.bg, color: statusInfo.color }}>
                        {statusInfo.label}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: "oklch(0.22 0.06 35)", color: "oklch(0.72 0.10 35)" }}>
                        {areaLabels[project.area] || "Outro"}
                      </span>
                    </div>
                    {project.description && (
                      <p className="text-sm text-gray-400 mb-2 line-clamp-2">{project.description}</p>
                    )}
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                      {project.responsibleName && (
                        <span>Responsável: <span className="text-gray-300">{project.responsibleName}</span></span>
                      )}
                      {project.startDate && (
                        <span className="flex items-center gap-1">
                          <Calendar size={10} />
                          Início: {new Date(project.startDate).toLocaleDateString("pt-BR")}
                        </span>
                      )}
                      {project.endDate && (
                        <span>Término: {new Date(project.endDate).toLocaleDateString("pt-BR")}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(project)}
                      style={{ color: "oklch(0.72 0.12 75)" }}>
                      <Pencil size={14} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(project.id)}
                      style={{ color: "oklch(0.70 0.20 25)" }}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 rounded-xl"
          style={{ background: "oklch(0.17 0.03 30)", border: "1px solid oklch(0.22 0.04 30)" }}>
          <FolderOpen size={32} className="mx-auto mb-3 text-gray-600" />
          <p className="text-gray-500">Nenhum projeto cadastrado.</p>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto"
          style={{ background: "oklch(0.17 0.03 30)", border: "1px solid oklch(0.25 0.04 30)", color: "white" }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "'Playfair Display', serif", color: "white" }}>
              {editTarget ? "Editar Projeto" : "Novo Projeto"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-gray-300 text-sm">Nome do projeto *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nome do projeto" required
                style={{ background: "oklch(0.13 0.02 30)", border: "1px solid oklch(0.25 0.04 30)", color: "white" }} />
            </div>
            <div>
              <Label className="text-gray-300 text-sm">Descrição</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Descrição do projeto" rows={3}
                style={{ background: "oklch(0.13 0.02 30)", border: "1px solid oklch(0.25 0.04 30)", color: "white" }} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-gray-300 text-sm">Área de atuação</Label>
                <Select value={form.area} onValueChange={(v: any) => setForm({ ...form, area: v })}>
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
              <div>
                <Label className="text-gray-300 text-sm">Status</Label>
                <Select value={form.status} onValueChange={(v: any) => setForm({ ...form, status: v })}>
                  <SelectTrigger style={{ background: "oklch(0.13 0.02 30)", border: "1px solid oklch(0.25 0.04 30)", color: "white" }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planejamento">Planejamento</SelectItem>
                    <SelectItem value="em_andamento">Em andamento</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                    <SelectItem value="suspenso">Suspenso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-gray-300 text-sm">Responsável</Label>
              <Input value={form.responsibleName} onChange={(e) => setForm({ ...form, responsibleName: e.target.value })}
                placeholder="Nome do responsável"
                style={{ background: "oklch(0.13 0.02 30)", border: "1px solid oklch(0.25 0.04 30)", color: "white" }} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-gray-300 text-sm">Data de início</Label>
                <Input type="date" value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  style={{ background: "oklch(0.13 0.02 30)", border: "1px solid oklch(0.25 0.04 30)", color: "white" }} />
              </div>
              <div>
                <Label className="text-gray-300 text-sm">Data de término</Label>
                <Input type="date" value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  style={{ background: "oklch(0.13 0.02 30)", border: "1px solid oklch(0.25 0.04 30)", color: "white" }} />
              </div>
            </div>
            <div>
              <Label className="text-gray-300 text-sm">Notas</Label>
              <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Observações adicionais" rows={2}
                style={{ background: "oklch(0.13 0.02 30)", border: "1px solid oklch(0.25 0.04 30)", color: "white" }} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}
                style={{ borderColor: "oklch(0.30 0.04 30)", color: "oklch(0.60 0.01 60)", background: "transparent" }}>
                Cancelar
              </Button>
              <Button type="submit" className="text-white"
                style={{ background: "oklch(0.52 0.14 35)", border: "none" }}
                disabled={createMutation.isPending || updateMutation.isPending}>
                {editTarget ? "Salvar" : "Cadastrar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent style={{ background: "oklch(0.17 0.03 30)", border: "1px solid oklch(0.25 0.04 30)", color: "white" }}>
          <DialogHeader>
            <DialogTitle style={{ color: "white" }}>Confirmar exclusão</DialogTitle>
          </DialogHeader>
          <p className="text-gray-400">Tem certeza que deseja remover este projeto?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}
              style={{ borderColor: "oklch(0.30 0.04 30)", color: "oklch(0.60 0.01 60)", background: "transparent" }}>
              Cancelar
            </Button>
            <Button onClick={() => deleteConfirm && deleteMutation.mutate({ id: deleteConfirm })}
              style={{ background: "oklch(0.50 0.20 25)", border: "none", color: "white" }}
              disabled={deleteMutation.isPending}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
