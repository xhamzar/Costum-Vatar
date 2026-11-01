'use client';

import React from 'react';
import {CARDIGAN_COLORWAYS, CardiganColorway, DrapeStyle} from '@/lib/avatar-costume';

interface SingleCardiganSpriteProps {
  fill: string;
  shadow: string;
  highlight?: string;
  drapeStyle?: DrapeStyle;
  isolatedPart?: 'both' | 'slouch-half' | 'neat-half';
  className?: string;
  svgRef?: React.RefObject<SVGSVGElement | null>;
}

/**
 * Renders the standalone wearable Cardigan Costume Asset (2-piece split layer)
 * traced directly from the exact coordinate grid of the reference illustration.
 */
export function SingleCardiganSprite({
  fill,
  shadow,
  DrapeStyleOverride,
  isolatedPart = 'both',
  className = 'w-full h-full',
  svgRef,
}: SingleCardiganSpriteProps & {DrapeStyleOverride?: DrapeStyle}) {
  const ink = '#231F20';
  const sw = 3.8;

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 320 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Standalone Cardigan Costume Asset"
    >
      {/* =================================================================
          LEFT PIECE: Slouchy Off-Shoulder Half (한쪽이 흘러내린 오른쪽 파츠)
          Exact trace from reference rack (top-left & bottom-left sprites)
         ================================================================= */}
      {(isolatedPart === 'both' || isolatedPart === 'slouch-half') && (
        <g
          transform={
            DrapeStyleOverride === 'both-neat'
              ? 'translate(6, -12) rotate(4 110 150)'
              : DrapeStyleOverride === 'extra-slouch'
                ? 'translate(-4, 8) rotate(-3 110 150)'
                : 'translate(0, 0)'
          }
        >
          {/* Main Silhouette: Collar + Puffy Moe-Sleeve + Torso Placket */}
          <path
            d="M 132 38
               C 122 44, 114 54, 114 66
               C 106 68, 98 76, 94 88
               C 78 114, 60 146, 40 176
               C 26 192, 24 222, 34 242
               C 40 254, 48 258, 56 260
               C 66 262, 76 258, 82 252
               C 86 246, 86 234, 82 222
               C 80 212, 78 202, 78 194
               L 103 162
               C 102 198, 104 234, 108 266
               C 109 271, 114 273, 124 273
               L 142 273
               C 147 273, 149 270, 149 264
               C 151 214, 152 162, 147 118
               C 144 98, 136 82, 131 66
               C 130 54, 131 44, 132 38 Z"
            fill={fill}
            stroke={ink}
            strokeWidth={sw}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Subtle Inner Shading on Sleeve Under-Fold & Inner Collar */}
          <path
            d="M 132 38 C 122 44, 115 56, 116 70 C 120 86, 132 104, 146 118 C 143 96, 135 80, 131 66 C 130 54, 131 44, 132 38 Z"
            fill={shadow}
            opacity="0.4"
          />
          <path
            d="M 103 162 L 78 194 C 78 206, 82 222, 84 238 C 89 230, 96 206, 103 182 Z"
            fill={shadow}
            opacity="0.45"
          />

          {/* Collar Band Outer Curve (from (114,66) curving down into torso at (146,122)) */}
          <path
            d="M 114 66 C 116 84, 128 104, 146 122"
            stroke={ink}
            strokeWidth={sw}
            strokeLinecap="round"
          />

          {/* Upper Arm Diagonal Seam Line (from (96,86) down to (106,158)) */}
          <path
            d="M 96 86 C 102 108, 105 134, 106 160"
            stroke={ink}
            strokeWidth="3.4"
            strokeLinecap="round"
          />

          {/* Armpit Short Diagonal Crease */}
          <path
            d="M 113 108 C 110 126, 107 144, 103 162"
            stroke={ink}
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Torso Panel Lower Vertical Crease (from (105,188) to (118,248)) */}
          <path
            d="M 106 188 C 110 210, 114 230, 118 248"
            stroke={ink}
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Signature Moe-Sleeve Wrist Dimple Arch & Lower Pouch Crease */}
          <path
            d="M 38 184 C 48 180, 60 184, 68 194"
            stroke={ink}
            strokeWidth="3.4"
            strokeLinecap="round"
          />
          <path
            d="M 43 228 C 48 238, 54 244, 62 246"
            stroke={ink}
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Gathered Ribbed Cuff Stitch Lines at Bottom of Left Sleeve */}
          <line
            x1="54"
            y1="259"
            x2="56"
            y2="249"
            stroke={ink}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <line
            x1="64"
            y1="260"
            x2="65"
            y2="249"
            stroke={ink}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <line
            x1="74"
            y1="257"
            x2="73"
            y2="246"
            stroke={ink}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        </g>
      )}

      {/* =================================================================
          RIGHT PIECE: Neat Shoulder-Draped Half (단정하게 걸친 왼쪽 파츠)
          Exact trace from reference rack (white & pink right-side sprites)
         ================================================================= */}
      {(isolatedPart === 'both' || isolatedPart === 'neat-half') && (
        <g
          transform={
            DrapeStyleOverride === 'one-shoulder-left'
              ? 'translate(4, 16) rotate(4 210 150)'
              : 'translate(0, 0)'
          }
        >
          {/* Main Silhouette: Sharp Top Shoulder + Straight Inner Edge + Angled Cuff */}
          <path
            d="M 164 14
               C 180 26, 198 48, 214 74
               C 236 110, 258 148, 272 182
               C 275 188, 274 194, 270 197
               L 280 212
               C 272 224, 260 234, 250 242
               L 239 226
               C 234 228, 230 226, 226 220
               C 218 208, 212 196, 208 186
               C 210 212, 212 234, 212 248
               C 212 252, 208 254, 203 254
               L 202 260
               C 202 263, 198 265, 190 265
               L 174 265
               C 170 265, 168 262, 168 256
               C 167 176, 165 94, 164 14 Z"
            fill={fill}
            stroke={ink}
            strokeWidth={sw}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Subtle Inner Shading along Sleeve-Torso Crease */}
          <path
            d="M 196 64 C 200 120, 204 188, 204 254 L 212 252 C 211 190, 205 122, 196 64 Z"
            fill={shadow}
            opacity="0.4"
          />

          {/* Long Vertical Inner Seam Line separating Front Rib Placket & Body */}
          <path
            d="M 196 58 C 199 122, 202 192, 203 256"
            stroke={ink}
            strokeWidth="3.4"
            strokeLinecap="round"
          />

          {/* Diagonal Upper Sleeve Crease */}
          <path
            d="M 200 76 C 206 96, 212 116, 216 134"
            stroke={ink}
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Forearm Gather Crease above Cuff */}
          <path
            d="M 206 174 C 214 182, 222 188, 230 192"
            stroke={ink}
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Trapezoidal Ribbed Cuff Top Line & Stitch Marks */}
          <path
            d="M 229 222 C 238 208, 252 198, 270 197"
            stroke={ink}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <line
            x1="240"
            y1="226"
            x2="249"
            y2="213"
            stroke={ink}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <line
            x1="252"
            y1="217"
            x2="262"
            y2="230"
            stroke={ink}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <line
            x1="262"
            y1="208"
            x2="271"
            y2="221"
            stroke={ink}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        </g>
      )}
    </svg>
  );
}

interface CardiganRackShowcaseProps {
  selectedColorId: string;
  onSelectColor: (colorway: CardiganColorway) => void;
}

/**
 * Reproduces the exact 2-row overlapped cardigan showcase from the reference image,
 * with interleaved left/right halves matching the original sheet layout.
 */
import {ReferenceCardiganSprite} from './ReferenceSpriteCanvas';

export function CardiganRackShowcase({
  selectedColorId,
  onSelectColor,
}: CardiganRackShowcaseProps) {
  const topRow = CARDIGAN_COLORWAYS.filter((c) => c.row === 'top');
  const bottomRow = CARDIGAN_COLORWAYS.filter((c) => c.row === 'bottom');

  const renderInterleavedRow = (items: CardiganColorway[]) => (
    <div className="relative flex items-center justify-center h-48 sm:h-52 w-full max-w-[460px]">
      {items.map((item, idx) => {
        const isSelected = selectedColorId === item.id;
        const xOffsets = ['-translate-x-24', 'translate-x-0', 'translate-x-24'];
        const slouchZ = ['z-10', 'z-15', 'z-25'][idx];
        const neatZ = ['z-20', 'z-30', 'z-35'][idx];
        return (
          <React.Fragment key={item.id}>
            <div
              className={`pointer-events-none absolute w-52 sm:w-56 h-48 sm:h-52 transition-transform duration-150 ${xOffsets[idx]} ${slouchZ} ${
                isSelected ? 'scale-105 -translate-y-2' : ''
              }`}
            >
              <ReferenceCardiganSprite
                fill={item.fill}
                isolatedPart="slouch-half"
              />
            </div>

            <div
              className={`pointer-events-none absolute w-52 sm:w-56 h-48 sm:h-52 transition-transform duration-150 ${xOffsets[idx]} ${neatZ} ${
                isSelected ? 'scale-105 -translate-y-2' : ''
              }`}
            >
              <ReferenceCardiganSprite
                fill={item.fill}
                isolatedPart="neat-half"
              />
            </div>

            <button
              type="button"
              onClick={() => onSelectColor(item)}
              aria-label={`Pilih warna kostum ${item.name}`}
              className={`group absolute w-36 h-48 transition-transform duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5A6CA8] rounded-xl cursor-pointer z-40 ${xOffsets[idx]}`}
            >
              <span
                className={`absolute bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[11px] font-medium rounded bg-[#252120]/90 text-white whitespace-nowrap transition-opacity ${
                  isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
              >
                {item.name}
              </span>
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center gap-3 select-none">
      <div className="text-center mb-1">
        <p className="text-base sm:text-lg font-bold tracking-tight text-[#252120]">
          한쪽이 흘러내린
        </p>
        <p className="text-lg sm:text-xl font-bold tracking-tight text-[#252120]">
          말랑블리폭딱샤랄라 가디건
        </p>
        <p className="text-xs text-[#6E655F] mt-0.5">
          Klik salah satu warna di rak untuk langsung memasang ke avatar
        </p>
      </div>

      {renderInterleavedRow(topRow)}
      {renderInterleavedRow(bottomRow)}
    </div>
  );
}
