import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/contexts/theme-context";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

// Pages
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import ArticlePage from "@/pages/article-page";
import CategoryPage from "@/pages/category-page";
import SearchPage from "@/pages/search-page";
import AdminDashboard from "@/pages/admin/admin-dashboard";
import AdminArticles from "@/pages/admin/admin-articles";
import AdminMedia from "@/pages/admin/admin-media";
import AdminArticleEdit from "@/pages/admin/admin-article-edit";
import AdminAccounts from "@/pages/admin/admin-accounts";
import AdminHistoricalFigures from "@/pages/admin/admin-historical-figures";
import AdminHistoricalEvents from "@/pages/admin/admin-historical-events";
import AdminDynasties from "@/pages/admin/admin-dynasties";
import AdminDynastyEdit from "@/pages/admin/admin-dynasty-edit";
import AdminHistoricalFigureEdit from "@/pages/admin/admin-historical-figure-edit";
import AdminHistoricalEventEdit from "@/pages/admin/admin-historical-event-edit";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/article/:id" component={ArticlePage} />
      <Route path="/category/:category" component={CategoryPage} />
      <Route path="/search" component={SearchPage} />
      <Route path="/auth" component={AuthPage} />
      
      {/* Protected Admin Routes */}
      <ProtectedRoute path="/admin" component={AdminDashboard} />
      <ProtectedRoute path="/admin/articles" component={AdminArticles} />
      <ProtectedRoute path="/admin/media" component={AdminMedia} />
      <ProtectedRoute path="/admin/articles/new" component={AdminArticleEdit} />
      <ProtectedRoute path="/admin/articles/edit/:id" component={AdminArticleEdit} />
      <ProtectedRoute path="/admin/accounts" component={AdminAccounts} />
      <ProtectedRoute path="/admin/historical-figures" component={AdminHistoricalFigures} />
      <ProtectedRoute path="/admin/historical-figures/new" component={AdminHistoricalFigureEdit} />
      <ProtectedRoute path="/admin/historical-figures/edit/:id" component={AdminHistoricalFigureEdit} />
      <ProtectedRoute path="/admin/historical-events" component={AdminHistoricalEvents} />
      <ProtectedRoute path="/admin/historical-events/new" component={AdminHistoricalEventEdit} />
      <ProtectedRoute path="/admin/historical-events/edit/:id" component={AdminHistoricalEventEdit} />
      <ProtectedRoute path="/admin/dynasties" component={AdminDynasties} />
      <ProtectedRoute path="/admin/dynasties/new" component={AdminDynastyEdit} />
      <ProtectedRoute path="/admin/dynasties/edit/:id" component={AdminDynastyEdit} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <Router />
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
