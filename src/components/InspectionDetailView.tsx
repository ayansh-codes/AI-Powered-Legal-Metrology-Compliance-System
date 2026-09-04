import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Eye,
  Edit3,
  Check,
  RotateCcw,
  Scale,
  ShieldAlert,
  Info,
  Layers,
  ZoomIn,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Inspection, ComplianceStatus, DeclarationExtraction, Violation } from '../types';

interface InspectionDetailViewProps {
  inspection: Inspection;
  onBack: () => void;
  onUpdateInspection: (updated: Inspection) => void;
  onOpenReport: () => void;
}

export const InspectionDetailView: React.FC<InspectionDetailViewProps> = ({
  inspection,
  onBack,
  onUpdateInspection,
  onOpenReport,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(
    inspection.images.length > 1 ? 1 : 0 // Default to back panel where most declarations live
  );

  const [activeHighlightKey, setActiveHighlightKey] = useState<string | null>(null);

  // Human-in-the-loop editing state
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const currentImage = inspection.images[selectedImageIndex] || inspection.images[0];

  // Helper to get declarations on currently selected image
  const declarationsList: DeclarationExtraction[] = Object.values(inspection.declarations) as DeclarationExtraction[];

  const handleStartEdit = (decl: DeclarationExtraction) => {
    setEditingKey(decl.key);
    setEditValue(decl.value || '');
  };

  const handleSaveEdit = (key: string) => {
    const updatedDeclarations = { ...inspection.declarations };
    if (updatedDeclarations[key]) {
      updatedDeclarations[key].value = editValue;
      updatedDeclarations[key].humanVerified = true;
      updatedDeclarations[key].humanEditedValue = editValue;
      updatedDeclarations[key].present = editValue.trim().length > 0;
    }

    const updatedInspection: Inspection = {
      ...inspection,
      declarations: updatedDeclarations,
      inspectorNotes: `${inspection.inspectorNotes || ''}\n[Human Verification]: Field "${key}" amended by inspector.`.trim(),
    };

    onUpdateInspection(updatedInspection);
    setEditingKey(null);
  };

  const handleHumanStatusOverride = (newStatus: ComplianceStatus) => {
    const updated: Inspection = {
      ...inspection,
      status: newStatus,
      reviewedBy: 'Inspector A. Sharma (Badge #402)',
      reviewNotes: `Status confirmed as ${newStatus} following manual visual verification.`,
    };
    onUpdateInspection(updated);
  };

  // Status visual badge styling
  const statusTheme =
    inspection.status === 'COMPLIANT'
      ? {
          bg: 'bg-emerald-50 border-emerald-300 text-emerald-950',
          badge: 'bg-emerald-600 text-white',
          icon: CheckCircle2,
          title: 'COMPLIANT (LEGAL REQUIREMENTS SATISFIED)',
          desc: 'All statutory declarations under Legal Metrology (Packaged Commodities) Rules, 2011 are verified present and in conforming format.',
        }
      : inspection.status === 'NON_COMPLIANT'
      ? {
          bg: 'bg-rose-50 border-rose-300 text-rose-950',
          badge: 'bg-rose-600 text-white',
          icon: XCircle,
          title: 'NON-COMPLIANT (STATUTORY VIOLATION CONFIRMED)',
          desc: `${inspection.violations.length} actionable violation(s) detected. Subject to notice under Section 36 of Legal Metrology Act, 2009.`,
        }
      : {
          bg: 'bg-amber-50 border-amber-300 text-amber-950',
          badge: 'bg-amber-600 text-white',
          icon: AlertTriangle,
          title: 'NEEDS HUMAN REVIEW (UNCERTAIN READINGS)',
          desc: 'OCR confidence or print contrast is below threshold. Manual verification is mandated before drawing legal proceedings.',
        };

  const StatusIcon = statusTheme.icon;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Navigation Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenReport}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Official Inspection Report</span>
          </button>
        </div>
      </div>

      {/* Primary Result Banner (The 3 States: 🟢 🔴 🟠) */}
      <div className={`p-5 rounded-2xl border ${statusTheme.bg} shadow-sm space-y-2`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className={`p-2 rounded-xl ${statusTheme.badge}`}>
              <StatusIcon className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-white/80 px-2 py-0.5 rounded border border-slate-300 text-slate-700">
                  {inspection.id}
                </span>
                <span className="text-xs text-slate-700 font-medium">
                  {inspection.date} • {inspection.location}
                </span>
              </div>
              <h2 className="text-lg font-black tracking-tight mt-0.5">
                {statusTheme.title}
              </h2>
            </div>
          </div>

          {/* Quick Override by Inspector */}
          <div className="flex items-center gap-1.5 self-start md:self-auto bg-white/80 p-1.5 rounded-lg border border-slate-300/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 px-1">
              Officer Determination:
            </span>
            <button
              type="button"
              onClick={() => handleHumanStatusOverride('COMPLIANT')}
              className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer transition-all ${
                inspection.status === 'COMPLIANT'
                  ? 'bg-emerald-600 text-white'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              🟢 Pass
            </button>
            <button
              type="button"
              onClick={() => handleHumanStatusOverride('NON_COMPLIANT')}
              className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer transition-all ${
                inspection.status === 'NON_COMPLIANT'
                  ? 'bg-rose-600 text-white'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              🔴 Violation
            </button>
            <button
              type="button"
              onClick={() => handleHumanStatusOverride('NEEDS_REVIEW')}
              className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer transition-all ${
                inspection.status === 'NEEDS_REVIEW'
                  ? 'bg-amber-600 text-white'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              🟠 Review
            </button>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-slate-700">{statusTheme.desc}</p>
      </div>

      {/* Compliance Score Summary Card (Section 16) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Automated Metrology Scorecard
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                Internal Summary (Not Legal Determination)
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              {inspection.productName} — {inspection.brandName}
            </h3>
            <p className="text-xs text-slate-500">
              Category: <span className="font-semibold text-slate-700">{inspection.category}</span> • Batch:{' '}
              <span className="font-mono text-slate-700">{inspection.batchNumber || 'N/A'}</span>
            </p>
          </div>

          {/* Big Overall Score Circle / Pill */}
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-700 block">
                Compliance Score
              </span>
              <span className="text-xs font-semibold text-slate-700">
                Composite Rating
              </span>
            </div>
            <div
              className={`w-14 h-14 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-xs ${
                inspection.score.overall >= 85
                  ? 'bg-emerald-600'
                  : inspection.score.overall >= 70
                  ? 'bg-amber-600'
                  : 'bg-rose-600'
              }`}
            >
              {inspection.score.overall}%
            </div>
          </div>
        </div>

        {/* 4 Score Sub-dimensions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-600">Declarations</span>
              <span className="font-mono font-bold text-slate-900">
                {inspection.score.declarations}%
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <div
                className="bg-indigo-600 h-1.5 rounded-full"
                style={{ width: `${inspection.score.declarations}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-600">Mandatory fields present</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-600">Format</span>
              <span className="font-mono font-bold text-slate-900">
                {inspection.score.format}%
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <div
                className="bg-emerald-600 h-1.5 rounded-full"
                style={{ width: `${inspection.score.format}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-600">Standard SI units & taxes</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-600">Readability</span>
              <span className="font-mono font-bold text-slate-900">
                {inspection.score.readability}%
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <div
                className="bg-purple-600 h-1.5 rounded-full"
                style={{ width: `${inspection.score.readability}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-600">Contrast & font clarity</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-600">Completeness</span>
              <span className="font-mono font-bold text-slate-900">
                {inspection.score.completeness}%
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <div
                className="bg-amber-600 h-1.5 rounded-full"
                style={{ width: `${inspection.score.completeness}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-600">Full address & contacts</span>
          </div>
        </div>
      </div>

      {/* Main Analysis Section: Visual Evidence Viewer & Structured Declarations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Visual Evidence Viewer (Section 13 & 17) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-indigo-600" />
                <span>Visual Evidence Inspection Canvas</span>
              </h3>
              <p className="text-xs text-slate-500">
                Detected declaration bounding boxes highlighted directly on package
              </p>
            </div>

            {/* Panel Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              {inspection.images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => {
                    setSelectedImageIndex(idx);
                    setActiveHighlightKey(null);
                  }}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                    selectedImageIndex === idx
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {img.tag} Panel
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Image Canvas with Bounding Boxes */}
          <div className="relative aspect-square w-full max-w-lg mx-auto rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-inner flex items-center justify-center group">
            {currentImage ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={currentImage.dataUrl}
                  alt="Package evidence"
                  className="w-full h-full object-contain"
                />

                {/* Render overlay bounding boxes for detected items on this image */}
                {declarationsList.map((decl) => {
                  if (decl.imageIndex !== selectedImageIndex || !decl.boundingBox) return null;
                  const isHighlighted = activeHighlightKey === decl.key;
                  const isValid = decl.present && decl.formatValid;

                  // Normalize coordinates to percentage (scale 0-1000)
                  const top = (decl.boundingBox.ymin / 1000) * 100;
                  const left = (decl.boundingBox.xmin / 1000) * 100;
                  const height = ((decl.boundingBox.ymax - decl.boundingBox.ymin) / 1000) * 100;
                  const width = ((decl.boundingBox.xmax - decl.boundingBox.xmin) / 1000) * 100;

                  return (
                    <div
                      key={decl.key}
                      onClick={() => setActiveHighlightKey(decl.key)}
                      style={{
                        top: `${top}%`,
                        left: `${left}%`,
                        width: `${width}%`,
                        height: `${height}%`,
                      }}
                      className={`absolute rounded transition-all cursor-pointer flex flex-col justify-start p-1 ${
                        isHighlighted
                          ? 'ring-4 ring-blue-500 bg-blue-500/25 z-20'
                          : isValid
                          ? 'border-2 border-emerald-500/80 bg-emerald-500/10 hover:bg-emerald-500/20'
                          : 'border-2 border-rose-500/90 bg-rose-500/20 hover:bg-rose-500/30 animate-pulse'
                      }`}
                    >
                      <span
                        className={`text-[9px] font-bold px-1 py-0.2 rounded w-max text-white shadow-xs ${
                          isHighlighted
                            ? 'bg-blue-600'
                            : isValid
                            ? 'bg-emerald-600'
                            : 'bg-rose-600'
                        }`}
                      >
                        {decl.label}: {decl.confidence}%
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-slate-400 text-xs">No image panel loaded</div>
            )}

            <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] px-2 py-1 rounded font-mono">
              Panel: {currentImage?.tag || 'Display'} • Quality: {currentImage?.qualityScore || 92}%
            </div>
          </div>

          {/* Legend and Active Bounding Box Inspection Details */}
          <div className="flex flex-wrap items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <span className="w-2.5 h-2.5 rounded-xs border-2 border-emerald-500 bg-emerald-500/20" />
                Compliant Declaration
              </span>
              <span className="flex items-center gap-1 text-rose-600 font-semibold">
                <span className="w-2.5 h-2.5 rounded-xs border-2 border-rose-500 bg-rose-500/20" />
                Defective / Flagged
              </span>
              <span className="flex items-center gap-1 text-blue-600 font-semibold">
                <span className="w-2.5 h-2.5 rounded-xs ring-2 ring-blue-500 bg-blue-500/25" />
                Selected
              </span>
            </div>

            <button
              onClick={() => setActiveHighlightKey(null)}
              className="text-[11px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
            >
              Reset Highlights
            </button>
          </div>

          {/* Active Highlight Info Box */}
          {activeHighlightKey && inspection.declarations[activeHighlightKey] && (
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-950">
                  Target: {inspection.declarations[activeHighlightKey].label}
                </span>
                <span className="font-mono text-blue-700 font-semibold">
                  Confidence: {inspection.declarations[activeHighlightKey].confidence}%
                </span>
              </div>
              <p className="text-slate-800 font-mono text-[11px]">
                Detected Value: "{inspection.declarations[activeHighlightKey].value || '[NOT DETECTED]'}"
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Structured Declarations & Human-in-the-Loop Validation */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Statutory Declarations Checklist</span>
              </h3>
              <p className="text-xs text-slate-500">
                Rule-by-rule declaration verification & edit controls
              </p>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              {declarationsList.filter((d) => d.present && d.formatValid).length}/
              {declarationsList.length} Pass
            </span>
          </div>

          {/* Declarations List */}
          <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
            {declarationsList.map((decl) => {
              const isSelected = activeHighlightKey === decl.key;
              const isEditing = editingKey === decl.key;

              return (
                <div
                  key={decl.key}
                  onClick={() => {
                    setActiveHighlightKey(decl.key);
                    if (decl.imageIndex !== undefined && decl.imageIndex !== selectedImageIndex) {
                      setSelectedImageIndex(decl.imageIndex);
                    }
                  }}
                  className={`p-3 rounded-lg border text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/70 ring-1 ring-blue-500'
                      : !decl.present || !decl.formatValid
                      ? 'border-rose-200 bg-rose-50/40 hover:bg-rose-50'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      {decl.present && decl.formatValid ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      )}
                      <span>{decl.label}</span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                          decl.confidence >= 90
                            ? 'bg-emerald-100 text-emerald-800'
                            : decl.confidence >= 70
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {decl.confidence}% conf
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartEdit(decl);
                        }}
                        className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-white transition-colors cursor-pointer"
                        title="Edit value (Human in the loop)"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Field Value or Edit Input */}
                  {isEditing ? (
                    <div
                      className="mt-2 space-y-2 bg-white p-2.5 rounded border border-blue-300"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <label className="text-[10px] font-bold text-slate-600">
                        Officer Correction / Human Input:
                      </label>
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        placeholder="Enter verified value..."
                        className="w-full text-xs p-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingKey(null)}
                          className="px-2 py-1 text-[11px] text-slate-500 hover:text-slate-800"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(decl.key)}
                          className="px-2.5 py-1 text-[11px] bg-blue-600 hover:bg-blue-700 text-white rounded font-bold flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" /> Save & Recalculate
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p
                        className={`font-mono text-[11px] ${
                          decl.value ? 'text-slate-800' : 'text-rose-600 font-semibold italic'
                        }`}
                      >
                        {decl.value || '[NOT DETECTED / ABSENT ON PACKAGING]'}
                      </p>

                      {decl.notes && (
                        <p className="text-[10px] text-rose-700 bg-rose-100/60 p-1.5 rounded">
                          {decl.notes}
                        </p>
                      )}

                      {decl.humanVerified && (
                        <span className="inline-block text-[9px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded">
                          ✓ Officer Verified
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Flagged Violations Section (Section 14) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Flagged Statutory Infractions & Legal Provisions</span>
            </h3>
            <p className="text-xs text-slate-500">
              Prosecution points under Legal Metrology Act, 2009 & Packaged Commodities Rules
            </p>
          </div>
          <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded border border-rose-200">
            {inspection.violations.length} Violation(s)
          </span>
        </div>

        {inspection.violations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inspection.violations.map((viol, idx) => (
              <div
                key={viol.id || idx}
                className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-800 font-mono text-[11px] bg-rose-100 px-2 py-0.5 rounded">
                    VIOLATION #{idx + 1}
                  </span>
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-200/60 px-2 py-0.5 rounded">
                    {viol.severity} SEVERITY
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-xs">{viol.issue}</h4>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    <strong>Rule Reference:</strong> {viol.ruleReference}
                  </p>
                </div>

                <div className="p-2.5 rounded bg-white border border-rose-200/80 text-[11px] text-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">Detection Confidence:</span>
                    <span className="font-mono font-bold text-rose-600">{viol.confidence}%</span>
                  </div>
                  <p className="text-slate-600">
                    <strong>Legal Enforcement Recommendation:</strong> {viol.recommendation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-xs space-y-2 bg-emerald-50/50 rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-emerald-950 text-sm">No Statutory Violations Detected</h4>
            <p className="text-emerald-800 max-w-md mx-auto">
              The package complies with all applicable mandatory declarations, unit specifications, MRP disclosures, and contact details under the Legal Metrology (Packaged Commodities) Rules.
            </p>
          </div>
        )}
      </div>

      {/* Raw OCR Stream & Officer Inspection Log */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Raw OCR Optical Transcription & Officer Field Notes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900 text-slate-200 p-3 rounded-lg font-mono text-xs overflow-x-auto max-h-36 whitespace-pre-wrap leading-relaxed">
            {inspection.rawOcrText}
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
            <p className="text-slate-700 font-medium">
              <strong>Inspector:</strong> {inspection.inspectorName} ({inspection.inspectorId})
            </p>
            <p className="text-slate-700">
              <strong>Sampling Location:</strong> {inspection.location}
            </p>
            <p className="text-slate-600 text-[11px]">
              <strong>Notes:</strong> {inspection.inspectorNotes || 'Routine surveillance inspection.'}
            </p>
            {inspection.reviewedBy && (
              <p className="text-[11px] font-semibold text-blue-700 bg-blue-50 p-1.5 rounded border border-blue-100">
                ✓ Reviewed by: {inspection.reviewedBy}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
