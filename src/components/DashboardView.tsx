import React from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileSpreadsheet,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  AlertOctagon,
  ScanLine,
  Eye,
  MapPin,
  Calendar,
  Layers,
} from 'lucide-react';
import { Inspection } from '../types';

interface DashboardViewProps {
  inspections: Inspection[];
  onSelectInspection: (inspection: Inspection) => void;
  onNewInspectionClick: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  inspections,
  onSelectInspection,
  onNewInspectionClick,
}) => {
  // Aggregate statistics
  const dynamicCount = inspections.length;
  // Scaled baseline representation as specified in design doc
  const totalInspected = 1248 + Math.max(0, dynamicCount - 5);
  const compliantCount = 876 + inspections.filter((i) => i.status === 'COMPLIANT').length - 2;
  const nonCompliantCount = 254 + inspections.filter((i) => i.status === 'NON_COMPLIANT').length - 2;
  const needsReviewCount = 118 + inspections.filter((i) => i.status === 'NEEDS_REVIEW').length - 1;

  const complianceRateNum = (compliantCount / totalInspected) * 100;
  const complianceRate = complianceRateNum.toFixed(1);
  const circleOffset = Math.max(0, 251.33 - (251.33 * complianceRateNum) / 100);

  // Common violations list
  const commonViolations = [
    { label: 'Missing MRP', count: 82, percentage: 32, rule: 'Rule 6(1)(e)' },
    { label: 'Net Quantity Format', count: 61, percentage: 24, rule: 'Rule 6(1)(c)' },
    { label: 'Consumer Care Details', count: 47, percentage: 18, rule: 'Rule 6(1)(f)' },
  ];

  const recentList = inspections.slice(0, 6);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header section matching Bento Grid design */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Compliance Overview</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Legal Metrology Enforcement System • Session: Sep 04, 2026
          </p>
        </div>
        <button
          onClick={onNewInspectionClick}
          className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 text-sm transition-all cursor-pointer"
        >
          <ScanLine className="w-4 h-4" />
          <span>Start New Scan</span>
        </button>
      </header>

      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Bento Tile 1: Total Inspections */}
        <div className="col-span-1 bg-white p-6 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-xs">
          <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
            Total Inspections
          </span>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-4xl font-bold text-slate-800">
              {totalInspected.toLocaleString()}
            </span>
            <span className="text-emerald-500 text-xs font-bold">+12%</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2">Physical retail & market samples</span>
        </div>

        {/* Bento Tile 2: Compliant */}
        <div className="col-span-1 bg-white p-6 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-xs">
          <span className="text-emerald-600 text-xs font-semibold uppercase tracking-wider">
            Compliant
          </span>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-4xl font-bold text-slate-800">
              {compliantCount.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
              70.2%
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2">All mandatory provisions cleared</span>
        </div>

        {/* Bento Tile 3: Violations */}
        <div className="col-span-1 bg-white p-6 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-xs">
          <span className="text-rose-600 text-xs font-semibold uppercase tracking-wider">
            Violations
          </span>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-4xl font-bold text-slate-800">
              {nonCompliantCount.toLocaleString()}
            </span>
            <span className="text-xs text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded">
              Section 36
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2">Statutory infractions / notices</span>
        </div>

        {/* Bento Tile 4: Dark Feature Score Gauge (Row Span 2 on large screens) */}
        <div className="col-span-1 lg:row-span-2 bg-[#1E293B] p-6 rounded-2xl border border-slate-700/50 shadow-xl flex flex-col items-center justify-center gap-4 text-white">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#6366f1"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="251.33"
                strokeDashoffset={circleOffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="text-center">
              <span className="text-2xl font-bold tracking-tight">{complianceRate}%</span>
              <div className="text-[10px] uppercase opacity-60 tracking-widest mt-0.5">Score</div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold">Overall Compliance</div>
            <div className="text-xs text-indigo-300 mt-1 italic">Above State Benchmark</div>
          </div>
          <div className="w-full pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>Target: 85%</span>
            <span className="text-emerald-400 font-medium">+18% MoM</span>
          </div>
        </div>

        {/* Bento Tile 5: Recent Inspections Table (Col Span 2, Row Span 2) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 lg:row-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Recent Inspections</h3>
              <p className="text-[11px] text-slate-400">Real-time package surveillance feed</p>
            </div>
            <span className="text-indigo-600 text-xs font-semibold bg-indigo-50 px-2.5 py-1 rounded-md">
              {recentList.length} Latest Scans
            </span>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3">Product</th>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-slate-100">
                {recentList.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => onSelectInspection(item)}
                    className="hover:bg-indigo-50/30 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-800 truncate max-w-[180px]">
                        {item.productName}
                      </div>
                      <div className="text-[10px] text-slate-400">{item.brandName}</div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-400 font-mono text-[11px]">{item.id}</td>
                    <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap text-[11px]">
                      {item.date}
                    </td>
                    <td className="px-4 py-3.5">
                      {item.status === 'COMPLIANT' ? (
                        <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Compliant
                        </span>
                      ) : item.status === 'NON_COMPLIANT' ? (
                        <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          Violation
                        </span>
                      ) : (
                        <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Review
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectInspection(item);
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bento Tile 6: Common Violations */}
        <div className="col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col">
          <h3 className="font-bold text-slate-700 text-sm mb-4">Common Violations</h3>
          <div className="space-y-4 flex-1">
            {commonViolations.map((v, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600">{v.label}</span>
                  <span className="text-slate-400">{v.percentage}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      idx === 0 ? 'bg-rose-500' : idx === 1 ? 'bg-amber-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${v.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Enforcement: PCR 2011</span>
            <span className="text-indigo-600 font-semibold">Top 3 Types</span>
          </div>
        </div>

        {/* Bento Tile 7: Needs Review Pill Box */}
        <div className="col-span-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 font-bold text-xl shrink-0">
            {needsReviewCount}
          </div>
          <div>
            <div className="text-sm font-bold text-slate-700">Needs Review</div>
            <div className="text-xs text-slate-400">Flagged for human verification</div>
          </div>
        </div>

        {/* Bento Tile 8: Rule Engine Status (Indigo Gradient Bento Tile) */}
        <div className="col-span-1 bg-gradient-to-br from-indigo-500 to-indigo-700 p-6 rounded-2xl shadow-lg flex flex-col justify-between text-white">
          <div>
            <h3 className="font-bold text-lg leading-tight">Rule Engine Status</h3>
            <p className="text-xs text-indigo-100 mt-2">Latest legal standards synced: Sep 01, 2026</p>
          </div>
          <div className="space-y-3 my-4">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-emerald-400 rounded-full shrink-0" />
              <span>Packaged Commodities Rules</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-emerald-400 rounded-full shrink-0" />
              <span>State Specific Amendments</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-emerald-400 rounded-full shrink-0" />
              <span>Mandatory SI Metric Rules</span>
            </div>
          </div>
          <div className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold py-2 px-3 rounded-lg backdrop-blur-md text-center transition-colors">
            Rule Engine Active (9 Rules)
          </div>
        </div>

        {/* Bento Tile 9: System Health */}
        <div className="col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <h3 className="font-bold text-slate-700 text-sm">System Health</h3>
          <div className="flex flex-col gap-3 my-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">OCR Accuracy</span>
              <span className="text-xs font-bold text-emerald-600">99.4%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">API Latency</span>
              <span className="text-xs font-bold text-slate-700">420ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">Cloud Storage</span>
              <span className="text-xs font-bold text-slate-700">64%</span>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                All Systems Operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
