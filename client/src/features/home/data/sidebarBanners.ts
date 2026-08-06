import {
  FRAME_LEFT_MAIN,
  FRAME_RIGHT_TOP,
  FRAME_RIGHT_BOTTOM,
  PRODUCTS_BOTTOM,
} from './heroFrames';

export interface SidebarBannerItem {
  id: string;
  imageUrl: string;
  alt: string;
  badge: string;
  title: string;
  subtitle: string;
  offerTag?: string;
  ctaText: string;
  ctaLink: string;
}

export const SIDEBAR_BANNERS: SidebarBannerItem[] = [
  {
    id: 'banner-1',
    imageUrl: FRAME_LEFT_MAIN.imageUrl,
    alt: FRAME_LEFT_MAIN.alt,
    badge: 'NEW SEASON DROP',
    title: 'ARCHIVE STREETWEAR ' + new Date().getFullYear(),
    subtitle: 'Elevated silhouettes crafted from heavy-weight 400GSM organic cotton.',
    offerTag: 'FLAT 20% OFF',
    ctaText: 'EXPLORE DROP',
    ctaLink: FRAME_LEFT_MAIN.to,
  },
  {
    id: 'banner-2',
    imageUrl: FRAME_RIGHT_TOP.imageUrl,
    alt: FRAME_RIGHT_TOP.alt,
    badge: 'EDITORIAL PICK',
    title: 'RETRO MONOCHROME DENIM',
    subtitle: 'Classic vintage washes engineered for modern relaxed fits.',
    offerTag: 'TRENDING',
    ctaText: 'SHOP DENIM',
    ctaLink: FRAME_RIGHT_TOP.to,
  },
  {
    id: 'banner-3',
    imageUrl: PRODUCTS_BOTTOM[0].imageUrl,
    alt: PRODUCTS_BOTTOM[0].alt,
    badge: 'LIMITED EDITION',
    title: 'VINTAGE KNIT POLOS',
    subtitle: 'Breathable texture weaves with structured open collars.',
    offerTag: 'POPULAR',
    ctaText: 'VIEW POLOS',
    ctaLink: PRODUCTS_BOTTOM[0].to,
  },
  {
    id: 'banner-4',
    imageUrl: FRAME_RIGHT_BOTTOM.imageUrl,
    alt: FRAME_RIGHT_BOTTOM.alt,
    badge: 'HERITAGE SERIES',
    title: 'MINIMAL LUXURY TAILORING',
    subtitle: 'Refined pleated trousers and relaxed linen shirt layers.',
    offerTag: 'FRESH ARRIVAL',
    ctaText: 'DISCOVER LOOKS',
    ctaLink: FRAME_RIGHT_BOTTOM.to,
  },
];
