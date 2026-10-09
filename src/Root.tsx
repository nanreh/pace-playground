import Index from "./Index";
import About from "./About";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WindowHistoryAdapter } from "use-query-params/adapters/window";
import { QueryParamProvider } from "use-query-params";

// The whole application: providers, router and pages.
const Root = () => {
  return (
    <QueryParamProvider adapter={WindowHistoryAdapter}>
      <div className="app">
        <BrowserRouter basename="/hacks/paceplayground/">
          <Routes>
            <Route path="/" element={<Index />}>
              {/* the splits are rendered by Index itself, so they can stay alive behind other pages */}
              <Route index element={null} />
              <Route path="about" element={<About />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </QueryParamProvider>
  );
};

export default Root;
