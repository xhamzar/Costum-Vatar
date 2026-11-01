'use client';

import React, {useEffect, useRef, useState} from 'react';
import {
  AvatarConfig,
  HAIR_TONES,
  EYE_TONES,
  resolveCardiganPalette,
} from '@/lib/avatar-costume';

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  return [(num >> 16) & 0xff, (num >> 8) & 0xff, num & 0xff];
}

interface CachedMasks {
  cw: number;
  ch: number;
  origData: Uint8ClampedArray;
  isExterior: Uint8Array;
  isCardiganLeftSlouchFill: Uint8Array;
  isCardiganRightNeatFill: Uint8Array;
  isCardiganLeftSlouchSprite: Uint8Array;
  isCardiganRightNeatSprite: Uint8Array;
  isDressFill: Uint8Array;
  isHairFill: Uint8Array;
  isEyeIrisFill: Uint8Array;
  isShoeBowFill: Uint8Array;
  // Unoccluded standalone cardigan parts from the right-hand rack
  rackW: number;
  rackH: number;
  rackOrigData: Uint8ClampedArray;
  isRackLeftFill: Uint8Array;
  isRackLeftSprite: Uint8Array;
  isRackRightFill: Uint8Array;
  isRackRightSprite: Uint8Array;
}

let globalCachedMasks: CachedMasks | null = null;
let loadingPromise: Promise<CachedMasks> | null = null;

function loadAndSegmentReference(): Promise<CachedMasks> {
  if (globalCachedMasks) return Promise.resolve(globalCachedMasks);
  if (loadingPromise) return loadingPromise;

  loadingPromise = new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // 1. Character Crop: x = 20..490 (cw = 470), y = 40..1000 (ch = 960)
      const cw = 470;
      const ch = 960;
      const c = document.createElement('canvas');
      c.width = cw;
      c.height = ch;
      const ctx = c.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas 2D context unavailable'));
        return;
      }
      ctx.drawImage(img, 20, 40, cw, ch, 0, 0, cw, ch);
      const origData = new Uint8ClampedArray(ctx.getImageData(0, 0, cw, ch).data);

      const lumAt = (idx: number) =>
        0.299 * origData[idx * 4] +
        0.587 * origData[idx * 4 + 1] +
        0.114 * origData[idx * 4 + 2];

      // A. Exterior background + enclosed hair/leg gap BFS
      const isExterior = new Uint8Array(cw * ch);
      const extSeeds: Array<[number, number]> = [
        [0, 0],
        [cw - 1, 0],
        [0, ch - 1],
        [cw - 1, ch - 1],
        [78, 178], // top-left hair loop gap
        [384, 240], // top-right hair loop gap
        [362, 425], // mid-right hair loop gap
        [128, 578], // left under-sleeve hair gap
        [366, 540], // right under-sleeve hair gap
        [322, 608], // lower-right hair curl gap
        [242, 880], // gap between ankles
      ];
      const q: number[] = [];
      for (const [sx, sy] of extSeeds) {
        const sIdx = sy * cw + sx;
        if (lumAt(sIdx) > 225) {
          isExterior[sIdx] = 1;
          q.push(sIdx);
        }
      }
      let head = 0;
      while (head < q.length) {
        const curr = q[head++];
        const cx = curr % cw;
        const cy = (curr / cw) | 0;
        const nbs: number[] = [];
        if (cx > 0) nbs.push(curr - 1);
        if (cx < cw - 1) nbs.push(curr + 1);
        if (cy > 0) nbs.push(curr - cw);
        if (cy < ch - 1) nbs.push(curr + cw);
        for (const nb of nbs) {
          if (!isExterior[nb] && lumAt(nb) > 218) {
            isExterior[nb] = 1;
            q.push(nb);
          }
        }
      }

      // B. Dress White Fill BFS from interior dress seeds
      const isDressFill = new Uint8Array(cw * ch);
      const dressSeeds: Array<[number, number]> = [
        [225, 390], // upper bodice
        [195, 550], // left skirt pleat
        [222, 550], // center-left skirt pleat
        [246, 550], // center-right skirt pleat
        [285, 550], // right skirt pleat
      ];
      const dq: number[] = [];
      for (const [sx, sy] of dressSeeds) {
        const sIdx = sy * cw + sx;
        isDressFill[sIdx] = 1;
        dq.push(sIdx);
      }
      let dHead = 0;
      while (dHead < dq.length) {
        const curr = dq[dHead++];
        const cx = curr % cw;
        const cy = (curr / cw) | 0;
        if (cy < 320 || cy > 845) continue;
        const nbs: number[] = [];
        if (cx > 0) nbs.push(curr - 1);
        if (cx < cw - 1) nbs.push(curr + 1);
        if (cy > 0) nbs.push(curr - cw);
        if (cy < ch - 1) nbs.push(curr + cw);
        for (const nb of nbs) {
          if (!isDressFill[nb] && !isExterior[nb]) {
            const i = nb * 4;
            const r = origData[i];
            const g = origData[i + 1];
            const b = origData[i + 2];
            // White dress is neutral high-luminance (not blue cardigan)
            if (r > 195 && g > 195 && b > 195 && b - r < 10) {
              isDressFill[nb] = 1;
              dq.push(nb);
            }
          }
        }
      }

      // C. Cardigan Fill (Left Slouch vs Right Neat), Hair, Eye Iris, Shoe Bows
      const isCardiganLeftSlouchFill = new Uint8Array(cw * ch);
      const isCardiganRightNeatFill = new Uint8Array(cw * ch);
      const isHairFill = new Uint8Array(cw * ch);
      const isEyeIrisFill = new Uint8Array(cw * ch);
      const isShoeBowFill = new Uint8Array(cw * ch);

      for (let y = 0; y < ch; y++) {
        for (let x = 0; x < cw; x++) {
          const idx = y * cw + x;
          if (isExterior[idx]) continue;
          const i = idx * 4;
          const r = origData[i];
          const g = origData[i + 1];
          const b = origData[i + 2];

          // Cardigan Blue Fill (y = 310..700)
          if (y >= 310 && y <= 700 && b - r >= 11 && b > 130) {
            if (x < 235) {
              isCardiganLeftSlouchFill[idx] = 1;
            } else {
              isCardiganRightNeatFill[idx] = 1;
            }
            continue;
          }

          // Eye Iris Blue (y = 215..320)
          if (y >= 215 && y < 310 && x >= 140 && x <= 345 && b - r >= 10 && b > 120) {
            isEyeIrisFill[idx] = 1;
            continue;
          }

          // Shoe Ribbon Bows (y = 860..950)
          if (y >= 860 && y <= 950 && b - r >= 8 && b > 100) {
            isShoeBowFill[idx] = 1;
            continue;
          }

          // Warm Taupe Hair Fill (r > b, moderate saturation, not skin/blush)
          if (
            y <= 685 &&
            r - b >= 13 &&
            r >= 135 &&
            r <= 228 &&
            g >= 115 &&
            g <= 212 &&
            r - g <= 26
          ) {
            isHairFill[idx] = 1;
          }
        }
      }

      // Dilate Cardigan Left & Right Fill by 4px to capture their exact ink outlines cleanly
      const isCardiganLeftSlouchSprite = new Uint8Array(cw * ch);
      const isCardiganRightNeatSprite = new Uint8Array(cw * ch);
      const rad = 4;
      for (let y = 310; y <= 700; y++) {
        for (let x = 10; x < cw - 10; x++) {
          const idx = y * cw + x;
          const isLeft = isCardiganLeftSlouchFill[idx] === 1;
          const isRight = isCardiganRightNeatFill[idx] === 1;
          if (!isLeft && !isRight) continue;
          for (let dy = -rad; dy <= rad; dy++) {
            for (let dx = -rad; dx <= rad; dx++) {
              if (dx * dx + dy * dy <= rad * rad) {
                const ny = y + dy;
                const nx = x + dx;
                const nidx = ny * cw + nx;
                // Exclude armpit/strap line intersection on upper-right of left collar
                if (
                  isLeft &&
                  nx >= 162 &&
                  nx <= 195 &&
                  ny >= 360 &&
                  ny <= 415 &&
                  !isCardiganLeftSlouchFill[nidx]
                ) {
                  continue;
                }
                // Exclude hair curl tip below left moe-sleeve cuff
                if (
                  isLeft &&
                  nx < 118 &&
                  ny > 602 &&
                  !isCardiganLeftSlouchFill[nidx]
                ) {
                  continue;
                }
                // Exclude hand fingers below right angled cuff
                if (
                  isRight &&
                  nx > 350 &&
                  ny > 572 &&
                  !isCardiganRightNeatFill[nidx]
                ) {
                  continue;
                }
                if (
                  lumAt(nidx) < 215 ||
                  isCardiganLeftSlouchFill[nidx] ||
                  isCardiganRightNeatFill[nidx]
                ) {
                  if (isLeft) isCardiganLeftSlouchSprite[nidx] = 1;
                  if (isRight) isCardiganRightNeatSprite[nidx] = 1;
                }
              }
            }
          }
        }
      }

      globalCachedMasks = {
        cw,
        ch,
        origData,
        isExterior,
        isCardiganLeftSlouchFill,
        isCardiganRightNeatFill,
        isCardiganLeftSlouchSprite,
        isCardiganRightNeatSprite,
        isDressFill,
        isHairFill,
        isEyeIrisFill,
        isShoeBowFill,
        rackW: 420,
        rackH: 420,
        rackOrigData: origData,
        isRackLeftFill: isCardiganLeftSlouchFill,
        isRackLeftSprite: isCardiganLeftSlouchSprite,
        isRackRightFill: isCardiganRightNeatFill,
        isRackRightSprite: isCardiganRightNeatSprite,
      };
      resolve(globalCachedMasks);
    };
    img.onerror = (e) => reject(e);
    img.src = '/assets/aistudio/HVpcv1tb0AAKd05_e039af5f.jpeg';
  });

  return loadingPromise;
}

interface ReferenceAvatarCanvasProps {
  config: AvatarConfig;
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
  className?: string;
}

/**
 * Renders the 100% Pixel-Authentic Chibi Avatar & Costume directly from the
 * uploaded reference artwork with live color & layer customization.
 */
export function ReferenceAvatarCanvas({
  config,
  canvasRef,
  className = 'w-full h-full object-contain',
}: ReferenceAvatarCanvasProps) {
  const internalRef = useRef<HTMLCanvasElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    loadAndSegmentReference().then((masks) => {
      if (!mounted) return;
      setReady(true);
      const canvas = canvasRef?.current || internalRef.current;
      if (!canvas) return;
      const {cw, ch, origData} = masks;
      canvas.width = cw;
      canvas.height = ch;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const palette = resolveCardiganPalette(config);
      const [cr, cg, cb] = hexToRgb(palette.fill);
      const [dr, dg, db] = hexToRgb(config.innerColor);
      const hair = HAIR_TONES.find((h) => h.id === config.hairToneId) || HAIR_TONES[0];
      const [hr, hg, hb] = hexToRgb(hair.base);
      const eye = EYE_TONES.find((e) => e.id === config.eyeToneId) || EYE_TONES[0];
      const [er, eg, eb] = hexToRgb(eye.iris);
      const [sr, sg, sb] = hexToRgb(config.shoeAccentColor);

      const baseImg = ctx.createImageData(cw, ch);
      const bd = baseImg.data;

      const leftCardImg = ctx.createImageData(cw, ch);
      const lcd = leftCardImg.data;
      const rightCardImg = ctx.createImageData(cw, ch);
      const rcd = rightCardImg.data;

      for (let idx = 0; idx < cw * ch; idx++) {
        if (masks.isExterior[idx]) continue;
        const i = idx * 4;
        const r = origData[i];
        const g = origData[i + 1];
        const b = origData[i + 2];

        const inLeftCard = masks.isCardiganLeftSlouchSprite[idx] === 1;
        const inRightCard = masks.isCardiganRightNeatSprite[idx] === 1;

        if (inLeftCard && config.visibleLayers.cardiganRightSlouch) {
          if (masks.isCardiganLeftSlouchFill[idx]) {
            const shade = Math.min(1.03, b / 214);
            lcd[i] = Math.min(255, Math.round(cr * shade));
            lcd[i + 1] = Math.min(255, Math.round(cg * shade));
            lcd[i + 2] = Math.min(255, Math.round(cb * shade));
            lcd[i + 3] = 255;
          } else {
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            const alpha = Math.min(255, Math.max(0, Math.round((245 - lum) * 1.6)));
            lcd[i] = 28;
            lcd[i + 1] = 24;
            lcd[i + 2] = 25;
            lcd[i + 3] = alpha;
          }
        }

        if (inRightCard && config.visibleLayers.cardiganLeftNeat) {
          if (masks.isCardiganRightNeatFill[idx]) {
            const shade = Math.min(1.03, b / 214);
            rcd[i] = Math.min(255, Math.round(cr * shade));
            rcd[i + 1] = Math.min(255, Math.round(cg * shade));
            rcd[i + 2] = Math.min(255, Math.round(cb * shade));
            rcd[i + 3] = 255;
          } else {
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            const alpha = Math.min(255, Math.max(0, Math.round((245 - lum) * 1.6)));
            rcd[i] = 28;
            rcd[i + 1] = 24;
            rcd[i + 2] = 25;
            rcd[i + 3] = alpha;
          }
        }

        if (masks.isCardiganLeftSlouchFill[idx] || masks.isCardiganRightNeatFill[idx]) {
          const cx = idx % cw;
          if (cx >= 168 && cx <= 312) {
            bd[i] = dr;
            bd[i + 1] = dg;
            bd[i + 2] = db;
            bd[i + 3] = config.visibleLayers.innerDress ? 255 : 0;
          } else {
            bd[i] = hr;
            bd[i + 1] = hg;
            bd[i + 2] = hb;
            bd[i + 3] = config.visibleLayers.backHair ? 255 : 0;
          }
          continue;
        }

        if (masks.isDressFill[idx]) {
          if (!config.visibleLayers.innerDress) continue;
          const shade = Math.min(1, r / 252);
          bd[i] = Math.round(dr * shade);
          bd[i + 1] = Math.round(dg * shade);
          bd[i + 2] = Math.round(db * shade);
          bd[i + 3] = 255;
          continue;
        }

        if (masks.isHairFill[idx]) {
          const cy = (idx / cw) | 0;
          if (cy > 280 && !config.visibleLayers.backHair) continue;
          if (cy <= 280 && !config.visibleLayers.frontHair) continue;
          const shade = Math.min(1.06, r / 205);
          bd[i] = Math.min(255, Math.round(hr * shade));
          bd[i + 1] = Math.min(255, Math.round(hg * shade));
          bd[i + 2] = Math.min(255, Math.round(hb * shade));
          bd[i + 3] = 255;
          continue;
        }

        if (masks.isEyeIrisFill[idx]) {
          if (!config.visibleLayers.face) continue;
          const shade = Math.min(1.08, b / 212);
          bd[i] = Math.min(255, Math.round(er * shade));
          bd[i + 1] = Math.min(255, Math.round(eg * shade));
          bd[i + 2] = Math.min(255, Math.round(eb * shade));
          bd[i + 3] = 255;
          continue;
        }

        if (masks.isShoeBowFill[idx]) {
          if (!config.visibleLayers.shoes) continue;
          const shade = Math.min(1.08, b / 195);
          bd[i] = Math.min(255, Math.round(sr * shade));
          bd[i + 1] = Math.min(255, Math.round(sg * shade));
          bd[i + 2] = Math.min(255, Math.round(sb * shade));
          bd[i + 3] = 255;
          continue;
        }

        bd[i] = r;
        bd[i + 1] = g;
        bd[i + 2] = b;
        bd[i + 3] = 255;
      }

      ctx.clearRect(0, 0, cw, ch);
      ctx.putImageData(baseImg, 0, 0);

      const drawLayer = (imgData: ImageData, dx: number, dy: number) => {
        const tmp = document.createElement('canvas');
        tmp.width = cw;
        tmp.height = ch;
        tmp.getContext('2d')!.putImageData(imgData, 0, 0);
        ctx.drawImage(tmp, dx, dy);
      };

      const rightOff =
        config.drapeStyle === 'extra-slouch'
          ? [-5, 10]
          : config.drapeStyle === 'both-neat'
            ? [10, -22]
            : [0, 0];
      const leftOff =
        config.drapeStyle === 'one-shoulder-left'
          ? [6, 16]
          : config.drapeStyle === 'extra-slouch'
            ? [4, 10]
            : [0, 0];

      if (config.visibleLayers.cardiganLeftNeat) {
        drawLayer(rightCardImg, leftOff[0], leftOff[1]);
      }
      if (config.visibleLayers.cardiganRightSlouch) {
        drawLayer(leftCardImg, rightOff[0], rightOff[1]);
      }
    });
    return () => {
      mounted = false;
    };
  }, [config, canvasRef]);

  return (
    <canvas
      ref={canvasRef || internalRef}
      className={className}
      aria-label="Chibi Avatar mengenakan Kostum Cardigan"
      data-ready={ready ? 'true' : 'false'}
    />
  );
}

interface ReferenceCardiganSpriteProps {
  fill: string;
  isolatedPart?: 'both' | 'slouch-half' | 'neat-half';
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
  className?: string;
}

/**
 * Renders the 100% Pixel-Authentic Standalone Cardigan Costume Asset
 * segmented directly from the complete unoccluded cardigan layers and positioned
 * side-by-side just like the reference showcase rack.
 */
export function ReferenceCardiganSprite({
  fill,
  isolatedPart = 'both',
  canvasRef,
  className = 'w-full h-full object-contain',
}: ReferenceCardiganSpriteProps) {
  const internalRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let mounted = true;
    loadAndSegmentReference().then((masks) => {
      if (!mounted) return;
      const canvas = canvasRef?.current || internalRef.current;
      if (!canvas) return;
      const {cw, ch, origData} = masks;
      const outW = 380;
      const outH = 380;
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const [tr, tg, tb] = hexToRgb(fill);
      const leftImg = ctx.createImageData(cw, ch);
      const ld = leftImg.data;
      const rightImg = ctx.createImageData(cw, ch);
      const rd = rightImg.data;

      for (let idx = 0; idx < cw * ch; idx++) {
        const inLeft =
          (isolatedPart === 'both' || isolatedPart === 'slouch-half') &&
          masks.isCardiganLeftSlouchSprite[idx] === 1;
        const inRight =
          (isolatedPart === 'both' || isolatedPart === 'neat-half') &&
          masks.isCardiganRightNeatSprite[idx] === 1;
        if (!inLeft && !inRight) continue;

        const i = idx * 4;
        const r = origData[i];
        const g = origData[i + 1];
        const b = origData[i + 2];

        if (inLeft) {
          if (masks.isCardiganLeftSlouchFill[idx]) {
            const shade = Math.min(1.03, b / 214);
            ld[i] = Math.min(255, Math.round(tr * shade));
            ld[i + 1] = Math.min(255, Math.round(tg * shade));
            ld[i + 2] = Math.min(255, Math.round(tb * shade));
            ld[i + 3] = 255;
          } else {
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            const alpha = Math.min(255, Math.max(0, Math.round((242 - lum) * 1.65)));
            ld[i] = 28;
            ld[i + 1] = 24;
            ld[i + 2] = 25;
            ld[i + 3] = alpha;
          }
        }

        if (inRight) {
          if (masks.isCardiganRightNeatFill[idx]) {
            const shade = Math.min(1.03, b / 214);
            rd[i] = Math.min(255, Math.round(tr * shade));
            rd[i + 1] = Math.min(255, Math.round(tg * shade));
            rd[i + 2] = Math.min(255, Math.round(tb * shade));
            rd[i + 3] = 255;
          } else {
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            const alpha = Math.min(255, Math.max(0, Math.round((242 - lum) * 1.65)));
            rd[i] = 28;
            rd[i + 1] = 24;
            rd[i + 2] = 25;
            rd[i + 3] = alpha;
          }
        }
      }

      ctx.clearRect(0, 0, outW, outH);

      // Draw Left Slouch Half (moved slightly right to close the torso gap, matching rack layout)
      if (isolatedPart === 'both' || isolatedPart === 'slouch-half') {
        const tmpL = document.createElement('canvas');
        tmpL.width = cw;
        tmpL.height = ch;
        tmpL.getContext('2d')!.putImageData(leftImg, 0, 0);
        ctx.drawImage(tmpL, 15, 295, 220, 360, 0, 10, 210, 350);
      }

      // Draw Right Neat Half (moved slightly left to sit neatly beside the left half, matching rack layout)
      if (isolatedPart === 'both' || isolatedPart === 'neat-half') {
        const tmpR = document.createElement('canvas');
        tmpR.width = cw;
        tmpR.height = ch;
        tmpR.getContext('2d')!.putImageData(rightImg, 0, 0);
        ctx.drawImage(tmpR, 235, 295, 215, 360, 175, 10, 205, 350);
      }
    });
    return () => {
      mounted = false;
    };
  }, [fill, isolatedPart, canvasRef]);

  return (
    <canvas
      ref={canvasRef || internalRef}
      className={className}
      aria-label="Aset Kostum Cardigan Lepasan"
    />
  );
}
