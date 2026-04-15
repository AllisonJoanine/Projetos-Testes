import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/eventos", label: "Eventos" },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Lato', sans-serif" }}>
      {/* Navbar */}
      <header className="sticky top-0 z-50 shadow-md" style={{ background: "oklch(0.15 0.02 30)" }}>
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ background: "linear-gradient(135deg, oklch(0.52 0.14 35), oklch(0.72 0.12 75))" }}>
                M
              </div>
              <div>
                <div className="font-bold text-white text-sm leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  MOMUNES
                </div>
                <div className="text-xs leading-tight" style={{ color: "oklch(0.72 0.12 75)" }}>
                  Movimento de Mulheres Negras
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-yellow-400 ${
                    location === link.href ? "text-yellow-400" : "text-gray-300"
                  }`}
                  style={{ color: location === link.href ? "oklch(0.72 0.12 75)" : "oklch(0.80 0.01 60)" }}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/admin">
                <Button size="sm" className="text-white font-semibold"
                  style={{ background: "oklch(0.52 0.14 35)", border: "none" }}>
                  Área Administrativa
                </Button>
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Nav */}
          {menuOpen && (
            <div className="md:hidden py-4 border-t" style={{ borderColor: "oklch(0.25 0.04 30)" }}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-2 text-sm font-medium text-gray-300 hover:text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/admin" onClick={() => setMenuOpen(false)}>
                <div className="mt-3 inline-block px-4 py-2 rounded text-white text-sm font-semibold"
                  style={{ background: "oklch(0.52 0.14 35)" }}>
                  Área Administrativa
                </div>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="text-white py-12" style={{ background: "oklch(0.12 0.02 30)" }}>
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ background: "linear-gradient(135deg, oklch(0.52 0.14 35), oklch(0.72 0.12 75))" }}>
                  M
                </div>
                <div>
                  <div className="font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.72 0.12 75)" }}>
                    MOMUNES
                  </div>
                  <div className="text-xs text-gray-400">Desde 1997</div>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Movimento de Mulheres Negras de Sorocaba. Enfrentando o racismo, sexismo e desigualdades sociais desde 1997.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4" style={{ color: "oklch(0.72 0.12 75)", fontFamily: "'Playfair Display', serif" }}>
                Frentes de Atuação
              </h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Acolhimento Social</li>
                <li>Educação e Cultura</li>
                <li>Empoderamento e Cidadania</li>
                <li>Atuação Política</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4" style={{ color: "oklch(0.72 0.12 75)", fontFamily: "'Playfair Display', serif" }}>
                Contato
              </h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Sorocaba — SP</li>
                <li>Fundado em 1997</li>
                <li>Organização sem fins lucrativos</li>
              </ul>
            </div>
          </div>

          <div className="divider-gold mb-6"></div>

          <div className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} MOMUNES — Movimento de Mulheres Negras de Sorocaba. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
