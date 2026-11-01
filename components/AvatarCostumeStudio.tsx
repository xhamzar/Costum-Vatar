'use client';

import React, {useState, useRef} from 'react';
import Image from 'next/image';
import {
  Download,
  RotateCcw,
  Shuffle,
  Eye,
  EyeOff,
  Check,
  Copy,
  Layers,
  Shirt,
  Sparkles,
  FileCode2,
} from 'lucide-react';
import {
  AvatarConfig,
  DEFAULT_AVATAR_CONFIG,
  CARDIGAN_COLORWAYS,
  HAIR_TONES,
  EYE_TONES,
  DrapeStyle,
  InnerOutfitId,
  ExpressionId,
  ShoeStyleId,
  AccessoryId,
  resolveCardiganPalette,
  buildCostumeManifest,
  countActiveLayers,
} from '@/lib/avatar-costume';
import {
  downloadSvgElement,
  downloadPngFromSvg,
  downloadPngFromCanvas,
  downloadJsonFile,
} from '@/lib/svg-export';
import {ChibiAvatarCanvas} from './ChibiAvatarCanvas';
import {SingleCardiganSprite, CardiganRackShowcase} from './CardiganAssetSprite';
import {
  ReferenceAvatarCanvas,
  ReferenceCardiganSprite,
} from './ReferenceSpriteCanvas';

type StudioTab = 'cardigan' | 'character' | 'layers';
type StageBackdrop = 'cream-paper' | 'transparent-grid' | 'studio-white' | 'night-slate';
type RenderEngine = 'reference-hd' | 'vector-svg';

export function AvatarCostumeStudio() {
  const [config, setConfig] = useState<AvatarConfig>(DEFAULT_AVATAR_CONFIG);
  const [activeTab, setActiveTab] = useState<StudioTab>('cardigan');
  const [backdrop, setBackdrop] = useState<StageBackdrop>('studio-white');
  const [renderEngine, setRenderEngine] = useState<RenderEngine>('reference-hd');
  const [showSideBySideRef, setShowSideBySideRef] = useState<boolean>(false);
  const [isolatedPart, setIsolatedPart] = useState<'both' | 'slouch-half' | 'neat-half'>('both');
  const [exportStatus, setExportStatus] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const avatarSvgRef = useRef<SVGSVGElement | null>(null);
  const cardiganAssetSvgRef = useRef<SVGSVGElement | null>(null);
  const avatarCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const cardiganCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const activePalette = resolveCardiganPalette(config);
  const manifest = buildCostumeManifest(config);
  const activeLayerCount = countActiveLayers(config);

  const triggerStatus = (msg: string) => {
    setExportStatus(msg);
    setTimeout(() => {
      setExportStatus((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const handleSelectColorway = (colorId: string) => {
    setConfig((prev) => ({
      ...prev,
      cardiganColorId: colorId,
      customCardiganHex: null,
    }));
  };

  const handleRandomize = () => {
    const randomColor =
      CARDIGAN_COLORWAYS[Math.floor(Math.random() * CARDIGAN_COLORWAYS.length)];
    const randomHair = HAIR_TONES[Math.floor(Math.random() * HAIR_TONES.length)];
    const randomEye = EYE_TONES[Math.floor(Math.random() * EYE_TONES.length)];
    const drapes: DrapeStyle[] = [
      'one-shoulder-right',
      'one-shoulder-left',
      'both-neat',
      'extra-slouch',
    ];
    const inners: InnerOutfitId[] = [
      'camisole-maxi',
      'pleated-mini',
      'sailor-onepiece',
      'ribbed-knit',
    ];
    const expressions: ExpressionId[] = [
      'gentle-smile',
      'shy-blush',
      'sleepy-blink',
      'sparkle-happy',
    ];
    setConfig((prev) => ({
      ...prev,
      cardiganColorId: randomColor.id,
      customCardiganHex: null,
      hairToneId: randomHair.id,
      eyeToneId: randomEye.id,
      drapeStyle: drapes[Math.floor(Math.random() * drapes.length)],
      innerOutfit: inners[Math.floor(Math.random() * inners.length)],
      expression: expressions[Math.floor(Math.random() * expressions.length)],
    }));
    triggerStatus(`Preset acak diterapkan: ${randomColor.name}`);
  };

  const handleReset = () => {
    setConfig(DEFAULT_AVATAR_CONFIG);
    setIsolatedPart('both');
    triggerStatus('Dikembalikan ke desain asli referensi (Periwinkle Sky)');
  };

  const handleToggleLayer = (layerKey: keyof AvatarConfig['visibleLayers']) => {
    setConfig((prev) => ({
      ...prev,
      visibleLayers: {
        ...prev.visibleLayers,
        [layerKey]: !prev.visibleLayers[layerKey],
      },
    }));
  };

  const handleExportCostumePng = async () => {
    const slug = activePalette.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (renderEngine === 'reference-hd' && cardiganCanvasRef.current) {
      const ok = downloadPngFromCanvas(
        cardiganCanvasRef.current,
        `cardigan-costume-${slug}.png`
      );
      if (ok) {
        triggerStatus(`Berhasil mengunduh PNG transparan: cardigan-costume-${slug}.png`);
        return;
      }
    }
    const ok = await downloadPngFromSvg(
      cardiganAssetSvgRef.current,
      `cardigan-costume-${slug}.png`,
      1280,
      1200,
      null
    );
    if (ok) {
      triggerStatus(`Berhasil mengunduh PNG transparan: cardigan-costume-${slug}.png`);
    }
  };

  const handleExportCostumeSvg = () => {
    const slug = activePalette.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const ok = downloadSvgElement(
      cardiganAssetSvgRef.current,
      `cardigan-costume-${slug}.svg`
    );
    if (ok) {
      triggerStatus(`Berhasil mengunduh vektor SVG: cardigan-costume-${slug}.svg`);
    }
  };

  const handleExportAvatarPng = async () => {
    const slug = activePalette.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (renderEngine === 'reference-hd' && avatarCanvasRef.current) {
      const ok = downloadPngFromCanvas(
        avatarCanvasRef.current,
        `chibi-avatar-${slug}.png`
      );
      if (ok) {
        triggerStatus(`Berhasil mengunduh Avatar PNG: chibi-avatar-${slug}.png`);
        return;
      }
    }
    const bg =
      backdrop === 'transparent-grid'
        ? null
        : backdrop === 'night-slate'
          ? '#1E222B'
          : backdrop === 'cream-paper'
            ? '#FAF6EE'
            : '#FFFFFF';
    const ok = await downloadPngFromSvg(
      avatarSvgRef.current,
      `chibi-avatar-${slug}.png`,
      1200,
      2100,
      bg
    );
    if (ok) {
      triggerStatus(`Berhasil mengunduh Avatar PNG: chibi-avatar-${slug}.png`);
    }
  };

  const handleExportAvatarSvg = () => {
    const slug = activePalette.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const ok = downloadSvgElement(avatarSvgRef.current, `chibi-avatar-${slug}.svg`);
    if (ok) {
      triggerStatus(`Berhasil mengunduh Avatar SVG: chibi-avatar-${slug}.svg`);
    }
  };

  const handleCopyEmbedSnippet = () => {
    const snippet = `<!-- Malang Slouch Cardigan Web Avatar Costume Layer -->
<div class="avatar-stage" style="position:relative;width:400px;height:700px;">
  <img src="/assets/chibi-base.svg" style="position:absolute;inset:0;z-index:20;" alt="Base Avatar" />
  <img src="/assets/cardigan-costume-${activePalette.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.svg"
       style="position:absolute;inset:0;z-index:45;transform:translate(${manifest.layers[5].anchorOffset.x}px, ${manifest.layers[5].anchorOffset.y}px);"
       alt="${activePalette.name} Cardigan Costume" />
</div>`;
    navigator.clipboard?.writeText(snippet);
    setCopiedCode(true);
    triggerStatus('Kode sematan HTML/CSS disalin ke clipboard');
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const stageBgClass =
    backdrop === 'transparent-grid'
      ? 'bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:16px_16px] bg-slate-50'
      : backdrop === 'night-slate'
        ? 'bg-[#1E222B] text-white'
        : backdrop === 'cream-paper'
          ? 'bg-[#FAF6EE]'
          : 'bg-white';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#231F20]">
      {/* =================================================================
          TOP BAR CONTRACT (3 Zones: Brand Wordmark | 4 Nav Links | 1 Primary CTA)
         ================================================================= */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-8 px-6 lg:px-10 py-4 bg-[#FAF8F5]/95 backdrop-blur border-b border-[#E6DFD5]">
        <a
          href="#studio"
          className="text-lg font-bold tracking-tight text-[#231F20] whitespace-nowrap shrink-0"
          style={{fontFamily: 'var(--font-display), serif'}}
        >
          Malang Atelier
        </a>

        <nav
          aria-label="Navigasi Utama"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#5C534E]"
        >
          <a
            href="#studio"
            className="hover:text-[#231F20] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Avatar Studio
          </a>
          <a
            href="#colorway-rack"
            className="hover:text-[#231F20] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Colorway Rack
          </a>
          <a
            href="#layer-spec"
            className="hover:text-[#231F20] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Asset Layers
          </a>
          <a
            href="#reference-sheet"
            className="hover:text-[#231F20] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Reference
          </a>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleExportCostumePng}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#231F20] rounded-lg hover:bg-[#3A3435] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Export Costume PNG
          </button>
        </div>
      </header>

      {/* =================================================================
          MAIN WORKSPACE & HERO STUDIO
         ================================================================= */}
      <main className="flex-1 max-w-[1380px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-14">
        {/* Hero Intro & Status Bar */}
        <section id="studio" className="scroll-mt-20 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[#E6DFD5] pb-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-xs text-[#6E655F] font-medium">
                <span>Web Avatar Costume Asset</span>
                <span aria-hidden="true">·</span>
                <span>한쪽이 흘러내린 말랑블리폭딱샤랄라 가디건</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{activeLayerCount}/8 Active Layers</span>
              </div>
              <h1
                className="text-3xl sm:text-4xl font-bold tracking-tight text-[#231F20]"
                style={{
                  fontFamily: 'var(--font-display), serif',
                  textWrap: 'balance',
                }}
              >
                One-Shoulder Slouchy Cardigan & Chibi Avatar Costume Studio
              </h1>
              <p className="text-sm sm:text-base text-[#5C534E] leading-relaxed">
                Aset kostum vektor modular yang direkonstruksi langsung dari ilustrasi
                referensi Anda. Kustomisasi 7 palet warna asli, gaya bahu melorot
                (moe-sleeve), gaun dalaman, hingga unduh sprite transparan SVG/PNG
                siap pakai untuk sistem avatar web.
              </p>
            </div>

            {/* Quick Workspace Toolbar */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setShowSideBySideRef((v) => !v)}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  showSideBySideRef
                    ? 'bg-[#231F20] text-white border-[#231F20]'
                    : 'bg-white text-[#231F20] border-[#D8CFC4] hover:bg-[#F3EFEA]'
                }`}
              >
                {showSideBySideRef ? 'Tutup Gambar Asli' : 'Bandingkan Gambar Asli'}
              </button>
              <button
                type="button"
                onClick={handleRandomize}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#231F20] bg-white border border-[#D8CFC4] rounded-lg hover:bg-[#F3EFEA] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Shuffle className="w-3.5 h-3.5" />
                Acak Gaya
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#5C534E] bg-white border border-[#D8CFC4] rounded-lg hover:text-[#231F20] hover:bg-[#F3EFEA] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Asli
              </button>
            </div>
          </div>

          {/* Feedback Banner when Exporting or Randomizing */}
          {exportStatus && (
            <div
              role="status"
              className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-[#231F20] text-white text-xs font-medium"
            >
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#A3B7D8]" />
                <span>{exportStatus}</span>
              </div>
              <button
                type="button"
                onClick={() => setExportStatus(null)}
                className="text-white/70 hover:text-white text-xs whitespace-nowrap"
              >
                Tutup
              </button>
            </div>
          )}

          {/* ===============================================================
              12-COLUMN STUDIO GRID: LEFT AVATAR STAGE (7 COL) | RIGHT CONTROLS (5 COL)
             =============================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT STAGE: Interactive Chibi Avatar + Standalone Costume Preview */}
            <div className="lg:col-span-7 space-y-4">
              <div
                className={`relative rounded-2xl border border-[#E2DAD0] overflow-hidden transition-colors ${stageBgClass}`}
              >
                {/* Stage Header Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5 border-b border-[#E2DAD0]/70 bg-white/80 backdrop-blur text-[#231F20]">
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <span className="font-semibold text-[#231F20]">
                      {activePalette.name}
                    </span>
                    <span aria-hidden="true" className="text-[#9E948C]">
                      ·
                    </span>
                    <span className="text-[#6E655F]">{activePalette.koreanSub}</span>
                    <span aria-hidden="true" className="text-[#9E948C]">
                      ·
                    </span>
                    <span className="font-mono text-[11px] text-[#5C534E] tabular-nums">
                      {activePalette.fill}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Render Mode Toggle: Reference HD vs Vector SVG */}
                    <div
                      role="group"
                      aria-label="Mode Render"
                      className="flex items-center gap-1 bg-[#F3EFEA] p-1 rounded-lg"
                    >
                      <button
                        type="button"
                        onClick={() => setRenderEngine('reference-hd')}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          renderEngine === 'reference-hd'
                            ? 'bg-[#231F20] text-white shadow-xs'
                            : 'text-[#6E655F] hover:text-[#231F20]'
                        }`}
                      >
                        Sprite Asli HD
                      </button>
                      <button
                        type="button"
                        onClick={() => setRenderEngine('vector-svg')}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          renderEngine === 'vector-svg'
                            ? 'bg-[#231F20] text-white shadow-xs'
                            : 'text-[#6E655F] hover:text-[#231F20]'
                        }`}
                      >
                        Vektor SVG
                      </button>
                    </div>

                    {/* Backdrop Switcher */}
                    <div
                      role="group"
                      aria-label="Latar Kanvas"
                      className="flex items-center gap-1 bg-[#F3EFEA] p-1 rounded-lg"
                    >
                      {(
                        [
                          {id: 'studio-white', label: 'Putih'},
                          {id: 'cream-paper', label: 'Krem'},
                          {id: 'transparent-grid', label: 'Grid PNG'},
                          {id: 'night-slate', label: 'Gelap'},
                        ] as const
                      ).map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => setBackdrop(b.id)}
                          className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            backdrop === b.id
                              ? 'bg-white text-[#231F20] shadow-xs'
                              : 'text-[#6E655F] hover:text-[#231F20]'
                          }`}
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Main Visual Canvas Split: Dressed Chibi + Isolated Cardigan Asset */}
                <div className="grid grid-cols-1 md:grid-cols-12 items-center p-6 gap-6 min-h-[540px]">
                  {/* Dressed Chibi Character */}
                  <div
                    className={`${
                      showSideBySideRef ? 'md:col-span-6' : 'md:col-span-7'
                    } flex flex-col items-center justify-center`}
                  >
                    <div className="w-full max-w-[310px] h-[470px] flex items-center justify-center relative">
                      {renderEngine === 'reference-hd' ? (
                        <>
                          <ReferenceAvatarCanvas
                            config={config}
                            canvasRef={avatarCanvasRef}
                          />
                          {/* Hidden SVG kept in sync for instant .SVG export */}
                          <div className="sr-only" aria-hidden="true">
                            <ChibiAvatarCanvas config={config} svgRef={avatarSvgRef} />
                          </div>
                        </>
                      ) : (
                        <ChibiAvatarCanvas config={config} svgRef={avatarSvgRef} />
                      )}
                    </div>
                    <span className="text-[11px] text-[#6E655F] font-medium mt-1">
                      {renderEngine === 'reference-hd'
                        ? 'Preview Avatar Sprite Asli (100% Presisi Gambar Referensi)'
                        : `Preview Avatar Vektor SVG (${config.drapeStyle})`}
                    </span>
                  </div>

                  {/* Side-by-side Reference OR Isolated Wearable Costume Card */}
                  {showSideBySideRef ? (
                    <div className="md:col-span-6 flex flex-col items-center justify-center space-y-2 border-t md:border-t-0 md:border-l border-[#E2DAD0]/70 pt-4 md:pt-0 md:pl-4">
                      <div className="relative w-full aspect-[4/3.6] rounded-xl overflow-hidden border border-[#E2DAD0] bg-white">
                        <Image
                          src="/assets/aistudio/HVpcv1tb0AAKd05_e039af5f.jpeg"
                          alt="Referensi Asli Kostum Cardigan Chibi"
                          fill
                          sizes="(max-width: 768px) 100vw, 400px"
                          className="object-contain p-2"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="text-[11px] text-[#6E655F] font-medium">
                        Gambar Referensi Asli Anda
                      </span>
                    </div>
                  ) : (
                    <div className="md:col-span-5 flex flex-col items-center justify-between bg-[#FAF8F5]/90 text-[#231F20] rounded-xl border border-[#E2DAD0] p-4 space-y-3">
                      <div className="w-full flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#231F20]">
                          Aset Kostum Lepasan
                        </span>
                        <span className="font-mono text-[11px] text-[#6E655F] tabular-nums">
                          {renderEngine === 'reference-hd' ? 'HD Sprite' : '2-Part SVG'}
                        </span>
                      </div>

                      {/* Isolated Cardigan Sprite */}
                      <div className="w-full h-52 flex items-center justify-center relative">
                        {renderEngine === 'reference-hd' ? (
                          <>
                            <ReferenceCardiganSprite
                              fill={activePalette.fill}
                              isolatedPart={isolatedPart}
                              canvasRef={cardiganCanvasRef}
                            />
                            <div className="sr-only" aria-hidden="true">
                              <SingleCardiganSprite
                                fill={activePalette.fill}
                                shadow={activePalette.shadow}
                                DrapeStyleOverride={config.drapeStyle}
                                isolatedPart={isolatedPart}
                                svgRef={cardiganAssetSvgRef}
                              />
                            </div>
                          </>
                        ) : (
                          <SingleCardiganSprite
                            fill={activePalette.fill}
                            shadow={activePalette.shadow}
                            DrapeStyleOverride={config.drapeStyle}
                            isolatedPart={isolatedPart}
                            svgRef={cardiganAssetSvgRef}
                          />
                        )}
                      </div>

                      {/* Part Selector (Both / Right Slouch / Left Neat) */}
                      <div className="w-full flex items-center gap-1 bg-[#EDE7DF] p-1 rounded-lg">
                        {(
                          [
                            {id: 'both', label: 'Sepasang'},
                            {id: 'slouch-half', label: 'Kanan Melorot'},
                            {id: 'neat-half', label: 'Kiri Rapi'},
                          ] as const
                        ).map((part) => (
                          <button
                            key={part.id}
                            type="button"
                            onClick={() => setIsolatedPart(part.id)}
                            className={`flex-1 py-1 px-2 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                              isolatedPart === part.id
                                ? 'bg-white text-[#231F20] shadow-xs'
                                : 'text-[#5C534E] hover:text-[#231F20]'
                            }`}
                          >
                            {part.label}
                          </button>
                        ))}
                      </div>

                      {/* Direct Costume Asset Download Buttons */}
                      <div className="w-full grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={handleExportCostumeSvg}
                          className="inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-[#231F20] bg-white border border-[#D8CFC4] rounded-lg hover:bg-[#F3EFEA] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Unduh SVG
                        </button>
                        <button
                          type="button"
                          onClick={handleExportCostumePng}
                          className="inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-[#231F20] rounded-lg hover:bg-[#3A3435] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Unduh PNG
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Stage Bottom Bar: Full Avatar Export Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-t border-[#E2DAD0]/70 bg-white/90 text-[#231F20]">
                  <div className="flex items-center gap-2 text-xs text-[#5C534E]">
                    <span>Ekspor Karakter Penuh:</span>
                    <button
                      type="button"
                      onClick={handleExportAvatarSvg}
                      className="underline hover:text-[#231F20] font-medium whitespace-nowrap cursor-pointer"
                    >
                      Avatar .SVG
                    </button>
                    <span aria-hidden="true">·</span>
                    <button
                      type="button"
                      onClick={handleExportAvatarPng}
                      className="underline hover:text-[#231F20] font-medium whitespace-nowrap cursor-pointer"
                    >
                      Avatar .PNG (1200×2100)
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      downloadJsonFile(manifest, 'malang-cardigan-manifest.json')
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5C534E] hover:text-[#231F20] whitespace-nowrap cursor-pointer"
                  >
                    <FileCode2 className="w-3.5 h-3.5" />
                    Unduh Layer Manifest (.JSON)
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL: Customization Controls (Cardigan / Character / Layers) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E2DAD0] p-6 space-y-6">
              {/* Segmented Studio Tabs */}
              <div
                role="tablist"
                aria-label="Kategori Kustomisasi"
                className="grid grid-cols-3 gap-1 p-1 bg-[#F3EFEA] rounded-xl"
              >
                <button
                  role="tab"
                  aria-selected={activeTab === 'cardigan'}
                  type="button"
                  onClick={() => setActiveTab('cardigan')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === 'cardigan'
                      ? 'bg-white text-[#231F20] shadow-xs'
                      : 'text-[#5C534E] hover:text-[#231F20]'
                  }`}
                >
                  <Shirt className="w-3.5 h-3.5" />
                  Kostum Cardigan
                </button>
                <button
                  role="tab"
                  aria-selected={activeTab === 'character'}
                  type="button"
                  onClick={() => setActiveTab('character')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === 'character'
                      ? 'bg-white text-[#231F20] shadow-xs'
                      : 'text-[#5C534E] hover:text-[#231F20]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Dalaman & Avatar
                </button>
                <button
                  role="tab"
                  aria-selected={activeTab === 'layers'}
                  type="button"
                  onClick={() => setActiveTab('layers')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === 'layers'
                      ? 'bg-white text-[#231F20] shadow-xs'
                      : 'text-[#5C534E] hover:text-[#231F20]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  Layer ({activeLayerCount})
                </button>
              </div>

              {/* TAB 1: CARDIGAN COSTUME CONTROLS */}
              {activeTab === 'cardigan' && (
                <div className="space-y-6">
                  {/* 7 Official Reference Colorways */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-[#231F20]">
                        01. Palet Warna Cardigan Referensi (7 Warna)
                      </label>
                      <span className="text-xs text-[#6E655F] font-mono tabular-nums">
                        {activePalette.fill}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {CARDIGAN_COLORWAYS.map((c) => {
                        const isSelected =
                          !config.customCardiganHex && config.cardiganColorId === c.id;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => handleSelectColorway(c.id)}
                            className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'border-[#231F20] bg-[#FAF8F5] ring-1 ring-[#231F20]'
                                : 'border-[#E6DFD5] hover:border-[#B8AEA2] bg-white'
                            }`}
                          >
                            <span
                              className="w-7 h-7 rounded-lg border border-[#231F20]/30 shrink-0"
                              style={{backgroundColor: c.fill}}
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold text-[#231F20] truncate">
                                {c.name}
                              </p>
                              <p className="text-[11px] text-[#6E655F] truncate">
                                {c.koreanSub}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom Hex Picker */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#F0EAE1]">
                      <label
                        htmlFor="custom-cardigan-color"
                        className="text-xs font-medium text-[#5C534E]"
                      >
                        Atau pilih warna kustom bebas:
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          id="custom-cardigan-color"
                          type="color"
                          value={config.customCardiganHex || activePalette.fill}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              customCardiganHex: e.target.value,
                            }))
                          }
                          className="w-8 h-8 rounded cursor-pointer border border-[#D8CFC4]"
                        />
                        {config.customCardiganHex && (
                          <button
                            type="button"
                            onClick={() =>
                              setConfig((prev) => ({...prev, customCardiganHex: null}))
                            }
                            className="text-xs text-[#5C534E] underline hover:text-[#231F20] whitespace-nowrap"
                          >
                            Hapus Kustom
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Drape Style (One-Shoulder Slouch vs Neat) */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-semibold text-[#231F20] block">
                      02. Gaya Jatuhan Bahu (Shoulder Drape Pose)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(
                        [
                          {
                            id: 'one-shoulder-right',
                            label: 'Bahu Kanan Melorot (Asli)',
                          },
                          {
                            id: 'extra-slouch',
                            label: 'Ekstra Oversize Slouch',
                          },
                          {
                            id: 'both-neat',
                            label: 'Rapi di Kedua Bahu',
                          },
                          {
                            id: 'one-shoulder-left',
                            label: 'Bahu Kiri Melorot',
                          },
                        ] as const
                      ).map((d) => (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() =>
                            setConfig((prev) => ({...prev, drapeStyle: d.id}))
                          }
                          className={`py-2.5 px-3 text-xs font-medium rounded-lg border text-left transition-colors whitespace-nowrap truncate cursor-pointer ${
                            config.drapeStyle === d.id
                              ? 'bg-[#231F20] text-white border-[#231F20]'
                              : 'bg-white text-[#231F20] border-[#E2DAD0] hover:bg-[#FAF8F5]'
                          }`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Accessories */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-semibold text-[#231F20] block">
                      03. Aksesori Pelengkap Kostum
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(
                        [
                          {id: 'none', label: 'Tanpa Aksesori (Asli)'},
                          {id: 'pearl-clip', label: 'Jepit Mutiara'},
                          {id: 'satchel-bag', label: 'Tas Selempang Kulit'},
                          {id: 'beret', label: 'Topi Baret Senada'},
                        ] as const
                      ).map((acc) => (
                        <button
                          key={acc.id}
                          type="button"
                          onClick={() =>
                            setConfig((prev) => ({
                              ...prev,
                              accessory: acc.id as AccessoryId,
                            }))
                          }
                          className={`py-2 px-3 text-xs font-medium rounded-lg border text-left transition-colors whitespace-nowrap truncate cursor-pointer ${
                            config.accessory === acc.id
                              ? 'bg-[#231F20] text-white border-[#231F20]'
                              : 'bg-white text-[#231F20] border-[#E2DAD0] hover:bg-[#FAF8F5]'
                          }`}
                        >
                          {acc.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: INNER DRESS, HAIR, EYES & EXPRESSION */}
              {activeTab === 'character' && (
                <div className="space-y-5">
                  {/* Inner Dress Type */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#231F20] block">
                      01. Gaun Dalaman (Inner Dress)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(
                        [
                          {id: 'camisole-maxi', label: 'Camisole Maxi (Asli)'},
                          {id: 'pleated-mini', label: 'Pleated Mini Dress'},
                          {id: 'sailor-onepiece', label: 'Sailor Collar Dress'},
                          {id: 'ribbed-knit', label: 'Ribbed Knit Long'},
                        ] as const
                      ).map((inner) => (
                        <button
                          key={inner.id}
                          type="button"
                          onClick={() =>
                            setConfig((prev) => ({...prev, innerOutfit: inner.id}))
                          }
                          className={`py-2 px-3 text-xs font-medium rounded-lg border text-left transition-colors whitespace-nowrap truncate cursor-pointer ${
                            config.innerOutfit === inner.id
                              ? 'bg-[#231F20] text-white border-[#231F20]'
                              : 'bg-white text-[#231F20] border-[#E2DAD0] hover:bg-[#FAF8F5]'
                          }`}
                        >
                          {inner.label}
                        </button>
                      ))}
                    </div>

                    {/* Inner Dress Color Swatches */}
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-xs text-[#6E655F]">Warna Gaun:</span>
                      {[
                        {hex: '#FFFFFF', name: 'Putih Asli'},
                        {hex: '#FAF3E6', name: 'Krem Gading'},
                        {hex: '#28282B', name: 'Hitam Malam'},
                        {hex: '#F7E1E6', name: 'Pink Muda'},
                        {hex: '#DCE6F5', name: 'Biru Es'},
                      ].map((sw) => (
                        <button
                          key={sw.hex}
                          type="button"
                          aria-label={`Warna gaun ${sw.name}`}
                          onClick={() =>
                            setConfig((prev) => ({...prev, innerColor: sw.hex}))
                          }
                          className={`w-6 h-6 rounded-full border transition-transform cursor-pointer ${
                            config.innerColor === sw.hex
                              ? 'border-[#231F20] scale-110 ring-2 ring-[#231F20]/20'
                              : 'border-[#BDB4A9]'
                          }`}
                          style={{backgroundColor: sw.hex}}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Hair Tone & Braids */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#231F20] block">
                      02. Warna Rambut & Kepang Mahkota
                    </label>
                    <div className="grid grid-cols-1 gap-1.5">
                      {HAIR_TONES.map((h) => (
                        <button
                          key={h.id}
                          type="button"
                          onClick={() =>
                            setConfig((prev) => ({...prev, hairToneId: h.id}))
                          }
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                            config.hairToneId === h.id
                              ? 'border-[#231F20] bg-[#FAF8F5] font-semibold'
                              : 'border-[#E6DFD5] bg-white hover:bg-[#FAF8F5]'
                          }`}
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-[#231F20]/30 shrink-0"
                            style={{backgroundColor: h.base}}
                          />
                          <span className="truncate">{h.name}</span>
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 pt-1">
                      <label className="inline-flex items-center gap-2 text-xs text-[#231F20] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config.showBraids}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              showBraids: e.target.checked,
                            }))
                          }
                          className="rounded border-[#D8CFC4]"
                        />
                        <span>Kepang Rambut (Crown Braids)</span>
                      </label>
                      <label className="inline-flex items-center gap-2 text-xs text-[#231F20] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config.showAhoge}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              showAhoge: e.target.checked,
                            }))
                          }
                          className="rounded border-[#D8CFC4]"
                        />
                        <span>Tunas Rambut (Ahoge)</span>
                      </label>
                    </div>
                  </div>

                  {/* Eye Color & Expression */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#231F20] block">
                      03. Warna Mata & Ekspresi Wajah
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {EYE_TONES.map((e) => (
                        <button
                          key={e.id}
                          type="button"
                          onClick={() =>
                            setConfig((prev) => ({...prev, eyeToneId: e.id}))
                          }
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                            config.eyeToneId === e.id
                              ? 'border-[#231F20] bg-[#FAF8F5] font-semibold'
                              : 'border-[#E6DFD5] bg-white'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-[#231F20]/30 shrink-0"
                            style={{backgroundColor: e.iris}}
                          />
                          <span className="truncate">{e.name}</span>
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {(
                        [
                          {id: 'gentle-smile', label: 'Senyum Lembut (Asli)'},
                          {id: 'shy-blush', label: 'Malu Merona'},
                          {id: 'sparkle-happy', label: 'Ceria Berbinar'},
                          {id: 'sleepy-blink', label: 'Kedip Nyaman'},
                        ] as const
                      ).map((exp) => (
                        <button
                          key={exp.id}
                          type="button"
                          onClick={() =>
                            setConfig((prev) => ({...prev, expression: exp.id}))
                          }
                          className={`py-2 px-3 text-xs font-medium rounded-lg border text-left transition-colors whitespace-nowrap truncate cursor-pointer ${
                            config.expression === exp.id
                              ? 'bg-[#231F20] text-white border-[#231F20]'
                              : 'bg-white text-[#231F20] border-[#E2DAD0]'
                          }`}
                        >
                          {exp.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Shoes */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#231F20] block">
                      04. Sepatu (Footwear)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(
                        [
                          {id: 'ribbon-flats', label: 'Pita Flats (Asli)'},
                          {id: 'mary-janes', label: 'Mary Janes'},
                          {id: 'knit-socks', label: 'Kaos Kaki Rajut'},
                        ] as const
                      ).map((sh) => (
                        <button
                          key={sh.id}
                          type="button"
                          onClick={() =>
                            setConfig((prev) => ({
                              ...prev,
                              shoeStyle: sh.id as ShoeStyleId,
                            }))
                          }
                          className={`py-2 px-2.5 text-xs font-medium rounded-lg border text-center transition-colors whitespace-nowrap truncate cursor-pointer ${
                            config.shoeStyle === sh.id
                              ? 'bg-[#231F20] text-white border-[#231F20]'
                              : 'bg-white text-[#231F20] border-[#E2DAD0]'
                          }`}
                        >
                          {sh.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: LAYER Z-INDEX INSPECTOR */}
              {activeTab === 'layers' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[#5C534E]">
                      Nyalakan atau matikan masing-masing layer sprite untuk
                      mengecek pemisahan aset kostum:
                    </p>
                  </div>

                  <div className="space-y-2">
                    {manifest.layers
                      .slice()
                      .reverse()
                      .map((layer) => {
                        const key = layer.id as keyof AvatarConfig['visibleLayers'];
                        return (
                          <div
                            key={layer.id}
                            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-[#E6DFD5] bg-[#FAF8F5]"
                          >
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-[#231F20] truncate">
                                {layer.label}
                              </p>
                              <p className="text-[11px] font-mono text-[#6E655F] tabular-nums">
                                z-index: {layer.zIndex} · offset ({layer.anchorOffset.x},{' '}
                                {layer.anchorOffset.y})
                              </p>
                            </div>
                            <button
                              type="button"
                              aria-label={`Toggle layer ${layer.label}`}
                              onClick={() => handleToggleLayer(key)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                                layer.visible
                                  ? 'bg-[#231F20] text-white'
                                  : 'bg-white text-[#6E655F] border border-[#D8CFC4]'
                              }`}
                            >
                              {layer.visible ? (
                                <>
                                  <Eye className="w-3.5 h-3.5" />
                                  Aktif
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-3.5 h-3.5" />
                                  Nonaktif
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* =================================================================
            SECTION 2: INTERACTIVE 2-ROW BOUTIQUE RACK (MATCHING REFERENCE)
           ================================================================= */}
        <section
          id="colorway-rack"
          className="scroll-mt-20 bg-white rounded-2xl border border-[#E2DAD0] p-6 sm:p-10 space-y-8"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#F0EAE1] pb-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-[#6E655F]">
                <span>01. Koleksi Warna Lengkap</span>
                <span aria-hidden="true">·</span>
                <span>7 Varian Warna Siap Unduh</span>
              </div>
              <h2
                className="text-2xl font-bold text-[#231F20]"
                style={{fontFamily: 'var(--font-display), serif'}}
              >
                Rak Display Aset Cardigan (Sesuai Lembar Referensi)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#5C534E] max-w-md">
              Susunan 2 baris di bawah ini mereproduksi tata letak lembar aset asli
              Anda. Klik cardigan mana pun untuk mengganti kostum pada avatar.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Interactive 2-Row Fanned Rack */}
            <div className="lg:col-span-6 bg-[#FAF8F5] rounded-2xl border border-[#EAE3D9] p-6">
              <CardiganRackShowcase
                selectedColorId={config.cardiganColorId}
                onSelectColor={(c) => handleSelectColorway(c.id)}
              />
            </div>

            {/* Individual Colorway Cards Grid for Direct Asset Inspection */}
            <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {CARDIGAN_COLORWAYS.map((item) => {
                const isSelected =
                  !config.customCardiganHex && config.cardiganColorId === item.id;
                return (
                  <div
                    key={item.id}
                    className={`flex flex-col justify-between rounded-xl border p-3.5 transition-all ${
                      isSelected
                        ? 'border-[#231F20] bg-[#FAF8F5] shadow-xs'
                        : 'border-[#E6DFD5] bg-white hover:border-[#B8AEA2]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectColorway(item.id)}
                      className="w-full text-left cursor-pointer space-y-2"
                    >
                      <div className="h-28 w-full flex items-center justify-center bg-[#FAF8F5] rounded-lg p-2">
                        <ReferenceCardiganSprite fill={item.fill} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#231F20] truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-[#6E655F] font-mono tabular-nums">
                          {item.fill}
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleSelectColorway(item.id);
                        setTimeout(() => {
                          handleExportCostumePng();
                        }, 60);
                      }}
                      className="mt-3 w-full py-1.5 px-2.5 text-[11px] font-semibold text-[#231F20] bg-white border border-[#D8CFC4] rounded-lg hover:bg-[#231F20] hover:text-white transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Pakai & Unduh PNG
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =================================================================
            SECTION 3: WEB AVATAR INTEGRATION & REFERENCE COMPARISON
           ================================================================= */}
        <section
          id="layer-spec"
          className="scroll-mt-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
        >
          {/* Left: Web Integration Code & Z-Index Architecture */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E2DAD0] p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-[#6E655F]">
                <span>02. Integrasi Web & Game 2D</span>
                <span aria-hidden="true">·</span>
                <span>Standar Layering SVG/PNG</span>
              </div>
              <h2
                className="text-xl sm:text-2xl font-bold text-[#231F20]"
                style={{fontFamily: 'var(--font-display), serif'}}
              >
                Cara Memasang Aset Kostum di Web Avatar Anda
              </h2>
              <p className="text-sm text-[#5C534E] leading-relaxed">
                Aset cardigan ini dipisah menjadi panel kiri rapi (
                <code className="font-mono text-xs">z-index: 40</code>) dan lengan
                kanan melorot (<code className="font-mono text-xs">z-index: 45</code>)
                agar jatuh secara alami di atas gaun dalaman (
                <code className="font-mono text-xs">z-index: 30</code>) namun tetap
                di bawah helaian rambut depan (
                <code className="font-mono text-xs">z-index: 60</code>).
              </p>
            </div>

            <div className="rounded-xl bg-[#1E1E20] text-[#F5F2EB] p-4 font-mono text-xs overflow-x-auto space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-[#A3B7D8]">avatar-costume-embed.html</span>
                <button
                  type="button"
                  onClick={handleCopyEmbedSnippet}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[11px] font-sans font-medium whitespace-nowrap cursor-pointer"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Tersalin
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Salin Snippet
                    </>
                  )}
                </button>
              </div>
              <pre className="leading-relaxed text-[11px] sm:text-xs">
{`<div class="avatar-container" style="position:relative; width:400px; height:700px;">
  <!-- 1. Back Hair & Base Chibi Body -->
  <img src="layer-10-back-hair.svg" style="position:absolute; inset:0; z-index:10;" />
  <img src="layer-20-base-body.svg" style="position:absolute; inset:0; z-index:20;" />
  <!-- 2. Inner Camisole Maxi Dress -->
  <img src="layer-30-camisole-dress.svg" style="position:absolute; inset:0; z-index:30;" />
  <!-- 3. One-Shoulder Slouchy Cardigan (${activePalette.name}) -->
  <img src="cardigan-costume-${activePalette.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.svg"
       style="position:absolute; inset:0; z-index:45;" />
  <!-- 4. Face & Braided Front Hair -->
  <img src="layer-60-braided-front-hair.svg" style="position:absolute; inset:0; z-index:60;" />
</div>`}
              </pre>
            </div>
          </div>

          {/* Right: Original Uploaded Image Reference Card */}
          <div
            id="reference-sheet"
            className="scroll-mt-20 lg:col-span-5 bg-white rounded-2xl border border-[#E2DAD0] p-6 sm:p-8 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-[#6E655F]">
                <span>03. Lembar Referensi Asli</span>
                <span aria-hidden="true">·</span>
                <span>Sumber Desain</span>
              </div>
              <h3
                className="text-lg font-bold text-[#231F20]"
                style={{fontFamily: 'var(--font-display), serif'}}
              >
                Ilustrasi Referensi yang Anda Unggah
              </h3>
            </div>

            <div className="relative w-full aspect-[4/3.5] rounded-xl overflow-hidden border border-[#EAE3D9] bg-[#FAF8F5]">
              <Image
                src="/assets/aistudio/HVpcv1tb0AAKd05_e039af5f.jpeg"
                alt="Lembar Referensi Asli Cardigan Avatar"
                fill
                sizes="(max-width: 1024px) 100vw, 520px"
                className="object-contain p-3"
                referrerPolicy="no-referrer"
              />
            </div>

            <p className="text-xs text-[#5C534E] leading-relaxed">
              Seluruh proporsi garis, lengan kanan yang melorot menutup tangan,
              lipatan kerah, manset rajut bergaris, serta ketujuh warna cardigan telah
              dikonversi menjadi komponen vektor interaktif.
            </p>
          </div>
        </section>
      </main>

      {/* =================================================================
          CLEAN FOOTER
         ================================================================= */}
      <footer className="border-t border-[#E6DFD5] bg-white py-6 px-6 lg:px-10 mt-12">
        <div className="max-w-[1380px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6E655F]">
          <span>
            Malang Atelier — Web Avatar Costume & Vector Sprite Generator
          </span>
          <div className="flex items-center gap-4">
            <a href="#studio" className="hover:text-[#231F20] transition-colors">
              Kembali ke Atas
            </a>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={handleExportCostumeSvg}
              className="hover:text-[#231F20] underline cursor-pointer"
            >
              Unduh Aset SVG
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
