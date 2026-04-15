import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { AdminLayout } from "./Dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Search, Pencil, Trash2, User } from "lucide-react";
import { toast } from "sonner";

type Participant = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  createdAt: Date;
};

const emptyForm = { name: "", email: "", phone: "", address: "", notes: "" };

export default function AdminParticipants() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Participant | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const utils = trpc.useUtils();
  const { data: participants, isLoading } = trpc.participants.list.useQuery({ search });

  const createMutation = trpc.participants.create.useMutation({
    onSuccess: () => {
      toast.success("Participante cadastrado com sucesso!");
      utils.participants.list.invalidate();
      setDialogOpen(false);
      setForm(emptyForm);
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.participants.update.useMutation({
    onSuccess: () => {
      toast.success("Participante atualizado!");
      utils.participants.list.invalidate();
      setDialogOpen(false);
      setEditTarget(null);
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = trpc.participants.delete.useMutation({
    onSuccess: () => {
      toast.success("Participante removido.");
      utils.participants.list.invalidate();
      setDeleteConfirm(null);
    },
    onError: (err) => toast.error(err.message),
  });

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (p: Participant) => {
    setEditTarget(p);
    setForm({
      name: p.name,
      email: p.email || "",
      phone: p.phone || "",
      address: p.address || "",
      notes: p.notes || "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Nome é obrigatório."); return; }
    if (editTarget) {
      updateMutation.mutate({ id: editTarget.id, ...form });
    } else {
      createMutation.mutate(form);
    }
  };

  return (
    <AdminLayout title="Participantes">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar participante..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            style={{ background: "oklch(0.17 0.03 30)", border: "1px solid oklch(0.25 0.04 30)", color: "white" }}
          />
        </div>
        <Button onClick={openCreate} className="text-white"
          style={{ background: "oklch(0.52 0.14 35)", border: "none" }}>
          <Plus size={16} className="mr-2" />
          Novo Participante
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden"
        style={{ background: "oklch(0.17 0.03 30)", border: "1px solid oklch(0.22 0.04 30)" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid oklch(0.22 0.04 30)" }}>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">Nome</th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">E-mail</th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">Telefone</th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">Cadastro</th>
                <th className="text-right px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">Carregando...</td>
                </tr>
              ) : participants && participants.length > 0 ? (
                participants.map((p) => (
                  <tr key={p.id} style={{ borderBottom: "1px solid oklch(0.20 0.03 30)" }}
                    className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ background: "oklch(0.52 0.14 35)" }}>
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-white">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{p.email || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{p.phone || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(p.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(p)}
                          style={{ color: "oklch(0.72 0.12 75)" }}>
                          <Pencil size={14} />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(p.id)}
                          style={{ color: "oklch(0.70 0.20 25)" }}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <User size={32} className="mx-auto mb-3 text-gray-600" />
                    <p className="text-gray-500">Nenhum participante encontrado.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent style={{ background: "oklch(0.17 0.03 30)", border: "1px solid oklch(0.25 0.04 30)", color: "white" }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "'Playfair Display', serif", color: "white" }}>
              {editTarget ? "Editar Participante" : "Novo Participante"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-gray-300 text-sm">Nome completo *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nome" required
                style={{ background: "oklch(0.13 0.02 30)", border: "1px solid oklch(0.25 0.04 30)", color: "white" }} />
            </div>
            <div>
              <Label className="text-gray-300 text-sm">E-mail</Label>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                type="email" placeholder="email@exemplo.com"
                style={{ background: "oklch(0.13 0.02 30)", border: "1px solid oklch(0.25 0.04 30)", color: "white" }} />
            </div>
            <div>
              <Label className="text-gray-300 text-sm">Telefone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="(15) 99999-9999"
                style={{ background: "oklch(0.13 0.02 30)", border: "1px solid oklch(0.25 0.04 30)", color: "white" }} />
            </div>
            <div>
              <Label className="text-gray-300 text-sm">Endereço</Label>
              <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Endereço"
                style={{ background: "oklch(0.13 0.02 30)", border: "1px solid oklch(0.25 0.04 30)", color: "white" }} />
            </div>
            <div>
              <Label className="text-gray-300 text-sm">Observações</Label>
              <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Notas adicionais" rows={2}
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
          <p className="text-gray-400">Tem certeza que deseja remover este participante? Esta ação não pode ser desfeita.</p>
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
