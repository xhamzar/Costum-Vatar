export type DrapeStyle = 'one-shoulder-right' | 'one-shoulder-left' | 'both-neat' | 'extra-slouch';
export type InnerOutfitId = 'camisole-maxi' | 'pleated-mini' | 'sailor-onepiece' | 'ribbed-knit';
export type ExpressionId = 'gentle-smile' | 'shy-blush' | 'sleepy-blink' | 'sparkle-happy';
export type ShoeStyleId = 'ribbon-flats' | 'mary-janes' | 'knit-socks';
export type AccessoryId = 'none' | 'pearl-clip' | 'satchel-bag' | 'beret';

export interface CardiganColorway {
  id: string;
  name: string;
  koreanSub: string;
  fill: string;
  shadow: string;
  highlight: string;
  cuffLine: string;
  row: 'worn' | 'top' | 'bottom';
}

export interface HairTone {
  id: string;
  name: string;
  base: string;
  shadow: string;
  highlight: string;
}

export interface EyeTone {
  id: string;
  name: string;
  iris: string;
  pupil: string;
  highlight: string;
}

export interface AvatarConfig {
  cardiganColorId: string;
  customCardiganHex: string | null;
  drapeStyle: DrapeStyle;
  innerOutfit: InnerOutfitId;
  innerColor: string;
  hairToneId: string;
  eyeToneId: string;
  expression: ExpressionId;
  shoeStyle: ShoeStyleId;
  shoeAccentColor: string;
  accessory: AccessoryId;
  showBraids: boolean;
  showAhoge: boolean;
  showBeautyMark: boolean;
  visibleLayers: {
    backHair: boolean;
    body: boolean;
    innerDress: boolean;
    shoes: boolean;
    cardiganRightSlouch: boolean;
    cardiganLeftNeat: boolean;
    frontHair: boolean;
    face: boolean;
  };
}

export const CARDIGAN_COLORWAYS: CardiganColorway[] = [
  {
    id: 'periwinkle-blue',
    name: 'Periwinkle Sky',
    koreanSub: '소라색 (Model Worn)',
    fill: '#A3B7D8',
    shadow: '#899EC2',
    highlight: '#BACCE8',
    cuffLine: '#332E2E',
    row: 'worn',
  },
  {
    id: 'oatmeal-taupe',
    name: 'Oatmeal Taupe',
    koreanSub: '오트밀 모카 (Row 1 · #1)',
    fill: '#BAAB9B',
    shadow: '#9E8F7F',
    highlight: '#CFC2B4',
    cuffLine: '#332E2E',
    row: 'top',
  },
  {
    id: 'charcoal-ink',
    name: 'Charcoal Ink',
    koreanSub: '차콜 블랙 (Row 1 · #2)',
    fill: '#232325',
    shadow: '#161618',
    highlight: '#3A3A3E',
    cuffLine: '#111112',
    row: 'top',
  },
  {
    id: 'butter-cream',
    name: 'Butter Vanilla',
    koreanSub: '버터 크림 (Row 1 · #3)',
    fill: '#F5EED6',
    shadow: '#E2D9BE',
    highlight: '#FFFDF4',
    cuffLine: '#332E2E',
    row: 'top',
  },
  {
    id: 'warm-ivory',
    name: 'Warm Ivory',
    koreanSub: '아이보리 (Row 2 · #1)',
    fill: '#EFE8DC',
    shadow: '#DCD3C4',
    highlight: '#FAF6F0',
    cuffLine: '#332E2E',
    row: 'bottom',
  },
  {
    id: 'pastel-pink',
    name: 'Blossom Pink',
    koreanSub: '베이비 핑크 (Row 2 · #2)',
    fill: '#FADCE2',
    shadow: '#E8C3CB',
    highlight: '#FFEBF0',
    cuffLine: '#332E2E',
    row: 'bottom',
  },
  {
    id: 'snow-white',
    name: 'Pure Snow',
    koreanSub: '화이트 (Row 2 · #3)',
    fill: '#FFFFFF',
    shadow: '#E8E9EC',
    highlight: '#FFFFFF',
    cuffLine: '#332E2E',
    row: 'bottom',
  },
];

export const HAIR_TONES: HairTone[] = [
  {
    id: 'ash-milk-tea',
    name: 'Ash Milk Tea (Original)',
    base: '#CDBBA7',
    shadow: '#B39F89',
    highlight: '#DFD1C1',
  },
  {
    id: 'espresso-brown',
    name: 'Espresso Truffle',
    base: '#54433A',
    shadow: '#3D2F28',
    highlight: '#6E5A4F',
  },
  {
    id: 'strawberry-oat',
    name: 'Strawberry Oat',
    base: '#E2B8B8',
    shadow: '#C89B9B',
    highlight: '#F2D5D5',
  },
  {
    id: 'midnight-noir',
    name: 'Midnight Noir',
    base: '#2C2D34',
    shadow: '#1B1C22',
    highlight: '#454752',
  },
  {
    id: 'butter-blonde',
    name: 'Honey Chiffon',
    base: '#E8D5AC',
    shadow: '#CFB98C',
    highlight: '#F7EBD2',
  },
];

export const EYE_TONES: EyeTone[] = [
  {
    id: 'periwinkle-iris',
    name: 'Periwinkle Blue (Original)',
    iris: '#8B9FD9',
    pupil: '#5A6CA8',
    highlight: '#FFFFFF',
  },
  {
    id: 'hazel-amber',
    name: 'Honey Amber',
    iris: '#C89D66',
    pupil: '#8C6239',
    highlight: '#FFFFFF',
  },
  {
    id: 'rose-quartz',
    name: 'Rose Berry',
    iris: '#D48C9E',
    pupil: '#995467',
    highlight: '#FFFFFF',
  },
  {
    id: 'sage-emerald',
    name: 'Mint Sage',
    iris: '#7FB8A4',
    pupil: '#4D8572',
    highlight: '#FFFFFF',
  },
];

export const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
  cardiganColorId: 'periwinkle-blue',
  customCardiganHex: null,
  drapeStyle: 'one-shoulder-right',
  innerOutfit: 'camisole-maxi',
  innerColor: '#FFFFFF',
  hairToneId: 'ash-milk-tea',
  eyeToneId: 'periwinkle-iris',
  expression: 'gentle-smile',
  shoeStyle: 'ribbon-flats',
  shoeAccentColor: '#8B9FD9',
  accessory: 'none',
  showBraids: true,
  showAhoge: true,
  showBeautyMark: true,
  visibleLayers: {
    backHair: true,
    body: true,
    innerDress: true,
    shoes: true,
    cardiganRightSlouch: true,
    cardiganLeftNeat: true,
    frontHair: true,
    face: true,
  },
};

export function resolveCardiganPalette(config: AvatarConfig): {
  fill: string;
  shadow: string;
  highlight: string;
  name: string;
  koreanSub: string;
} {
  if (config.customCardiganHex && /^#[0-9A-Fa-f]{6}$/.test(config.customCardiganHex)) {
    const hex = config.customCardiganHex;
    return {
      fill: hex,
      shadow: darkenHex(hex, 0.14),
      highlight: lightenHex(hex, 0.12),
      name: `Custom (${hex.toUpperCase()})`,
      koreanSub: '커스텀 컬러',
    };
  }
  const found =
    CARDIGAN_COLORWAYS.find((c) => c.id === config.cardiganColorId) || CARDIGAN_COLORWAYS[0];
  return {
    fill: found.fill,
    shadow: found.shadow,
    highlight: found.highlight,
    name: found.name,
    koreanSub: found.koreanSub,
  };
}

export function darkenHex(hex: string, amount: number): string {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  const r = Math.max(0, Math.min(255, Math.round(((num >> 16) & 0xff) * (1 - amount))));
  const g = Math.max(0, Math.min(255, Math.round(((num >> 8) & 0xff) * (1 - amount))));
  const b = Math.max(0, Math.min(255, Math.round((num & 0xff) * (1 - amount))));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

export function lightenHex(hex: string, amount: number): string {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  const r = Math.max(
    0,
    Math.min(255, Math.round(((num >> 16) & 0xff) + (255 - ((num >> 16) & 0xff)) * amount))
  );
  const g = Math.max(
    0,
    Math.min(255, Math.round(((num >> 8) & 0xff) + (255 - ((num >> 8) & 0xff)) * amount))
  );
  const b = Math.max(
    0,
    Math.min(255, Math.round((num & 0xff) + (255 - (num & 0xff)) * amount))
  );
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

export function countActiveLayers(config: AvatarConfig): number {
  return Object.values(config.visibleLayers).filter(Boolean).length;
}

export interface CostumeLayerManifest {
  assetName: string;
  koreanTitle: string;
  version: string;
  drapeStyle: DrapeStyle;
  cardiganColor: {
    name: string;
    fill: string;
    shadow: string;
  };
  innerOutfit: InnerOutfitId;
  activeLayerCount: number;
  layers: Array<{
    id: string;
    label: string;
    zIndex: number;
    visible: boolean;
    anchorOffset: {x: number; y: number};
  }>;
}

export function buildCostumeManifest(config: AvatarConfig): CostumeLayerManifest {
  const palette = resolveCardiganPalette(config);
  const rightSlouchOffset =
    config.drapeStyle === 'one-shoulder-right'
      ? {x: -14, y: 22}
      : config.drapeStyle === 'extra-slouch'
        ? {x: -18, y: 28}
        : {x: -4, y: 6};
  const leftNeatOffset =
    config.drapeStyle === 'one-shoulder-left'
      ? {x: 14, y: 22}
      : config.drapeStyle === 'extra-slouch'
        ? {x: 16, y: 24}
        : {x: 0, y: 0};

  return {
    assetName: 'malang-slouch-cardigan-v1',
    koreanTitle: '한쪽이 흘러내린 말랑블리폭딱샤랄라 가디건',
    version: '1.0.0',
    drapeStyle: config.drapeStyle,
    cardiganColor: {
      name: palette.name,
      fill: palette.fill,
      shadow: palette.shadow,
    },
    innerOutfit: config.innerOutfit,
    activeLayerCount: countActiveLayers(config),
    layers: [
      {
        id: 'backHair',
        label: 'Long Wavy Back Hair',
        zIndex: 10,
        visible: config.visibleLayers.backHair,
        anchorOffset: {x: 0, y: 0},
      },
      {
        id: 'body',
        label: 'Chibi Base Body & Blush',
        zIndex: 20,
        visible: config.visibleLayers.body,
        anchorOffset: {x: 0, y: 0},
      },
      {
        id: 'shoes',
        label: 'Ribbon Ballet Flats',
        zIndex: 25,
        visible: config.visibleLayers.shoes,
        anchorOffset: {x: 0, y: 0},
      },
      {
        id: 'innerDress',
        label: 'Pleated Camisole Maxi Dress',
        zIndex: 30,
        visible: config.visibleLayers.innerDress,
        anchorOffset: {x: 0, y: 0},
      },
      {
        id: 'cardiganLeftNeat',
        label: 'Cardigan Left Fitted Shoulder Panel',
        zIndex: 40,
        visible: config.visibleLayers.cardiganLeftNeat,
        anchorOffset: leftNeatOffset,
      },
      {
        id: 'cardiganRightSlouch',
        label: 'Cardigan Right Off-Shoulder Slouch Sleeve',
        zIndex: 45,
        visible: config.visibleLayers.cardiganRightSlouch,
        anchorOffset: rightSlouchOffset,
      },
      {
        id: 'face',
        label: 'Facial Features & Eyes',
        zIndex: 50,
        visible: config.visibleLayers.face,
        anchorOffset: {x: 0, y: 0},
      },
      {
        id: 'frontHair',
        label: 'Crown Braids, Bangs & Sprout Ahoge',
        zIndex: 60,
        visible: config.visibleLayers.frontHair,
        anchorOffset: {x: 0, y: 0},
      },
    ],
  };
}
