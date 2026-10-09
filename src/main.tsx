import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import './css/reset.css'
import './css/index.css';
import Index from './Index';
import App from './App';
import About from './About';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WindowHistoryAdapter } from "use-query-params/adapters/window";
import { QueryParamProvider } from "use-query-params";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryParamProvider adapter={WindowHistoryAdapter}>
      <div className="app">
        <BrowserRouter basename="/hacks/paceplayground/">
          <Routes>
            <Route path="/" element={<Index />} >
              <Route index path="/" element={<App />} />
              <Route path="about" element={<About />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </QueryParamProvider>
  </StrictMode>
);