import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import EarningsDisclaimer from "./pages/EarningsDisclaimer";
import TradingDisclaimer from "./pages/TradingDisclaimer";
import About from "./pages/About";
import Results from "./pages/Results";
import Calculator from "./pages/Calculator";
import Investing101 from "./pages/Investing101";
import ComingSoon from "./pages/ComingSoon";
import StocksAndIndex from "./pages/StocksAndIndex";
import TradingTools from "./pages/TradingTools";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/about"} component={About} />
      <Route path={"/results"} component={Results} />
      <Route path={"/calculator"} component={Calculator} />
      <Route path={"/investing-101"} component={Investing101} />
      <Route path={"/stocks-and-index"} component={StocksAndIndex} />
      <Route path={"/trading-tools"} component={TradingTools} />
      <Route path={"/options-trading"}>
        <ComingSoon
          title="Options Trading"
          subtitle="Learn the fundamentals of options trading, from basic calls and puts to advanced strategies — coming soon."
        />
      </Route>
      <Route path={"/privacy-policy"} component={PrivacyPolicy} />
      <Route path={"/terms-of-use"} component={TermsOfUse} />
      <Route path={"/earnings-disclaimer"} component={EarningsDisclaimer} />
      <Route path={"/trading-disclaimer"} component={TradingDisclaimer} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <TooltipProvider>
          <Toaster richColors />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
