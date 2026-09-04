import React, { useState } from 'react';
import { BookOpen, Scale, Shield, Check, AlertCircle, ExternalLink, Sliders } from 'lucide-react';
import { LegalRule, UserRole } from '../types';

interface RuleDatabaseViewProps {
  rules: LegalRule[];
  onToggleRule: (ruleId: string) => void;
  currentRole: UserRole;
}

export const RuleDatabaseView: React.FC<RuleDatabaseViewProps> = ({
  rules,
  onToggleRule,
  currentRole,
}) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');

  const filteredRules = rules.filter(
    (r) => selectedCategoryFilter === 'ALL' || r.category === selectedCategoryFilter
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
              Statutory Rules Engine Repository
            </span>
            <span className="text-xs text-slate-400">Legal Metrology Act, 2009</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight mt-1">
            Packaged Commodities Legal Rule Repository
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Rules are dynamically applied by the AI inspection engine without hardcoding.
            {currentRole === 'admin'
              ? ' You have Administrative rights to configure and toggle active rules.'
              : ' Inspector mode (read-only legal provisions reference).'}
          </p>
        </div>
      </div>

      {/* Rules Overview Banner (Bento 3-card Row) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Rule Count</span>
          <p className="text-3xl font-bold text-slate-800 mt-2">
            {rules.filter((r) => r.isActive).length} / {rules.length} Rules
          </p>
          <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">100% PCR 2011 Coverage</span>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Enforcement Jurisdiction</span>
          <p className="text-base font-bold text-slate-800 mt-2">
            Section 36 & 39, Legal Metrology Act
          </p>
          <span className="text-xs text-slate-400 mt-1 inline-block">Pre-packaged retail & wholesale commodities</span>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Config Authority</span>
          <p className="text-base font-bold text-slate-800 mt-2">
            {currentRole === 'admin' ? 'Administrative Directorate' : 'Officer Read Only'}
          </p>
          <span className="text-xs text-indigo-600 font-semibold mt-1 inline-block">
            {currentRole === 'admin' ? 'Rule Toggling Enabled' : 'Switch to Admin role to toggle'}
          </span>
        </div>
      </div>

      {/* Rules Cards List */}
      <div className="space-y-4">
        {filteredRules.map((rule) => (
          <div
            key={rule.id}
            className={`bg-white rounded-2xl border p-6 shadow-xs transition-all ${
              rule.isActive ? 'border-slate-200' : 'border-slate-200 bg-slate-50/60 opacity-60'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                    rule.severity === 'CRITICAL'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-indigo-100 text-indigo-700'
                  }`}
                >
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {rule.id}
                    </span>
                    <span className="text-xs font-bold text-indigo-600">{rule.ruleNumber}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        rule.severity === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {rule.severity}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 mt-1">{rule.title}</h3>
                </div>
              </div>

              {/* Toggle Switch */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">
                  {rule.isActive ? 'Active in Pipeline' : 'Disabled'}
                </span>
                <button
                  type="button"
                  disabled={currentRole !== 'admin'}
                  onClick={() => onToggleRule(rule.id)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    rule.isActive ? 'bg-indigo-600' : 'bg-slate-300'
                  } ${currentRole !== 'admin' ? 'cursor-not-allowed opacity-60' : ''}`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform transform ${
                      rule.isActive ? 'translate-x-6' : 'translate-x-1'
                    } top-1 absolute`}
                  />
                </button>
              </div>
            </div>

            {/* Description & Legal Provision */}
            <div className="py-3 text-xs space-y-2">
              <p className="text-slate-700 leading-relaxed">{rule.description}</p>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-[11px]">
                <strong>Statutory Legal Metrology Text:</strong> "{rule.legalText}"
              </div>
            </div>

            {/* Validation Logic Details */}
            <div className="pt-2 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
              <span className="font-mono">
                Validation Check: <strong>{rule.validationLogic}</strong>
              </span>
              <span className="font-semibold text-rose-700">
                Statutory Penalty: {rule.penalty}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
