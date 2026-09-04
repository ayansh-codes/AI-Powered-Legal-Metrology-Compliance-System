import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Calendar,
  Eye,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileSpreadsheet,
} from 'lucide-react';
import { Inspection, ComplianceStatus, ProductCategory } from '../types';

interface HistoryViewProps {
  inspections: Inspection[];
  onSelectInspection: (inspection: Inspection) => void;
  categories: ProductCategory[];
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  inspections,
  onSelectInspection,
  categories,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filtered = inspections.filter((i) => {
    const matchesSearch =
      i.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.inspectorName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'ALL' || i.status === selectedStatus;
    const matchesCategory = selectedCategory === 'ALL' || i.category === selectedCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleExportCsv = () => {
    const headers = ['Inspection ID', 'Date', 'Product', 'Brand', 'Category', 'Status', 'Score', 'Violations Count', 'Inspector'];
    const rows = filtered.map((i) => [
      i.id,
      i.date,
      `"${i.productName.replace(/"/g, '""')}"`,
      `"${i.brandName.replace(/"/g, '""')}"`,
      `"${i.category}"`,
      i.status,
      i.score.overall,
      i.violations.length,
      `"${i.inspectorName}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `legal_metrology_inspections_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Inspection Surveillance Archive
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Historical legal metrology audits, evidence repositories, and enforcement notices.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/20 cursor-pointer self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4 text-white" />
          <span>Export Archive (CSV)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search ID, product name, brand, officer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            >
              <option value="ALL">All Statuses</option>
              <option value="COMPLIANT">🟢 Compliant</option>
              <option value="NON_COMPLIANT">🔴 Non-Compliant</option>
              <option value="NEEDS_REVIEW">🟠 Needs Review</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden max-w-[200px]"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold tracking-wider">
                <th className="py-3 px-4">Inspection ID</th>
                <th className="py-3 px-4">Product Name & Brand</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Date & Zone</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Flagged Violations</th>
                <th className="py-3 px-4">Officer</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => {
                const statusBadge =
                  item.status === 'COMPLIANT' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[11px] bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      COMPLIANT
                    </span>
                  ) : item.status === 'NON_COMPLIANT' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[11px] bg-rose-100 text-rose-800 border border-rose-200">
                      <XCircle className="w-3 h-3 text-rose-600" />
                      NON-COMPLIANT
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[11px] bg-amber-100 text-amber-800 border border-amber-200">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      NEEDS REVIEW
                    </span>
                  );

                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectInspection(item)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-blue-600">
                      {item.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{item.productName}</div>
                      <div className="text-[11px] text-slate-500">{item.brandName}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{item.category}</td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      <div>{item.date}</div>
                      <div className="text-[10px] text-slate-400">{item.location}</div>
                    </td>
                    <td className="py-3 px-4">{statusBadge}</td>
                    <td className="py-3 px-4 font-mono font-bold">
                      <span
                        className={
                          item.score.overall >= 85
                            ? 'text-emerald-600'
                            : item.score.overall >= 70
                            ? 'text-amber-600'
                            : 'text-rose-600'
                        }
                      >
                        {item.score.overall}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {item.violations.length > 0 ? (
                        <span className="font-semibold text-rose-600">
                          {item.violations.length} statutory rule(s)
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-medium">0 infractions</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{item.inspectorName}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectInspection(item);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-medium transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-8 text-center text-xs text-slate-500">
            No inspection records match the specified query filters.
          </div>
        )}
      </div>
    </div>
  );
};
