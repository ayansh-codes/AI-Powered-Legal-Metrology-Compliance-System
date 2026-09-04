import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Camera,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileImage,
  RefreshCw,
  Zap,
  Info,
  X,
  Play,
} from 'lucide-react';
import { ProductCategory, Inspection, InspectionImage } from '../types';
import { SAMPLE_PRODUCTS } from '../data/sampleProducts';

interface NewScanViewProps {
  onAnalysisComplete: (inspection: Inspection) => void;
  categories: ProductCategory[];
}

export const NewScanView: React.FC<NewScanViewProps> = ({
  onAnalysisComplete,
  categories,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>(
    'Packaged Food & Groceries'
  );
  const [productName, setProductName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [location, setLocation] = useState('Central Delhi Market Surveillance');

  // Slots for images: Front, Back, Side
  const [activeSlot, setActiveSlot] = useState<'Front' | 'Back' | 'Side'>('Front');
  const [uploadedImages, setUploadedImages] = useState<
    Record<'Front' | 'Back' | 'Side', { dataUrl: string; fileName: string } | null>
  >({
    Front: null,
    Back: null,
    Side: null,
  });

  // Camera state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Analysis status & simulated stages
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const analysisStages = [
    'Performing Package Quality & Orientation Check...',
    'Detecting Text Regions & Principal Display Boundaries...',
    'Running Multimodal OCR & Field Character Recognition...',
    'Extracting Structured Declarations (MRP, Net Qty, Dates, Contact)...',
    'Applying Legal Metrology Rules (Packaged Commodities Rules, 2011)...',
    'Synthesizing Evidence Bounding Boxes & Compliance Score...',
  ];

  // Stop camera when unmounting
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Unable to access device camera. Please check permissions or upload an image file.');
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const captureSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setUploadedImages((prev) => ({
        ...prev,
        [activeSlot]: { dataUrl, fileName: `camera_${activeSlot.toLowerCase()}_snapshot.jpg` },
      }));
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setUploadedImages((prev) => ({
        ...prev,
        [activeSlot]: { dataUrl, fileName: file.name },
      }));
    };
    reader.readAsDataURL(file);
  };

  // 1-Click Load Sample Scenario
  const handleLoadSample = (sampleId: string) => {
    const sample = SAMPLE_PRODUCTS.find((s) => s.id === sampleId);
    if (!sample) return;

    setSelectedCategory(sample.category);
    setProductName(sample.name);
    setBrandName(sample.brand);
    setBatchNumber(`B-${Math.floor(1000 + Math.random() * 9000)}`);
    setUploadedImages({
      Front: { dataUrl: sample.frontDataUrl, fileName: `${sample.id}_front.svg` },
      Back: { dataUrl: sample.backDataUrl, fileName: `${sample.id}_back.svg` },
      Side: null,
    });
  };

  // Execute Analysis
  const handleStartAnalysis = async () => {
    const imageList: { id: string; tag: 'Front' | 'Back' | 'Side'; dataUrl: string; fileName: string }[] = [];

    if (uploadedImages.Front) {
      imageList.push({
        id: 'img-front',
        tag: 'Front',
        dataUrl: uploadedImages.Front.dataUrl,
        fileName: uploadedImages.Front.fileName,
      });
    }
    if (uploadedImages.Back) {
      imageList.push({
        id: 'img-back',
        tag: 'Back',
        dataUrl: uploadedImages.Back.dataUrl,
        fileName: uploadedImages.Back.fileName,
      });
    }
    if (uploadedImages.Side) {
      imageList.push({
        id: 'img-side',
        tag: 'Side',
        dataUrl: uploadedImages.Side.dataUrl,
        fileName: uploadedImages.Side.fileName,
      });
    }

    if (imageList.length === 0) {
      setErrorMsg('Please upload or capture at least one product panel image (Front or Back) before starting analysis.');
      return;
    }

    setErrorMsg(null);
    setIsAnalyzing(true);
    setCurrentStage(0);

    // Animate the pipeline stages for high fidelity UX
    const stageInterval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev < analysisStages.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 450);

    try {
      // Find if this matches one of our benchmark samples
      const matchedSample = SAMPLE_PRODUCTS.find(
        (s) =>
          (uploadedImages.Front && uploadedImages.Front.dataUrl === s.frontDataUrl) ||
          (productName && s.name.toLowerCase().includes(productName.toLowerCase()))
      );

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: imageList,
          category: selectedCategory,
          productName: productName || (matchedSample ? matchedSample.name : 'Sample Package'),
          brandName: brandName || (matchedSample ? matchedSample.brand : 'Brand Entity'),
          batchNumber: batchNumber || 'LOT-2026-X',
          location,
          sampleId: matchedSample ? matchedSample.id : undefined,
        }),
      });

      const data = await response.json();
      clearInterval(stageInterval);

      // Brief pause on stage 5 so user sees completion
      setCurrentStage(analysisStages.length - 1);
      setTimeout(() => {
        setIsAnalyzing(false);
        if (data.success && data.inspection) {
          onAnalysisComplete(data.inspection);
        } else {
          setErrorMsg(data.error || 'Failed to complete inspection analysis.');
        }
      }, 500);
    } catch (err: any) {
      clearInterval(stageInterval);
      setIsAnalyzing(false);
      console.error('Inspection error:', err);
      setErrorMsg('Network error communicating with inspection backend.');
    }
  };

  const hasAnyImage = !!(uploadedImages.Front || uploadedImages.Back || uploadedImages.Side);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
            Multi-Panel Inspector
          </span>
          <span className="text-xs text-slate-400">Rules Engine v2026</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight mt-1">
          New Product Compliance Scan
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Upload or capture multi-angle pictures of packaged commodities. The system performs OCR, extracts statutory declarations, and validates against Legal Metrology Rules, 2011.
        </p>
      </div>

      {/* 1-Click Benchmark Packages Banner (Bento Slate Card) */}
      <div className="p-5 rounded-2xl bg-[#1E293B] text-white border border-slate-700/50 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Instant Test Benchmarks (Ready-to-Scan Packages)
            </span>
          </div>
          <span className="text-[11px] text-slate-400">Click to auto-load package images & test</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SAMPLE_PRODUCTS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => handleLoadSample(s.id)}
              className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 active:scale-98 border border-slate-700 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-white group-hover:text-indigo-300 transition-colors">
                  {s.name.split('(')[0]}
                </span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    s.expectedStatus === 'COMPLIANT'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : s.expectedStatus === 'NON_COMPLIANT'
                      ? 'bg-rose-950 text-rose-400 border border-rose-800'
                      : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}
                >
                  {s.expectedStatus === 'COMPLIANT' ? 'PASS' : s.expectedStatus === 'NON_COMPLIANT' ? 'VIOLATION' : 'REVIEW'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{s.description}</p>
            </button>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Metadata & Category */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Product & Sampling Details</span>
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Product Category *
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as ProductCategory)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-600 mt-1">
              Rules engine applies specific provisions based on category.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Product Name / Commodity Identity
            </label>
            <input
              type="text"
              placeholder="e.g. Moong Dal, Herbal Shampoo"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Brand / Manufacturer Name
            </label>
            <input
              type="text"
              placeholder="e.g. ABC Foods Pvt Ltd"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Batch / Lot No.
              </label>
              <input
                type="text"
                placeholder="e.g. B-902"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Sampling Zone
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 text-blue-900 text-xs flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed text-blue-800">
              Multiple package angles ensure complete detection: MRP and Net Quantity on the principal display panel, plus Manufacturer and Grievance contacts on the back panel.
            </p>
          </div>
        </div>

        {/* Right Column: Multi-Angle Upload & Camera */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Package Panel Evidence Capture
              </h2>
              <p className="text-xs text-slate-500">
                Upload Front, Back, or Side package panels
              </p>
            </div>

            {/* Angle tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              {(['Front', 'Back', 'Side'] as const).map((slot) => {
                const hasImg = !!uploadedImages[slot];
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setActiveSlot(slot)}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeSlot === slot
                        ? 'bg-white text-blue-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>{slot} Panel</span>
                    {hasImg && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Camera Viewfinder Modal / Inline */}
          {isCameraActive ? (
            <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 aspect-4/3 flex flex-col items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border-2 border-dashed border-blue-400/60 m-8 rounded-lg pointer-events-none flex items-center justify-center">
                <span className="text-xs bg-slate-900/80 text-white px-3 py-1 rounded-full font-medium">
                  Align {activeSlot} Panel Inside Frame
                </span>
              </div>

              {cameraError && (
                <div className="absolute top-4 left-4 right-4 bg-rose-900/90 text-white text-xs p-3 rounded-lg border border-rose-700">
                  {cameraError}
                </div>
              )}

              <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={captureSnapshot}
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 shadow-lg cursor-pointer flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>Capture Snapshot</span>
                </button>
              </div>
            </div>
          ) : (
            /* Upload Dropzone or Image Preview */
            <div className="space-y-4">
              {uploadedImages[activeSlot] ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex flex-col items-center p-4">
                  <div className="w-full max-w-sm aspect-square rounded-lg overflow-hidden bg-white border border-slate-200 shadow-xs flex items-center justify-center relative">
                    <img
                      src={uploadedImages[activeSlot]?.dataUrl}
                      alt={`${activeSlot} view`}
                      className="w-full h-full object-contain"
                    />
                    <span className="absolute top-2 left-2 text-[10px] font-bold bg-slate-900/80 text-white px-2 py-0.5 rounded">
                      {activeSlot} Panel
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between w-full max-w-sm text-xs">
                    <span className="text-slate-600 font-mono truncate max-w-[200px]">
                      {uploadedImages[activeSlot]?.fileName}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setUploadedImages((prev) => ({ ...prev, [activeSlot]: null }))
                      }
                      className="text-rose-600 hover:text-rose-700 font-semibold cursor-pointer flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-blue-50/20 transition-all">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                    <FileImage className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Upload {activeSlot} Panel Image
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    Drag and drop high-resolution JPG/PNG package picture, or capture live using camera
                  </p>

                  <div className="mt-5 flex items-center gap-3">
                    <label className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer inline-flex items-center gap-1.5">
                      <Upload className="w-4 h-4" />
                      <span>Browse File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={startCamera}
                      className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Use Camera</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Thumbnails of all slots */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {(['Front', 'Back', 'Side'] as const).map((slot) => {
                  const img = uploadedImages[slot];
                  return (
                    <div
                      key={slot}
                      onClick={() => setActiveSlot(slot)}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                        activeSlot === slot
                          ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1.5">
                        <span>{slot} Panel</span>
                        {img ? (
                          <span className="text-emerald-600 flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" /> Ready
                          </span>
                        ) : (
                          <span className="text-slate-400">Empty</span>
                        )}
                      </div>
                      <div className="aspect-video rounded bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                        {img ? (
                          <img
                            src={img.dataUrl}
                            alt={slot}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[10px] text-slate-400">No Image</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {hasAnyImage
                ? 'Package panels staged for automated inspection.'
                : 'Upload Front and Back panels for highest compliance coverage.'}
            </span>

            <button
              type="button"
              onClick={handleStartAnalysis}
              disabled={isAnalyzing || !hasAnyImage}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
                isAnalyzing || !hasAnyImage
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25 active:scale-98'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Package...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>START COMPLIANCE ANALYSIS</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Analyzing Pipeline Overlay / Modal */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 bg-[#1E293B]/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center animate-pulse shadow-md shadow-indigo-500/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Digital Legal Metrology Inspector
                </h3>
                <p className="text-xs text-slate-500">Automated Pipeline In Progress</p>
              </div>
            </div>

            {/* Stepper Progress */}
            <div className="space-y-3 py-2">
              {analysisStages.map((stage, idx) => {
                const isCompleted = idx < currentStage;
                const isCurrent = idx === currentStage;
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 text-xs transition-opacity duration-300 ${
                      isCompleted || isCurrent ? 'opacity-100' : 'opacity-30'
                    }`}
                  >
                    <div className="mt-0.5">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : isCurrent ? (
                        <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300" />
                      )}
                    </div>
                    <span
                      className={
                        isCurrent
                          ? 'font-bold text-indigo-900'
                          : isCompleted
                          ? 'font-semibold text-slate-800'
                          : 'text-slate-500'
                      }
                    >
                      {stage}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentStage + 1) / analysisStages.length) * 100}%`,
                }}
              />
            </div>
            <p className="text-[11px] text-center text-slate-400">
              Validating against Packaged Commodities Rules, 2011 provisions...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
