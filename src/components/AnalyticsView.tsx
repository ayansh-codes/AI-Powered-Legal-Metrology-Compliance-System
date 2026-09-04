import React from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Calendar,
  Layers,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import { Inspection } from '../types';

interface AnalyticsViewProps {
  inspections: Inspection[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ inspections }) => {
  const categoryStats = [
    { category: 'Packaged Food & Groceries', total: 614, compliant: 412, nonCompliant: 142, review: 60, rate: 67 },
    { category: 'Personal Care & Cosmetics', total: 298, compliant: 238, nonCompliant: 42, review: 18, rate: 80 },
    { category: 'Beverages & Liquids', total: 194, compliant: 130, nonCompliant: 44, review: 20, rate: 67 },
    { category: 'Household & Cleaning', total: 142, compliant: 96, nonCompliant: 26, review: 20, rate: 68 },
  ];

  const monthlyTrends = [
    { month: 'Apr 2026', rate: 58, count: 210 },
    { month: 'May 2026', rate: 62, count: 245 },
    { month: 'Jun 2026', rate: 65, count: 280 },
    { month: 'Jul 2026', rate: 67, count: 295 },
    { month: 'Aug 2026', rate: 69, count: 320 },
    { month: 'Sep 2026', rate: 70.2, count: 348 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
          Surveillance Analytics & Metrology Trends
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Zonal enforcement velocity, category vulnerability indexes, and multi-month compliance trajectory.
        </p>
      </div>

      {/* Trajectory Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              National Metrology Compliance Trajectory (6-Month MoM)
            </h2>
            <p className="text-xs text-slate-500">
              Progression following automated digital surveillance rollout
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded">
            +12.2% Overall Improvement
          </span>
        </div>

        {/* Horizontal Trend Bar Chart */}
        <div className="grid grid-cols-6 gap-3 pt-6 text-center">
          {monthlyTrends.map((m, idx) => (
            <div key={idx} className="space-y-2">
              <div className="h-32 bg-slate-50 rounded-xl p-2 flex flex-col justify-end items-center border border-slate-100">
                <span className="text-xs font-bold text-indigo-700 font-mono mb-1">
                  {m.rate}%
                </span>
                <div
                  className="w-full bg-indigo-600 rounded-t-md transition-all duration-500"
                  style={{ height: `${(m.rate / 100) * 100}%` }}
                />
              </div>
              <span className="text-[11px] font-semibold text-slate-700 block">
                {m.month}
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">
                {m.count} scans
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900">
            Commodity Category Vulnerability Audit
          </h2>
          <p className="text-xs text-slate-500">
            Compliance rates across distinct product manufacturing sectors
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold tracking-wider">
                <th className="py-3 px-4">Commodity Sector</th>
                <th className="py-3 px-4">Total Samples</th>
                <th className="py-3 px-4 text-emerald-700">Compliant</th>
                <th className="py-3 px-4 text-rose-700">Violations</th>
                <th className="py-3 px-4 text-amber-700">Needs Review</th>
                <th className="py-3 px-4">Sector Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categoryStats.map((cat, idx) => (
                <tr key={idx} className="hover:bg-indigo-50/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{cat.category}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                    {cat.total}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-emerald-700">
                    {cat.compliant}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-rose-700">
                    {cat.nonCompliant}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-amber-700">
                    {cat.review}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{cat.rate}%</span>
                      <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${
                            cat.rate >= 75 ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${cat.rate}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
