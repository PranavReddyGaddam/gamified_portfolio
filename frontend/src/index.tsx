import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Every route renders the same page: the detail modal and its full
            screen state are driven by the URL, so the panel animates between
            them instead of one view being swapped for another. */}
        <Route path="/project/:projectId/full" element={<App />} />
        <Route path="/project/:projectId" element={<App />} />
        <Route path="/" element={<App />} />
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
    {/* Vercel Web Analytics (unique visitors and page views, no cookies) and
        Speed Insights (Core Web Vitals from real visits). Both only report
        from the deployed site, not from localhost. */}
    <Analytics />
    <SpeedInsights />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
