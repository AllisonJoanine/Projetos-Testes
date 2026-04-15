import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Site Público
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Register from "./pages/Register";

// Painel Admin
import AdminDashboard from "./pages/admin/Dashboard";
import AdminParticipants from "./pages/admin/Participants";
import AdminEvents from "./pages/admin/Events";
import AdminEventDetail from "./pages/admin/EventDetail";
import AdminProjects from "./pages/admin/Projects";

function Router() {
  return (
    <Switch>
      {/* Site Público */}
      <Route path="/" component={Home} />
      <Route path="/eventos" component={Events} />
      <Route path="/eventos/:id" component={EventDetail} />
      <Route path="/inscricao/:id" component={Register} />

      {/* Painel Administrativo */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/participantes" component={AdminParticipants} />
      <Route path="/admin/eventos" component={AdminEvents} />
      <Route path="/admin/eventos/:id" component={AdminEventDetail} />
      <Route path="/admin/projetos" component={AdminProjects} />

      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
