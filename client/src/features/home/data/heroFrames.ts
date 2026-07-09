/**
 * Hero editorial frame data.
 *
 * Each entry describes a single SVG product frame or mapped grid item:
 *   - imageUrl  → fashion photo (temporary; replace with CMS/API data later)
 *   - alt       → accessible label surfaced on the Link overlay
 *   - to        → react-router route for client-side navigation
 *   - name      → product display name
 *   - price     → product price
 */

export interface HeroFrameConfig {
  readonly imageUrl: string;
  readonly alt: string;
  readonly to: string;
  readonly name?: string;
  readonly price?: string;
}

/** Left panel — single large frame (249 × 299) */
export const FRAME_LEFT_MAIN: HeroFrameConfig = {
  imageUrl: 'https://i.pinimg.com/1200x/9b/c2/f3/9bc2f363293773ada6f0e5240077be7a.jpg',
  alt: 'Adidas — Archive Collection',
  to: '/new-in',
};

/** Right panel — top frame (249 × 299) */
export const FRAME_RIGHT_TOP: HeroFrameConfig = {
  imageUrl: 'https://i.pinimg.com/1200x/85/78/62/8578620d4e2c1883b33fb0f2c52ef9a2.jpg',
  alt: 'Converse — Street Culture',
  to: '/men',
};

/** Right panel — bottom frame (199 × 249) */
export const FRAME_RIGHT_BOTTOM: HeroFrameConfig = {
  imageUrl: 'https://i.pinimg.com/1200x/37/a5/60/37a560f65c09d75677f33d2b8f721b54.jpg',
  alt: 'Reebok — Classic Silhouette',
  to: '/women',
};

export const PRODUCTS_BOTTOM: HeroFrameConfig[] = [
  {
    imageUrl:
      'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/1_0114efd5-2317-46ce-8353-5b6ca08acf2e.jpg?v=1780588263&quality=80',
    alt: 'Vintage Knit Polo',
    name: 'Vintage Knit Polo',
    price: '₹1,899',
    to: '/product/vintage-knit-polo',
  },
  {
    imageUrl:
      'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS4329-04-L12.jpg?v=1771238310&quality=80',
    alt: 'Pleated Smart Trouser',
    name: 'Pleated Trouser',
    price: '₹2,299',
    to: '/product/pleated-smart-trouser',
  },
  {
    imageUrl:
      'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4mss4329-06_1.jpg?v=1761059888&quality=80',
    alt: 'Utility Cargo Shirt',
    name: 'Cargo Shirt',
    price: '₹1,699',
    to: '/product/utility-cargo-shirt',
  },
  {
    imageUrl:
      'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3555-01-M41.jpg?v=1734529185&quality=80',
    alt: 'Relaxed Fit Linen Blend',
    name: 'Linen Shirt',
    price: '₹1,999',
    to: '/product/relaxed-fit-linen-blend',
  },
  {
    imageUrl:
      'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS4328-02-M10.jpg?v=1759578429&quality=80',
    alt: 'Classic Denim Trucker',
    name: 'Denim Trucker',
    price: '₹2,899',
    to: '/product/classic-denim-trucker',
  },
  {
    imageUrl:
      'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4mss4329-06_1.jpg?v=1761059888&quality=80',
    alt: 'Boxy Fit Knit Tee',
    name: 'Boxy Knit Tee',
    price: '₹1,299',
    to: '/product/boxy-fit-knit-tee',
  },
];
