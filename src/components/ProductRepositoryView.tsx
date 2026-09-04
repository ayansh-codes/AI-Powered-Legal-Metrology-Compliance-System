import React, { useState } from 'react';
import { Package, Search, CheckCircle2, XCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { ProductSummary } from '../types';

interface ProductRepositoryViewProps {
  products: ProductSummary[];
  onSelectProductFilter: (productName: string) => void;
}

export const ProductRepositoryView: React.FC<ProductRepositoryViewProps> = ({
  products,
  onSelectProductFilter,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
          Packaged Commodities Product Repository
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Centralized brand registry tracking surveillance history, recurrent violations, and brand-level compliance rates.
        </p>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search commodity name, brand entity, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          />
        </div>
        <span className="text-xs font-bold text-slate-600">
          {filtered.length} Monitored Commodities
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold tracking-wider">
                <th className="py-3 px-4">Commodity / Product</th>
                <th className="py-3 px-4">Brand / Manufacturer</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Total Scans</th>
                <th className="py-3 px-4">Compliance Ratio</th>
                <th className="py-3 px-4">Last Status</th>
                <th className="py-3 px-4">Last Inspected</th>
                <th className="py-3 px-4 text-right">Surveillance Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => {
                const complianceRatio = Math.round((item.compliantCount / Math.max(1, item.totalScans)) * 100);

                return (
                  <tr key={item.id} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                        <Package className="w-4 h-4" />
                      </div>
                      <span>{item.name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">{item.brand}</td>
                    <td className="py-3.5 px-4 text-slate-600">{item.category}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {item.totalScans} audits
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono font-bold ${
                            complianceRatio >= 80
                              ? 'text-emerald-700'
                              : complianceRatio >= 60
                              ? 'text-amber-700'
                              : 'text-rose-700'
                          }`}
                        >
                          {complianceRatio}%
                        </span>
                        <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${
                              complianceRatio >= 80 ? 'bg-emerald-500' : complianceRatio >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${complianceRatio}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {item.lastStatus === 'COMPLIANT' ? (
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          🟢 Conforming
                        </span>
                      ) : item.lastStatus === 'NON_COMPLIANT' ? (
                        <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          🔴 Violating
                        </span>
                      ) : (
                        <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          🟠 Review
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono">
                      {item.lastInspectedDate}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectProductFilter(item.name)}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-indigo-50 text-indigo-700 font-semibold cursor-pointer transition-colors"
                      >
                        View Audits →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
