import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { ThemeProvider } from "./lib/theme-provider";
import { Route, RouterProvider, Switch } from "./lib/router";
import { SiteHeader } from "./components/site-header";
import { DispatchWidget } from "./components/dispatch-widget";
import LandingPage from "@/pages/landing";
import IntelligencePage from "@/pages/intelligence";

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider>
          <div className="min-h-screen bg-background text-foreground">
            <SiteHeader />
            <Switch>
              <Route path="/intelligence/:slug" component={IntelligencePage} />
              <Route path="/intelligence" component={IntelligencePage} />
              <Route path="/" component={LandingPage} />
              <Route component={LandingPage} />
            </Switch>
            <DispatchWidget />
          </div>
        </RouterProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
