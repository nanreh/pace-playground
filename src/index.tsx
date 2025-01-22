import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import './css/reset.css'
import './css/index.css';
import App from './App';
import About from './About';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WindowHistoryAdapter } from "use-query-params/adapters/window";
import { QueryParamProvider } from "use-query-params";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryParamProvider adapter={WindowHistoryAdapter}>
      <div className="app">
        <BrowserRouter basename="/hacks/paceplayground/">
          <Routes>
            <Route index element={<App/>}/>
            <Route path="about" element={<About/>}/>
          </Routes>
        </BrowserRouter>
      </div>
    </QueryParamProvider>
  </StrictMode>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
