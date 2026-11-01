'use client';

import React from 'react';
import {
  AvatarConfig,
  HAIR_TONES,
  EYE_TONES,
  resolveCardiganPalette,
  darkenHex,
} from '@/lib/avatar-costume';

interface ChibiAvatarCanvasProps {
  config: AvatarConfig;
  svgRef?: React.RefObject<SVGSVGElement | null>;
  className?: string;
}

/**
 * Full layered 2D Chibi Avatar & Costume SVG renderer mapped 1:1 to the
 * 400x700 coordinate grid of the uploaded reference character.
 */
export function ChibiAvatarCanvas({
  config,
  svgRef,
  className = 'w-full h-full',
}: ChibiAvatarCanvasProps) {
  const cardigan = resolveCardiganPalette(config);
  const hair = HAIR_TONES.find((h) => h.id === config.hairToneId) || HAIR_TONES[0];
  const eye = EYE_TONES.find((e) => e.id === config.eyeToneId) || EYE_TONES[0];
  const innerShadow = darkenHex(config.innerColor, 0.08);
  const ink = '#231F20';

  const rightCardiganTransform =
    config.drapeStyle === 'one-shoulder-right'
      ? 'translate(0, 0)'
      : config.drapeStyle === 'extra-slouch'
        ? 'translate(-5, 10) rotate(-3 145 360)'
        : config.drapeStyle === 'both-neat'
          ? 'translate(14, -28) rotate(8 155 320)'
          : 'translate(12, -24) rotate(6 155 320)';

  const leftCardiganTransform =
    config.drapeStyle === 'one-shoulder-left'
      ? 'translate(8, 22) rotate(6 240 340)'
      : config.drapeStyle === 'extra-slouch'
        ? 'translate(5, 14) rotate(4 240 340)'
        : 'translate(0, 0)';

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 400 700"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={`Chibi Avatar wearing ${cardigan.name} cardigan`}
    >
      <defs>
        <radialGradient id="cheekBlush" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F4ADA2" stopOpacity="0.62" />
          <stop offset="100%" stopColor="#F4ADA2" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="kneeBlush" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F4BEB6" stopOpacity="0.52" />
          <stop offset="100%" stopColor="#F4BEB6" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ============================================================
          LAYER 10: LONG WAVY BACK HAIR (뒷머리 레이어)
          Mapped 1:1 to reference 400x700 grid (y = 46..486)
         ============================================================ */}
      {config.visibleLayers.backHair && (
        <g id="layer-back-hair">
          {/* Outer Wavy Hair Silhouette */}
          <path
            d="M 204 48
               C 138 48, 86 84, 70 144
               C 64 166, 70 184, 78 196
               C 64 218, 42 248, 39 282
               C 36 306, 56 322, 48 346
               C 36 376, 22 406, 36 436
               C 44 452, 62 456, 74 446
               C 64 468, 72 486, 92 484
               C 108 482, 118 468, 124 456
               C 128 474, 140 486, 156 482
               L 256 482
               C 272 486, 286 474, 290 456
               C 296 472, 310 486, 326 484
               C 342 482, 350 464, 340 446
               C 354 454, 370 446, 378 428
               C 390 398, 372 368, 360 338
               C 352 316, 368 296, 364 270
               C 360 238, 340 212, 330 190
               C 338 178, 342 160, 336 140
               C 320 84, 270 48, 204 48 Z"
            fill={hair.base}
            stroke={ink}
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Inner Back Hair Shadow under Neck & Shoulders */}
          <path
            d="M 106 236 C 98 304, 102 390, 122 476 L 286 476 C 304 390, 308 304, 300 236 Z"
            fill={hair.shadow}
            opacity="0.52"
          />

          {/* Authentic Wavy Hair Lock Lines from Reference Grid */}
          <path
            d="M 60 248 C 68 274, 76 300, 66 332 C 56 364, 52 398, 66 426"
            stroke={ink}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M 90 242 C 94 276, 104 304, 104 336"
            stroke={ink}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M 118 242 C 118 268, 124 294, 132 314"
            stroke={ink}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M 346 248 C 338 274, 330 300, 340 332 C 350 364, 354 398, 340 426"
            stroke={ink}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M 316 242 C 312 276, 302 304, 302 336"
            stroke={ink}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M 290 242 C 290 268, 284 294, 276 314"
            stroke={ink}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        </g>
      )}

      {/* ============================================================
          LAYER 20: CHIBI BASE BODY, LEGS, ARMS & HEAD (소체 레이어)
          Mapped 1:1 to reference 400x700 grid
         ============================================================ */}
      {config.visibleLayers.body && (
        <g id="layer-base-body">
          {/* Left & Right Lower Legs (x = 154..258, y = 590..668) */}
          <path
            d="M 155 590 L 158 656 C 158 666, 200 666, 200 654 L 201 590 Z"
            fill="#FFF8F4"
            stroke={ink}
            strokeWidth="3.6"
            strokeLinejoin="round"
          />
          <path
            d="M 210 590 L 209 654 C 209 666, 251 666, 252 656 L 255 590 Z"
            fill="#FFF8F4"
            stroke={ink}
            strokeWidth="3.6"
            strokeLinejoin="round"
          />
          {/* Soft Peachy Leg Blush */}
          <ellipse cx="179" cy="624" rx="14" ry="18" fill="url(#kneeBlush)" />
          <ellipse cx="231" cy="624" rx="14" ry="18" fill="url(#kneeBlush)" />

          {/* Neck, Chest & Exposed Right Shoulder (y = 244..340) */}
          <path
            d="M 193 244
               L 193 260
               C 182 264, 166 272, 156 286
               C 146 300, 144 318, 152 336
               L 252 336
               C 256 314, 254 288, 244 272
               C 234 262, 222 258, 215 256
               L 215 244 Z"
            fill="#FFF8F4"
            stroke={ink}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Cute Left Hand (Viewer's Right, x = 320..366, y = 408..452) peeking out from angled cuff */}
          <g id="chibi-left-hand">
            <path
              d="M 336 410
                 C 348 408, 358 412, 360 417
                 C 362 421, 355 424, 348 423
                 C 358 426, 364 432, 361 437
                 C 358 441, 350 437, 345 434
                 C 350 440, 351 447, 346 449
                 C 341 451, 336 445, 334 440
                 C 333 446, 328 450, 324 448
                 C 319 445, 320 434, 322 424 Z"
              fill="#FFF8F4"
              stroke={ink}
              strokeWidth="3.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Rounded Chibi Ears (cx=118, cy=212 and cx=290, cy=212) */}
          <circle
            cx="118"
            cy="212"
            r="16"
            fill="#FFF8F4"
            stroke={ink}
            strokeWidth="3.6"
          />
          <ellipse cx="117" cy="212" rx="9" ry="9" fill="url(#cheekBlush)" />
          <circle
            cx="290"
            cy="212"
            r="16"
            fill="#FFF8F4"
            stroke={ink}
            strokeWidth="3.6"
          />
          <ellipse cx="291" cy="212" rx="9" ry="9" fill="url(#cheekBlush)" />

          {/* Wide Mochi-Cheek Chibi Head Contour (y = 116..246) */}
          <path
            d="M 126 154
               C 122 184, 120 210, 132 228
               C 144 242, 172 246, 204 246
               C 236 246, 264 242, 276 228
               C 288 210, 286 184, 282 154
               C 274 124, 244 114, 204 114
               C 164 114, 134 124, 126 154 Z"
            fill="#FFF8F4"
            stroke={ink}
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )}

      {/* ============================================================
          LAYER 25: SHOES & FOOTWEAR (신발 레이어, y = 638..670)
         ============================================================ */}
      {config.visibleLayers.shoes && (
        <g id="layer-shoes">
          {config.shoeStyle === 'ribbon-flats' && (
            <>
              {/* Left Foot Ballet Flat */}
              <path
                d="M 157 640
                   C 156 658, 160 668, 179 668
                   C 198 668, 201 658, 200 640
                   C 194 650, 164 650, 157 640 Z"
                fill="#3B393A"
                stroke={ink}
                strokeWidth="3.6"
                strokeLinejoin="round"
              />
              {/* Left Blue Ribbon Bow */}
              <path
                d="M 179 652 C 170 644, 165 648, 169 656 C 172 660, 176 656, 179 652 Z
                   M 179 652 C 188 644, 193 648, 189 656 C 186 660, 182 656, 179 652 Z"
                fill={config.shoeAccentColor}
                stroke={ink}
                strokeWidth="2.6"
                strokeLinejoin="round"
              />

              {/* Right Foot Ballet Flat */}
              <path
                d="M 210 640
                   C 209 658, 212 668, 231 668
                   C 250 668, 254 658, 253 640
                   C 246 650, 216 650, 210 640 Z"
                fill="#3B393A"
                stroke={ink}
                strokeWidth="3.6"
                strokeLinejoin="round"
              />
              {/* Right Blue Ribbon Bow */}
              <path
                d="M 231 652 C 222 644, 217 648, 221 656 C 224 660, 228 656, 231 652 Z
                   M 231 652 C 240 644, 245 648, 241 656 C 238 660, 234 656, 231 652 Z"
                fill={config.shoeAccentColor}
                stroke={ink}
                strokeWidth="2.6"
                strokeLinejoin="round"
              />
            </>
          )}

          {config.shoeStyle === 'mary-janes' && (
            <>
              <path
                d="M 157 638 C 156 658, 160 668, 179 668 C 198 668, 201 658, 200 638 C 194 648, 164 648, 157 638 Z"
                fill="#2C2627"
                stroke={ink}
                strokeWidth="3.6"
              />
              <line x1="159" y1="642" x2="198" y2="642" stroke={ink} strokeWidth="3.4" />
              <circle cx="165" cy="642" r="2.6" fill={config.shoeAccentColor} />

              <path
                d="M 210 638 C 209 658, 212 668, 231 668 C 250 668, 254 658, 253 638 C 246 648, 216 648, 210 638 Z"
                fill="#2C2627"
                stroke={ink}
                strokeWidth="3.6"
              />
              <line x1="212" y1="642" x2="251" y2="642" stroke={ink} strokeWidth="3.4" />
              <circle cx="245" cy="642" r="2.6" fill={config.shoeAccentColor} />
            </>
          )}

          {config.shoeStyle === 'knit-socks' && (
            <>
              <path
                d="M 157 616 L 157 656 C 157 667, 200 667, 200 656 L 200 616 Z"
                fill="#F5EED6"
                stroke={ink}
                strokeWidth="3.4"
              />
              <path
                d="M 210 616 L 210 656 C 210 667, 253 667, 253 656 L 253 616 Z"
                fill="#F5EED6"
                stroke={ink}
                strokeWidth="3.4"
              />
              <line x1="157" y1="624" x2="200" y2="624" stroke={ink} strokeWidth="2.6" />
              <line x1="210" y1="624" x2="253" y2="624" stroke={ink} strokeWidth="2.6" />
            </>
          )}
        </g>
      )}

      {/* ============================================================
          LAYER 30: INNER DRESS / TOP (이너 원피스 레이어)
          Exact trace from reference 400x700 grid (y = 266..612)
         ============================================================ */}
      {config.visibleLayers.innerDress && (
        <g id="layer-inner-dress">
          {/* Double Spaghetti Strap on Exposed Left Shoulder (x = 175..180, y = 264..286) */}
          <path
            d="M 175 266 L 174 286 M 180 264 L 179 286"
            stroke={ink}
            strokeWidth="3"
            strokeLinecap="round"
          />

          {config.innerOutfit === 'camisole-maxi' && (
            <>
              {/* Upper Bodice of Camisole Dress (y = 286..340) */}
              <path
                d="M 168 286
                   L 224 286
                   L 228 340
                   Q 194 334 157 340
                   Z"
                fill={config.innerColor}
                stroke={ink}
                strokeWidth="3.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Flowing Pleated Maxi Skirt with Stepped Hem matching Reference (y = 338..612) */}
              <path
                d="M 157 340
                   Q 194 334 228 340
                   C 246 410, 268 504, 282 586
                   C 278 590, 272 590, 266 590
                   L 268 606
                   C 246 610, 222 612, 200 610
                   L 196 604
                   C 172 606, 144 604, 128 598
                   C 128 520, 142 418, 157 340 Z"
                fill={config.innerColor}
                stroke={ink}
                strokeWidth="3.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Subtle Pleat Depth Shading */}
              <path
                d="M 182 338 L 177 604 L 197 606 L 193 337 Z"
                fill={innerShadow}
                opacity="0.42"
              />

              {/* Exact Vertical Pleat Crease Lines from Reference */}
              <path
                d="M 181 339 C 179 426, 177 518, 177 604"
                stroke={ink}
                strokeWidth="3.2"
                strokeLinecap="round"
              />
              <path
                d="M 192 338 C 194 426, 196 518, 197 606"
                stroke={ink}
                strokeWidth="3.2"
                strokeLinecap="round"
              />
              <path
                d="M 215 418 C 217 484, 219 548, 221 610"
                stroke={ink}
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M 262 462 C 264 514, 266 562, 268 606"
                stroke={ink}
                strokeWidth="3.2"
                strokeLinecap="round"
              />
            </>
          )}

          {config.innerOutfit === 'pleated-mini' && (
            <>
              <path
                d="M 168 286 L 224 286 L 252 488 C 220 496, 172 496, 140 488 Z"
                fill={config.innerColor}
                stroke={ink}
                strokeWidth="3.6"
                strokeLinejoin="round"
              />
              <path d="M 157 340 Q 194 334 228 340" stroke={ink} strokeWidth="3.4" />
              <line x1="180" y1="338" x2="174" y2="492" stroke={ink} strokeWidth="3" />
              <line x1="196" y1="338" x2="196" y2="494" stroke={ink} strokeWidth="3" />
              <line x1="216" y1="338" x2="222" y2="492" stroke={ink} strokeWidth="3" />
            </>
          )}

          {config.innerOutfit === 'sailor-onepiece' && (
            <>
              <path
                d="M 164 282 L 228 282 L 270 568 C 232 578, 172 578, 134 568 Z"
                fill={config.innerColor}
                stroke={ink}
                strokeWidth="3.6"
                strokeLinejoin="round"
              />
              <path
                d="M 170 276 L 198 332 L 226 276"
                fill="none"
                stroke="#5A6CA8"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 198 332 L 186 324 L 186 340 Z M 198 332 L 210 324 L 210 340 Z"
                fill="#5A6CA8"
                stroke={ink}
                strokeWidth="2.4"
              />
            </>
          )}

          {config.innerOutfit === 'ribbed-knit' && (
            <>
              <path
                d="M 166 286 L 226 286 L 272 588 C 232 598, 172 598, 132 588 Z"
                fill={config.innerColor}
                stroke={ink}
                strokeWidth="3.6"
                strokeLinejoin="round"
              />
              <line x1="178" y1="288" x2="166" y2="590" stroke={innerShadow} strokeWidth="3.2" />
              <line x1="198" y1="288" x2="198" y2="594" stroke={innerShadow} strokeWidth="3.2" />
              <line x1="218" y1="288" x2="232" y2="590" stroke={innerShadow} strokeWidth="3.2" />
            </>
          )}
        </g>
      )}

      {/* ============================================================
          LAYER 40 & 45: THE FEATURED CARDIGAN COSTUME ASSET
          (한쪽이 흘러내린 말랑블리폭딱샤랄라 가디건)
          Mapped 1:1 to the exact 400x700 coordinate grid in ref-coord-grid.png!
         ============================================================ */}

      {/* Viewer's Right Half (Character's Left Shoulder — Neat Draped Side)
          Grid coordinates: Top (216, 252) -> Bottom Torso (235..282, 462) -> Angled Cuff (304..346, 396..434) */}
      {config.visibleLayers.cardiganLeftNeat && (
        <g id="layer-cardigan-left-neat" transform={leftCardiganTransform}>
          <path
            d="M 216 252
               C 238 258, 258 274, 276 298
               C 300 330, 324 362, 338 390
               C 340 394, 336 398, 331 398
               L 346 412
               C 338 422, 328 430, 318 434
               L 304 416
               C 299 420, 294 420, 290 414
               C 284 406, 280 396, 278 386
               C 282 414, 285 438, 285 450
               C 285 453, 282 454, 279 454
               L 279 460
               C 279 463, 275 464, 266 464
               L 240 464
               C 236 464, 234 461, 234 455
               C 232 390, 226 318, 216 252 Z"
            fill={cardigan.fill}
            stroke={ink}
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Subtle Inner Shading along Right Sleeve Seam */}
          <path
            d="M 255 280 C 266 340, 275 404, 278 460 L 285 450 C 282 398, 270 336, 255 280 Z"
            fill={cardigan.shadow}
            opacity="0.38"
          />

          {/* Long Inner Seam Line from Shoulder (255,280) to Bottom Hem (279,460) */}
          <path
            d="M 255 280 C 266 342, 275 406, 279 460"
            stroke={ink}
            strokeWidth="3.4"
            strokeLinecap="round"
          />

          {/* Elbow & Forearm Crease Lines matching Reference Grid */}
          <path
            d="M 278 380 C 288 388, 296 394, 304 398"
            stroke={ink}
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Angled Ribbed Cuff Top Seam & 3 Stitch Lines */}
          <path
            d="M 294 416 C 304 404, 316 396, 331 398"
            stroke={ink}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <line
            x1="308"
            y1="421"
            x2="316"
            y2="410"
            stroke={ink}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <line
            x1="318"
            y1="412"
            x2="328"
            y2="424"
            stroke={ink}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <line
            x1="326"
            y1="404"
            x2="337"
            y2="416"
            stroke={ink}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        </g>
      )}

      {/* Viewer's Left Half (Character's Right Arm — Slouchy Off-Shoulder Side)
          Grid coordinates: Collar (132..164, 294..364), Puffy Sleeve (37..126, 316..462), Torso Panel (125..171, 336..480) */}
      {config.visibleLayers.cardiganRightSlouch && (
        <g id="layer-cardigan-right-slouch" transform={rightCardiganTransform}>
          {/* Main Silhouette: Slouch Collar + Plump Moe-Sleeve Pouch + Left Torso Placket */}
          <path
            d="M 147 294
               C 137 300, 131 310, 132 320
               C 123 322, 114 330, 108 338
               C 86 360, 62 384, 44 404
               C 34 418, 36 442, 48 454
               C 56 462, 74 464, 86 458
               C 92 452, 92 436, 88 422
               C 86 414, 84 408, 86 404
               L 126 388
               C 124 418, 126 450, 130 476
               C 131 480, 136 481, 148 481
               L 166 481
               C 170 481, 171 478, 171 472
               C 172 426, 172 382, 164 348
               C 160 332, 152 320, 150 308
               C 148 300, 148 296, 147 294 Z"
            fill={cardigan.fill}
            stroke={ink}
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Subtle Shading on Collar Fold & Under-Sleeve */}
          <path
            d="M 147 294 C 137 300, 131 312, 133 324 C 138 338, 150 352, 164 364 C 161 344, 153 324, 150 308 Z"
            fill={cardigan.shadow}
            opacity="0.38"
          />
          <path
            d="M 126 388 L 86 404 C 84 416, 90 434, 88 450 C 98 438, 114 412, 126 396 Z"
            fill={cardigan.shadow}
            opacity="0.42"
          />

          {/* Collar Band Outer Curve (from (132,320) curving into torso placket at (164,364)) */}
          <path
            d="M 132 320 C 136 336, 148 352, 164 364"
            stroke={ink}
            strokeWidth="3.6"
            strokeLinecap="round"
          />

          {/* Upper Arm Diagonal Fold Line (from (114,330) down to (128,396)) */}
          <path
            d="M 114 330 C 122 352, 126 374, 128 396"
            stroke={ink}
            strokeWidth="3.4"
            strokeLinecap="round"
          />

          {/* Curved Armpit Drape Crease (from (148,348) to (126,396)) */}
          <path
            d="M 148 348 C 142 366, 134 382, 126 396"
            stroke={ink}
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Lower Torso Panel Inner Crease (from (126,398) to (145,464)) */}
          <path
            d="M 126 398 C 132 422, 138 444, 145 464"
            stroke={ink}
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Moe-Sleeve Wrist Dimple Arch (M 48 402 Q 66 398 78 410) */}
          <path
            d="M 48 402 C 58 396, 70 400, 78 410"
            stroke={ink}
            strokeWidth="3.4"
            strokeLinecap="round"
          />

          {/* Lower Sleeve Pouch Fold Line (M 51 440 Q 58 450 68 452) */}
          <path
            d="M 51 440 C 56 448, 62 452, 68 453"
            stroke={ink}
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Gathered Ribbed Cuff Stitch Lines at Bottom of Moe-Sleeve */}
          <line
            x1="59"
            y1="461"
            x2="61"
            y2="452"
            stroke={ink}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <line
            x1="70"
            y1="462"
            x2="71"
            y2="452"
            stroke={ink}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <line
            x1="80"
            y1="459"
            x2="79"
            y2="449"
            stroke={ink}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        </g>
      )}

      {/* Optional Crossbody Satchel Accessory */}
      {config.accessory === 'satchel-bag' && (
        <g id="layer-accessory-satchel">
          <path
            d="M 172 288 L 252 436"
            stroke="#6E5244"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <rect
            x="236"
            y="426"
            width="36"
            height="28"
            rx="8"
            fill="#8C6856"
            stroke={ink}
            strokeWidth="3.2"
          />
          <path
            d="M 236 436 Q 254 446 272 436"
            stroke={ink}
            strokeWidth="2.6"
            fill="none"
          />
          <circle cx="254" cy="441" r="3" fill="#F5EED6" stroke={ink} strokeWidth="2" />
        </g>
      )}

      {/* ============================================================
          LAYER 50: FACIAL FEATURES, EYES & BLUSH (얼굴 표정 레이어)
          Mapped 1:1 to reference 400x700 grid (y = 186..236)
         ============================================================ */}
      {config.visibleLayers.face && (
        <g id="layer-face">
          {/* Rosy Cheek Blush */}
          <ellipse cx="152" cy="222" rx="22" ry="12" fill="url(#cheekBlush)" />
          <ellipse cx="256" cy="222" rx="22" ry="12" fill="url(#cheekBlush)" />

          {config.expression === 'shy-blush' && (
            <>
              <line x1="146" y1="222" x2="150" y2="218" stroke="#E58F88" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="154" y1="223" x2="158" y2="219" stroke="#E58F88" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="250" y1="222" x2="254" y2="218" stroke="#E58F88" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="258" y1="223" x2="262" y2="219" stroke="#E58F88" strokeWidth="2.2" strokeLinecap="round" />
            </>
          )}

          {/* Soft Eyebrows (y = 166..172) */}
          <path
            d="M 146 168 Q 162 162 178 168"
            stroke={ink}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M 230 168 Q 246 162 262 168"
            stroke={ink}
            strokeWidth="3"
            strokeLinecap="round"
          />

          {config.expression === 'sleepy-blink' ? (
            <>
              <path
                d="M 138 204 Q 161 216 184 204"
                stroke={ink}
                strokeWidth="4.4"
                strokeLinecap="round"
              />
              <path
                d="M 224 204 Q 247 216 270 204"
                stroke={ink}
                strokeWidth="4.4"
                strokeLinecap="round"
              />
            </>
          ) : (
            <>
              {/* LEFT EYE (cx = 161, cy = 204) */}
              <g id="eye-left">
                <path
                  d="M 136 196 C 136 184, 184 184, 184 198 C 184 214, 175 222, 161 222 C 147 222, 136 212, 136 196 Z"
                  fill="#FFFFFF"
                />
                <ellipse
                  cx="162"
                  cy="204"
                  rx="15"
                  ry="17.5"
                  fill={eye.iris}
                  stroke={ink}
                  strokeWidth="3"
                />
                <path
                  d="M 148 198 C 149 187, 175 187, 176 198 Z"
                  fill={eye.pupil}
                  opacity="0.65"
                />
                <ellipse cx="162" cy="205" rx="7.5" ry="9" fill="#FFFFFF" opacity="0.94" />
                <circle cx="152" cy="197" r="3" fill="#FFFFFF" />
                {config.expression === 'sparkle-happy' && (
                  <circle cx="170" cy="211" r="2.4" fill="#FFFFFF" />
                )}
                <path
                  d="M 132 200 C 136 183, 158 181, 184 191"
                  stroke={ink}
                  strokeWidth="5.2"
                  strokeLinecap="round"
                />
                <path
                  d="M 140 180 Q 160 175 178 182"
                  stroke={ink}
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                <path
                  d="M 148 221 Q 162 224 174 220"
                  stroke={ink}
                  strokeWidth="2.6"
                  strokeLinecap="round"
                />
              </g>

              {/* RIGHT EYE (cx = 247, cy = 204) */}
              <g id="eye-right">
                <path
                  d="M 224 198 C 224 184, 272 184, 272 196 C 272 212, 261 222, 247 222 C 233 222, 224 214, 224 198 Z"
                  fill="#FFFFFF"
                />
                <ellipse
                  cx="246"
                  cy="204"
                  rx="15"
                  ry="17.5"
                  fill={eye.iris}
                  stroke={ink}
                  strokeWidth="3"
                />
                <path
                  d="M 232 198 C 233 187, 259 187, 260 198 Z"
                  fill={eye.pupil}
                  opacity="0.65"
                />
                <ellipse cx="246" cy="205" rx="7.5" ry="9" fill="#FFFFFF" opacity="0.94" />
                <circle cx="236" cy="197" r="3" fill="#FFFFFF" />
                {config.expression === 'sparkle-happy' && (
                  <circle cx="254" cy="211" r="2.4" fill="#FFFFFF" />
                )}
                <path
                  d="M 224 191 C 250 181, 272 183, 276 200"
                  stroke={ink}
                  strokeWidth="5.2"
                  strokeLinecap="round"
                />
                <path
                  d="M 230 182 Q 248 175 268 180"
                  stroke={ink}
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                <path
                  d="M 234 220 Q 246 224 260 221"
                  stroke={ink}
                  strokeWidth="2.6"
                  strokeLinecap="round"
                />
              </g>
            </>
          )}

          {/* Signature Beauty Mark under Left Eye (147, 224) */}
          {config.showBeautyMark && (
            <circle cx="147" cy="224" r="2.1" fill={ink} />
          )}

          {/* Tiny Chibi Nose Dot (204, 218) */}
          <circle cx="204" cy="218" r="1.9" fill={ink} />

          {/* Mouth Expression (y = 228..233) */}
          {config.expression === 'sparkle-happy' ? (
            <path
              d="M 197 227 Q 204 237 211 227 Z"
              fill="#E58F88"
              stroke={ink}
              strokeWidth="2.6"
              strokeLinejoin="round"
            />
          ) : config.expression === 'shy-blush' ? (
            <path
              d="M 199 230 Q 202 227 204 230 Q 206 233 209 230"
              stroke={ink}
              strokeWidth="2.6"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M 198 228 Q 204 233 210 228"
              stroke={ink}
              strokeWidth="2.8"
              strokeLinecap="round"
            />
          )}
        </g>
      )}

      {/* ============================================================
          LAYER 60: FRONT BANGS, TWIN CROWN BRAIDS & AHOGE (앞머리 레이어)
          Mapped 1:1 to reference 400x700 grid (y = 26..226)
         ============================================================ */}
      {config.visibleLayers.frontHair && (
        <g id="layer-front-hair">
          {/* Upper Crown Cap so zero skin leaks through bang valleys */}
          <path
            d="M 204 48
               C 138 48, 108 88, 104 156
               L 304 156
               C 300 88, 270 48, 204 48 Z"
            fill={hair.base}
          />

          {/* Center-Parted Long Bangs Framing Face & Crossing Nose Bridge */}
          <path
            d="M 204 48
               C 142 48, 108 88, 106 146
               C 104 182, 112 208, 124 228
               C 126 196, 130 164, 140 138
               C 144 174, 160 202, 184 218
               C 176 188, 174 156, 180 124
               C 186 168, 202 200, 224 216
               C 216 186, 214 156, 218 124
               C 226 164, 232 194, 226 218
               C 248 202, 262 174, 268 138
               C 278 164, 282 196, 284 228
               C 296 208, 304 182, 302 146
               C 300 88, 266 48, 204 48 Z"
            fill={hair.base}
            stroke={ink}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Center Part Double Arch Detail (y = 74..92) */}
          <path
            d="M 166 84 Q 186 72 204 86 Q 222 72 242 84"
            stroke={ink}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M 172 94 Q 188 86 202 94 M 206 94 Q 220 86 236 94"
            stroke={ink}
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Twin Bohemian Crown Braids matching Reference Grid (y = 62..154) */}
          {config.showBraids && (
            <g id="crown-braids">
              {/* Left Side Braid Plait */}
              <path
                d="M 158 64 C 126 76, 106 108, 100 152 C 112 156, 120 150, 124 136 C 132 106, 146 84, 166 72 Z"
                fill={hair.highlight}
                stroke={ink}
                strokeWidth="3.2"
                strokeLinejoin="round"
              />
              <path
                d="M 152 72 C 142 78, 138 88, 146 92 M 138 88 C 128 94, 124 104, 134 108 M 126 106 C 116 112, 112 122, 124 126 M 116 124 C 108 130, 106 142, 118 144"
                stroke={ink}
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Right Side Braid Plait */}
              <path
                d="M 250 64 C 282 76, 302 108, 308 152 C 296 156, 288 150, 284 136 C 276 106, 262 84, 242 72 Z"
                fill={hair.highlight}
                stroke={ink}
                strokeWidth="3.2"
                strokeLinejoin="round"
              />
              <path
                d="M 256 72 C 266 78, 270 88, 262 92 M 270 88 C 280 94, 284 104, 274 108 M 282 106 C 292 112, 296 122, 284 126 M 292 124 C 300 130, 302 142, 290 144"
                stroke={ink}
                strokeWidth="3"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* Signature Sprout Ahoge on Top of Head (x = 180..226, y = 26..50) */}
          {config.showAhoge && (
            <path
              d="M 202 50
                 C 190 42, 178 32, 182 24
                 C 190 22, 200 32, 204 44
                 C 210 30, 220 22, 226 26
                 C 230 34, 218 44, 206 50 Z"
              fill={hair.base}
              stroke={ink}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {config.accessory === 'pearl-clip' && (
            <g id="accessory-pearl-clip">
              <circle cx="128" cy="154" r="5.5" fill="#FFFDF9" stroke={ink} strokeWidth="2.4" />
              <circle cx="139" cy="150" r="4.5" fill="#FFFDF9" stroke={ink} strokeWidth="2.4" />
              <circle cx="148" cy="147" r="3.5" fill="#FFFDF9" stroke={ink} strokeWidth="2.4" />
            </g>
          )}

          {config.accessory === 'beret' && (
            <g id="accessory-beret">
              <path
                d="M 112 92 C 106 54, 160 34, 216 40 C 270 46, 298 74, 284 100 C 248 84, 160 80, 112 92 Z"
                fill={cardigan.fill}
                stroke={ink}
                strokeWidth="3.6"
                strokeLinejoin="round"
              />
              <path
                d="M 204 38 L 208 26"
                stroke={ink}
                strokeWidth="4"
                strokeLinecap="round"
              />
            </g>
          )}
        </g>
      )}
    </svg>
  );
}
