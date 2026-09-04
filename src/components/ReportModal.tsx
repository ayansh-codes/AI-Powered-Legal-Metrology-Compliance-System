import React, { useRef } from 'react';
import {
  Printer,
  Download,
  X,
  Scale,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileCheck,
  ShieldAlert,
} from 'lucide-react';
import { Inspection, DeclarationExtraction } from '../types';

interface ReportModalProps {
  inspection: Inspection;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ inspection, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(inspection, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `LM_Report_${inspection.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const statusColor =
    inspection.status === 'COMPLIANT'
      ? 'text-emerald-700 bg-emerald-50 border-emerald-300'
      : inspection.status === 'NON_COMPLIANT'
      ? 'text-rose-700 bg-rose-50 border-rose-300'
      : 'text-amber-700 bg-amber-50 border-amber-300';

  const statusText =
    inspection.status === 'COMPLIANT'
      ? 'PASS - STATUTORY COMPLIANCE CONFIRMED'
      : inspection.status === 'NON_COMPLIANT'
      ? 'FAIL - STATUTORY VIOLATION CONFIRMED'
      : 'NEEDS HUMAN OFFICER RE-EXAMINATION';

  return (
    <div className="fixed inset-0 z-50 bg-[#1E293B]/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:border-none print:shadow-none">
        {/* Modal Controls Bar (Hidden during window.print) */}
        <div className="p-4 bg-[#1E293B] text-white flex items-center justify-between print:hidden border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-400" />
            <span className="text-sm font-bold">
              Official Legal Metrology Inspection Report
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer transition-all shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={handleDownloadJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div ref={printRef} className="p-8 overflow-y-auto space-y-6 text-slate-900 print:p-6 print:overflow-visible">
          {/* Government Department Header */}
          <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
            <div className="flex justify-center items-center gap-2 mb-1">
              <Scale className="w-8 h-8 text-slate-900" />
            </div>
            <h1 className="text-xl font-black uppercase tracking-wide text-slate-900">
              Department of Legal Metrology
            </h1>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Government Enforcement Directorate • Packaged Commodities Surveillance
            </p>
            <p className="text-[11px] text-slate-500">
              Generated under the Legal Metrology (Packaged Commodities) Rules, 2011 & The Legal Metrology Act, 2009
            </p>
          </div>

          {/* Inspection Metadata Table */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-700 block">
                Inspection ID
              </span>
              <span className="font-mono font-bold text-blue-700 text-sm">
                {inspection.id}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-700 block">
                Inspection Date
              </span>
              <span className="font-semibold">{inspection.date}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-700 block">
                Enforcement Officer
              </span>
              <span className="font-semibold">{inspection.inspectorName} ({inspection.inspectorId})</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-700 block">
                Sampling Jurisdiction
              </span>
              <span className="font-semibold">{inspection.location}</span>
            </div>
          </div>

          {/* Product Identification */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Commodity & Sample Identification
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs p-3 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-500 block">Product / Commodity:</span>
                <span className="font-bold text-slate-900">{inspection.productName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Manufacturer / Brand:</span>
                <span className="font-bold text-slate-900">{inspection.brandName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Commodity Category:</span>
                <span className="font-semibold text-slate-800">{inspection.category}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Lot / Batch Number:</span>
                <span className="font-mono font-semibold text-slate-800">{inspection.batchNumber || 'Unspecified'}</span>
              </div>
            </div>
          </div>

          {/* Official Determination Banner */}
          <div className={`p-4 rounded-xl border ${statusColor} flex items-center justify-between`}>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider block">
                Surveillance Result Finding
              </span>
              <span className="text-base font-black tracking-tight">{statusText}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider block">
                Metrology Score
              </span>
              <span className="text-2xl font-black">{inspection.score.overall}%</span>
            </div>
          </div>

          {/* Statutory Violations Section */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Specific Statutory Infractions Identified</span>
            </h2>

            {inspection.violations.length > 0 ? (
              <div className="space-y-2">
                {inspection.violations.map((viol, idx) => (
                  <div
                    key={viol.id || idx}
                    className="p-3.5 rounded-lg border border-rose-200 bg-rose-50/40 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-900 font-mono">
                        Violation #{idx + 1}: {viol.category}
                      </span>
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                        {viol.severity}
                      </span>
                    </div>
                    <p className="font-semibold text-slate-800">{viol.issue}</p>
                    <p className="text-[11px] text-slate-600">
                      <strong>Applicable Rule:</strong> {viol.ruleReference}
                    </p>
                    <p className="text-[11px] text-slate-700">
                      <strong>Enforcement Measure:</strong> {viol.recommendation}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium">
                No statutory infractions detected. The sampled package satisfies all statutory declarations prescribed in Rule 6 and Rule 12 of the Packaged Commodities Rules, 2011.
              </div>
            )}
          </div>

          {/* Declarations Audit Matrix */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Statutory Declarations Verification Matrix
            </h2>
            <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Declaration Item</th>
                  <th className="p-2.5">Extracted Value</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5 text-right">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(Object.values(inspection.declarations) as DeclarationExtraction[]).map((d) => (
                  <tr key={d.key} className="hover:bg-slate-50">
                    <td className="p-2.5 font-semibold text-slate-800">{d.label}</td>
                    <td className="p-2.5 font-mono text-slate-600">
                      {d.value || <span className="text-rose-600 font-bold">Absent / Not Declared</span>}
                    </td>
                    <td className="p-2.5">
                      {d.present && d.formatValid ? (
                        <span className="text-emerald-700 font-bold">Conforming</span>
                      ) : (
                        <span className="text-rose-700 font-bold">Non-Conforming</span>
                      )}
                    </td>
                    <td className="p-2.5 text-right font-mono text-slate-700">{d.confidence}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Photographic Evidence Panels */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Photographic Evidence Records
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {inspection.images.slice(0, 2).map((img, idx) => (
                <div key={idx} className="p-2 rounded-lg border border-slate-200 bg-slate-50 text-center">
                  <div className="aspect-video w-full rounded overflow-hidden bg-white border border-slate-200 flex items-center justify-center">
                    <img
                      src={img.dataUrl}
                      alt={img.tag}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 mt-1 block">
                    Evidence Image {idx + 1}: {img.tag} Panel
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Signature & Authentication Block */}
          <div className="pt-6 border-t-2 border-slate-900 grid grid-cols-2 gap-8 text-xs">
            <div>
              <p className="font-bold text-slate-900">Inspecting Officer Signature</p>
              <div className="mt-8 border-b border-slate-400 w-48" />
              <p className="mt-1 text-slate-600">
                {inspection.inspectorName} ({inspection.inspectorId})
              </p>
              <p className="text-[10px] text-slate-400">Legal Metrology Officer</p>
            </div>

            <div className="text-right">
              <p className="font-bold text-slate-900">Zonal Directorate Seal</p>
              <div className="mt-6 flex justify-end">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-400 flex items-center justify-center text-[9px] text-slate-400 uppercase font-mono text-center">
                  OFFICIAL SEAL
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
