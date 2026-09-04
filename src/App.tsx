import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { NewScanView } from './components/NewScanView';
import { InspectionDetailView } from './components/InspectionDetailView';
import { HistoryView } from './components/HistoryView';
import { ProductRepositoryView } from './components/ProductRepositoryView';
import { RuleDatabaseView } from './components/RuleDatabaseView';
import { AnalyticsView } from './components/AnalyticsView';
import { ReportModal } from './components/ReportModal';
import { Inspection, LegalRule, ProductSummary, UserRole, ProductCategory } from './types';
import { INITIAL_INSPECTIONS, INITIAL_PRODUCTS } from './data/initialInspections';
import { INITIAL_LEGAL_RULES } from './data/rulesData';

const ALL_CATEGORIES: ProductCategory[] = [
  'Packaged Food & Groceries',
  'Personal Care & Cosmetics',
  'Beverages & Liquids',
  'Household & Cleaning',
  'Electronics & Appliances',
  'Pharmaceuticals & Health',
  'General Commodity',
];

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>('inspector');

  // State collections
  const [inspections, setInspections] = useState<Inspection[]>(INITIAL_INSPECTIONS);
  const [products, setProducts] = useState<ProductSummary[]>(INITIAL_PRODUCTS);
  const [rules, setRules] = useState<LegalRule[]>(INITIAL_LEGAL_RULES);

  // Active detailed inspection view
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Backend / Server status
  const [serverStatus, setServerStatus] = useState<'online' | 'analyzing' | 'idle'>('online');
  const [hasGeminiKey, setHasGeminiKey] = useState(false);

  // Fetch initial data from server if reachable
  useEffect(() => {
    async function initData() {
      try {
        const healthRes = await fetch('/api/health');
        if (healthRes.ok) {
          const health = await healthRes.json();
          setHasGeminiKey(health.hasGeminiKey);
        }

        const [inspRes, prodRes, rulesRes] = await Promise.all([
          fetch('/api/inspections'),
          fetch('/api/products'),
          fetch('/api/rules'),
        ]);

        if (inspRes.ok) {
          const data = await inspRes.json();
          if (Array.isArray(data) && data.length > 0) setInspections(data);
        }
        if (prodRes.ok) {
          const data = await prodRes.json();
          if (Array.isArray(data) && data.length > 0) setProducts(data);
        }
        if (rulesRes.ok) {
          const data = await rulesRes.json();
          if (Array.isArray(data) && data.length > 0) setRules(data);
        }
      } catch (err) {
        console.warn('Using client baseline state:', err);
      }
    }
    initData();
  }, []);

  const handleSelectInspection = (item: Inspection) => {
    setSelectedInspection(item);
  };

  const handleAnalysisComplete = (newInspection: Inspection) => {
    setInspections((prev) => [newInspection, ...prev]);
    setSelectedInspection(newInspection);
  };

  const handleUpdateInspection = async (updated: Inspection) => {
    setInspections((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    setSelectedInspection(updated);

    try {
      await fetch(`/api/inspections/${updated.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: updated.status,
          reviewNotes: updated.reviewNotes,
          reviewedBy: updated.reviewedBy,
          declarations: updated.declarations,
        }),
      });
    } catch (err) {
      console.warn('Could not persist update to backend:', err);
    }
  };

  const handleToggleRule = async (ruleId: string) => {
    const target = rules.find((r) => r.id === ruleId);
    if (!target) return;

    const updatedRule = { ...target, isActive: !target.isActive };
    setRules((prev) => prev.map((r) => (r.id === ruleId ? updatedRule : r)));

    try {
      await fetch('/api/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRule),
      });
    } catch (err) {
      console.warn('Failed to update rule on server:', err);
    }
  };

  const pendingReviewsCount = inspections.filter((i) => i.status === 'NEEDS_REVIEW').length;

  return (
    <div className="min-h-screen bg-[#F1F3F6] text-slate-900 flex flex-col font-sans antialiased">
      {/* Top Application Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onNewScanClick={() => {
          setSelectedInspection(null);
          setActiveTab('new-scan');
        }}
        serverStatus={serverStatus}
        hasGeminiKey={hasGeminiKey}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          onTabSelect={(tab) => {
            setSelectedInspection(null);
            setActiveTab(tab);
          }}
          currentRole={currentRole}
          pendingReviewsCount={pendingReviewsCount}
        />

        {/* Dynamic Center Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F1F3F6]">
          {selectedInspection ? (
            <InspectionDetailView
              inspection={selectedInspection}
              onBack={() => setSelectedInspection(null)}
              onUpdateInspection={handleUpdateInspection}
              onOpenReport={() => setIsReportModalOpen(true)}
            />
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardView
                  inspections={inspections}
                  onSelectInspection={handleSelectInspection}
                  onNewInspectionClick={() => setActiveTab('new-scan')}
                />
              )}

              {activeTab === 'new-scan' && (
                <NewScanView
                  onAnalysisComplete={handleAnalysisComplete}
                  categories={ALL_CATEGORIES}
                />
              )}

              {activeTab === 'history' && (
                <HistoryView
                  inspections={inspections}
                  onSelectInspection={handleSelectInspection}
                  categories={ALL_CATEGORIES}
                />
              )}

              {activeTab === 'products' && (
                <ProductRepositoryView
                  products={products}
                  onSelectProductFilter={(productName) => {
                    setActiveTab('history');
                  }}
                />
              )}

              {activeTab === 'rules' && (
                <RuleDatabaseView
                  rules={rules}
                  onToggleRule={handleToggleRule}
                  currentRole={currentRole}
                />
              )}

              {activeTab === 'analytics' && (
                <AnalyticsView inspections={inspections} />
              )}
            </>
          )}
        </main>
      </div>

      {/* Official Legal Metrology Inspection Report Modal */}
      {isReportModalOpen && selectedInspection && (
        <ReportModal
          inspection={selectedInspection}
          onClose={() => setIsReportModalOpen(false)}
        />
      )}
    </div>
  );
}

