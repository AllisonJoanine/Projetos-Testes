import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Users, Calendar, ClipboardList, FolderOpen, LogOut, Menu, X, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: ClipboardList },
  { href: "/admin/participantes", label: "Participantes", icon: Users },
  { href: "/admin/eventos", label: "Eventos", icon: Calendar },
  { href: "/admin/projetos", label: "Projetos", icon: FolderOpen },
];

function AdminLayout({ children, title }: { children: React.ReactNode; title: string }) {
  const { user, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "oklch(0.13 0.02 30)" }}>
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin mx-auto mb-4"
            style={{ borderColor: "oklch(0.72 0.12 75)", borderTopColor: "transparent" }}></div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "oklch(0.13 0.02 30)" }}>
        <div className="text-center max-w-sm p-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: "linear-gradient(135deg, oklch(0.52 0.14 35), oklch(0.72 0.12 75))" }}>
            <span className="text-white text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>M</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Área Administrativa
          </h2>
          <p className="text-gray-400 mb-6">Acesso restrito a gestores do MOMUNES. Faça login para continuar.</p>
          <a href={getLoginUrl()}>
            <Button className="w-full text-white font-semibold"
              style={{ background: "oklch(0.52 0.14 35)", border: "none" }}>
              Entrar com Manus
            </Button>
          </a>
          <Link href="/">
            <button className="mt-4 text-sm text-gray-500 hover:text-gray-300">← Voltar ao site</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: "oklch(0.13 0.02 30)" }}>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "oklch(0.10 0.02 30)", borderRight: "1px solid oklch(0.20 0.04 30)" }}
      >
        {/* Logo */}
        <div className="p-6" style={{ borderBottom: "1px solid oklch(0.20 0.04 30)" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
              style={{ background: "linear-gradient(135deg, oklch(0.52 0.14 35), oklch(0.72 0.12 75))" }}>
              M
            </div>
            <div>
              <div className="font-bold text-white text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>
                MOMUNES
              </div>
              <div className="text-xs" style={{ color: "oklch(0.72 0.12 75)" }}>Painel Admin</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = window.location.pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer"
                  style={{
                    background: isActive ? "oklch(0.52 0.14 35 / 0.2)" : "transparent",
                    color: isActive ? "oklch(0.72 0.12 75)" : "oklch(0.70 0.01 60)",
                    borderLeft: isActive ? "3px solid oklch(0.72 0.12 75)" : "3px solid transparent",
                  }}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon size={18} />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4" style={{ borderTop: "1px solid oklch(0.20 0.04 30)" }}>
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: "oklch(0.52 0.14 35)" }}>
              {user.name?.charAt(0) || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">{user.name || "Admin"}</div>
              <div className="text-xs text-gray-500 truncate">{user.email || ""}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/" className="flex-1">
              <Button variant="outline" size="sm" className="w-full text-xs"
                style={{ borderColor: "oklch(0.30 0.04 30)", color: "oklch(0.60 0.01 60)", background: "transparent" }}>
                <ExternalLink size={12} className="mr-1" />
                Site
              </Button>
            </Link>
            <Button variant="outline" size="sm" className="flex-1 text-xs"
              style={{ borderColor: "oklch(0.30 0.04 30)", color: "oklch(0.60 0.01 60)", background: "transparent" }}
              onClick={() => { logout(); }}>
              <LogOut size={12} className="mr-1" />
              Sair
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="flex items-center justify-between px-6 py-4"
          style={{ background: "oklch(0.10 0.02 30)", borderBottom: "1px solid oklch(0.20 0.04 30)" }}>
          <div className="flex items-center gap-4">
            <button className="md:hidden text-gray-400" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-lg font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              {title}
            </h1>
          </div>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

// Export AdminLayout for reuse
export { AdminLayout };

// Dashboard page
export default function AdminDashboard() {
  const { data: metrics, isLoading } = trpc.dashboard.metrics.useQuery();

  const stats = [
    {
      label: "Total de Participantes",
      value: metrics?.totalParticipants ?? 0,
      icon: Users,
      color: "oklch(0.52 0.14 35)",
      bg: "oklch(0.22 0.06 35)",
    },
    {
      label: "Eventos Ativos",
      value: metrics?.activeEvents ?? 0,
      icon: Calendar,
      color: "oklch(0.72 0.12 75)",
      bg: "oklch(0.22 0.06 70)",
    },
    {
      label: "Total de Inscrições",
      value: metrics?.totalRegistrations ?? 0,
      icon: ClipboardList,
      color: "oklch(0.38 0.10 145)",
      bg: "oklch(0.18 0.05 145)",
    },
  ];

  return (
    <AdminLayout title="Dashboard">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl p-6"
              style={{ background: "oklch(0.17 0.03 30)", border: "1px solid oklch(0.22 0.04 30)" }}>
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-medium" style={{ color: "oklch(0.65 0.01 60)" }}>
                  {stat.label}
                </div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: stat.bg }}>
                  <Icon size={20} style={{ color: stat.color }} />
                </div>
              </div>
              <div className="text-3xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                {isLoading ? "—" : stat.value.toLocaleString("pt-BR")}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Registrations */}
      <div className="rounded-xl p-6"
        style={{ background: "oklch(0.17 0.03 30)", border: "1px solid oklch(0.22 0.04 30)" }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            Inscrições Recentes
          </h2>
          <Link href="/admin/eventos">
            <button className="text-sm" style={{ color: "oklch(0.72 0.12 75)" }}>
              Ver todos →
            </button>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 rounded animate-pulse" style={{ background: "oklch(0.22 0.04 30)" }}></div>
            ))}
          </div>
        ) : metrics?.recentRegistrations && metrics.recentRegistrations.length > 0 ? (
          <div className="space-y-3">
            {metrics.recentRegistrations.map((reg) => (
              <div key={reg.id} className="flex items-center justify-between p-4 rounded-lg"
                style={{ background: "oklch(0.14 0.02 30)" }}>
                <div>
                  <div className="text-sm font-medium text-white">{reg.participantName}</div>
                  <div className="text-xs text-gray-500">
                    {reg.participantEmail || reg.participantPhone || "Sem contato"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs px-2 py-1 rounded-full"
                    style={{ background: "oklch(0.22 0.06 145)", color: "oklch(0.72 0.12 145)" }}>
                    Confirmada
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(reg.createdAt).toLocaleDateString("pt-BR")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Nenhuma inscrição registrada ainda.
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Link href="/admin/eventos">
          <div className="rounded-xl p-5 cursor-pointer transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, oklch(0.52 0.14 35), oklch(0.45 0.12 40))" }}>
            <Calendar size={24} className="text-white mb-3" />
            <div className="text-white font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              Gerenciar Eventos
            </div>
            <div className="text-white/70 text-sm mt-1">Criar, editar e encerrar eventos</div>
          </div>
        </Link>
        <Link href="/admin/participantes">
          <div className="rounded-xl p-5 cursor-pointer transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, oklch(0.38 0.10 145), oklch(0.30 0.08 145))" }}>
            <Users size={24} className="text-white mb-3" />
            <div className="text-white font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              Gerenciar Participantes
            </div>
            <div className="text-white/70 text-sm mt-1">Cadastro e listagem de participantes</div>
          </div>
        </Link>
      </div>
    </AdminLayout>
  );
}
