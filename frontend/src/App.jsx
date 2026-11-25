import React from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import LandingPage from './pages/LandingPage';
import DashboardOverview from './pages/DashboardOverview';
import DocumentsPage from './pages/DocumentsPage';
import KnowledgeGraphPage from './pages/KnowledgeGraphPage';
import CrossDocumentDiscoveryPage from './pages/CrossDocumentDiscoveryPage';
import ExplainConnectionPage from './pages/ExplainConnectionPage';
import KnowledgeGapsPage from './pages/KnowledgeGapsPage';
import AssistantPage from './pages/AssistantPage';
import SettingsPage from './pages/SettingsPage';

function DashboardLayout() {
  const location = useLocation();

  const getPageTitle = (path) => {
    if (path === '/app') return 'Overview & Analytics';
    if (path.includes('documents')) return 'Document Management';
    if (path.includes('graph')) return 'Interactive Knowledge Graph';
    if (path.includes('discovery')) return 'Cross-Document Discovery';
    if (path.includes('explain')) return 'Explain Connection Pathway';
    if (path.includes('gaps')) return 'Knowledge Gap Auditing';
    if (path.includes('assistant')) return 'AI Knowledge Assistant';
    if (path.includes('settings')) return 'Settings & Credentials';
    return 'Knowledge Workspace';
  };

  return (
    <div className="flex min-h-screen bg-[#070a12] text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header pageTitle={getPageTitle(location.pathname)} />
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app" element={<DashboardLayout />}>
        <Route index element={<DashboardOverview />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="graph" element={<KnowledgeGraphPage />} />
        <Route path="discovery" element={<CrossDocumentDiscoveryPage />} />
        <Route path="explain" element={<ExplainConnectionPage />} />
        <Route path="gaps" element={<KnowledgeGapsPage />} />
        <Route path="assistant" element={<AssistantPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
