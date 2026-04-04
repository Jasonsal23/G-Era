import type { Product } from '@/types';

export type ProductCategory = 'men' | 'women' | 'hats' | 'all';

export const categories: { value: ProductCategory; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
  { value: 'hats', label: 'Hats' },
];

export const products: Product[] = [
  // ── Men's T-Shirts ──────────────────────────────────────────────
  {
    id: 'black-blingout-bart-tee',
    name: 'Gold AK Bart Tee — Black',
    description: 'Strapped, blinged out, and ready for whatever — that\'s the G.Era way. Gold AK on the back, skull belt buckle, no fear in the eyes. This ain\'t a cartoon tee. This is a statement. Heavyweight black cotton, bold back graphic. Wear it like you mean it.',
    priceInCents: 5000,
    images: [
      '/images/products/blackblingoutbartthsirt-back.png',
      '/images/products/blackblingoutbartthsirt-front.png',
    ],
    category: 'men',
    inStock: true,
    stripePriceId: 'price_1THHsRJwIdpAFh8rt5lfAwSS',
  },
  {
    id: 'black-party-bart-tee',
    name: 'Champagne Bart Tee — Black',
    description: 'La fiesta no empieza hasta que llegamos. Gold medallion out, red bottoms kicked up, champagne in hand — this is how the G.Era shows up. Black heavyweight tee, full back graphic. Los que saben, ya saben.',
    priceInCents: 5000,
    images: [
      '/images/products/blackpartybarttshirt-back.png',
      '/images/products/blackpartybarttshirt-front.png',
    ],
    category: 'men',
    inStock: true,
    stripePriceId: 'price_1THHt9JwIdpAFh8rdJFjcwJH',
  },
  {
    id: 'green-redbottom-bart-tee',
    name: 'Red Bottom Bart Tee — Olive',
    description: 'Tuxedo on, red bottoms flipped, skull ring on the finger — dressed like money doesn\'t even cover it. This is that belico luxury energy on an olive tee that hits different from every angle. Premium heavyweight cotton. Not for the weak.',
    priceInCents: 5000,
    images: [
      '/images/products/greenredbottombarttshirt-back.png',
      '/images/products/greenredbottombarttshirt-front.png',
    ],
    category: 'men',
    inStock: true,
    stripePriceId: 'price_1THHtTJwIdpAFh8rt5dCXJZv',
  },

  // ── Men's Hoodies ────────────────────────────────────────────────
  {
    id: 'green-belico-bart-hoodie',
    name: 'Belico Bart Hoodie — Olive',
    description: 'Siempre listo. Full tactical gear, vest loaded, saluting because he runs the operation — not the other way around. Army green heavyweight fleece built for the ones who stay ready. Belico from the inside out.',
    priceInCents: 7500,
    images: [
      '/images/products/greenbelicobarthoodie-back.png',
      '/images/products/greenbelicobarthoodie-front.png',
    ],
    category: 'men',
    inStock: true,
    stripePriceId: 'price_1THHtgJwIdpAFh8rSmp2r2RX',
  },
  {
    id: 'tan-blingout-bart-hoodie',
    name: 'Gold AK Bart Hoodie — Tan',
    description: 'Same streets, different colorway. Gold AK on the back, skull accessories stacked, all on a premium tan fleece that moves with you. Brushed interior, clean cut. The G.Era hits in every color.',
    priceInCents: 7500,
    images: [
      '/images/products/tanblingoutbarthoodie-back.png',
      '/images/products/tanblingoutbarthoodie-front.png',
    ],
    category: 'men',
    inStock: true,
    stripePriceId: 'price_1THHtsJwIdpAFh8rrq78AJni',
  },
  {
    id: 'black-party-bart-hoodie',
    name: 'Champagne Bart Hoodie — Black',
    description: 'When the celebration moves to the streets, you need the right fit. Gold medallion swinging, red bottoms up, champagne in hand — the whole drip, now on heavyweight black fleece. This is what making it looks like.',
    priceInCents: 7500,
    images: [
      '/images/products/blackpartybarthoodie-back.png',
      '/images/products/blackpartybarthoodie-front.png',
    ],
    category: 'men',
    inStock: true,
    stripePriceId: 'price_1THHu3JwIdpAFh8rs7J3Rp4R',
  },
  {
    id: 'black-redbottom-bart-hoodie',
    name: 'Red Bottom Bart Hoodie — Black',
    description: 'Dressed to the nines and still belico — red bottoms showing, skull ring on the finger, tuxedo on a black hoodie that hits harder than anything in your closet. This is street luxury, no compromise.',
    priceInCents: 7500,
    images: [
      '/images/products/blackredbottombarthoodie-back.png',
      '/images/products/blackredbottombarthoodie-front.png',
    ],
    category: 'men',
    inStock: true,
    stripePriceId: 'price_1THHuHJwIdpAFh8rRXdXG73C',
  },

  // ── Women's T-Shirts ─────────────────────────────────────────────
  {
    id: 'women-orange-redbottom-bart-tee',
    name: 'Red Bottom Bart Tee — Salmon Pink',
    description: 'Las que mandan wear Pink. Tuxedo drip, red bottoms kicked up, skull ring out — rhinestones on every bling detail that catch the light from across the room. All on a bold pink tee built for women who don\'t move quiet. Premium cotton, fitted cut. Walk in and take over.',
    priceInCents: 5000,
    images: [
      '/images/products/womenredbottombarttshirtorange-back.png',
      '/images/products/womenredbottombarttshirtorange-front.png',
    ],
    category: 'women',
    inStock: true,
    stripePriceId: 'price_1THHuTJwIdpAFh8rAIjtmIhJ',
  },
  {
    id: 'women-pink-party-bart-tee',
    name: 'Champagne Bart Tee — Rose Pink',
    description: 'Pink doesn\'t mean soft. Gold medallion out, red bottoms kicked up, champagne already open — rhinestones on the bling details that hit different under every light. This tee moves with the energy of a woman who knows exactly where she\'s going. Heavyweight pink cotton, full drip on the back.',
    priceInCents: 5000,
    images: [
      '/images/products/womenpartybartpinktshirt-back.png',
      '/images/products/womenpartybartpinktshirt-front.png',
    ],
    category: 'women',
    inStock: true,
    stripePriceId: 'price_1THHugJwIdpAFh8ruJrXuC83',
  },
  {
    id: 'women-white-party-bart-tee',
    name: 'Champagne Bart Tee — Cream',
    description: 'Clean white, full drip — the hardest combination in the game. Gold medallion, champagne, red bottoms all on the back, with rhinestones on the bling pieces that pop against the crisp white. Walk in looking like a whole moment. Heavyweight cotton, drop shoulders. Sin pretextos.',
    priceInCents: 5000,
    images: [
      '/images/products/womenpartybartwhitetshirt-back.png',
      '/images/products/womenpartybartwhitetshirt-front.png',
    ],
    category: 'women',
    inStock: true,
    stripePriceId: 'price_1THHurJwIdpAFh8ry75rnkcF',
  },

  // ── Hats ─────────────────────────────────────────────────────────
  {
    id: 'bart-hats',
    name: 'Bart Snapback Hat — One Size',
    description: 'All G.Era, no exceptions. Each style rocks a different Bart graphic for the ones who know the culture. Structured crown, clean finish. Pick yours and pull up.',
    priceInCents: 4000,
    images: ['/images/products/barthats1.png'],
    variants: [
      {
        label: 'Gold AK Bart w/Red Brim, Full Suede',
        images: [
          '/images/products/hats/bartakfelt.png',
          '/images/products/hats/bartakfeltbrim.png',
        ],
      },
      {
        label: 'Champagne Bart Trucker w/Red Brim',
        images: [
          '/images/products/hats/partybarttrucker.png',
          '/images/products/hats/partybarttruckerbrim.png',
        ],
      },
      {
        label: 'Champagne Bart w/Red Brim, Full Suede',
        images: [
          '/images/products/hats/partybartfullfelt.png',
          '/images/products/hats/partybartfullfeltbrim.png',
        ],
      },
      {
        label: 'Champagne Bart w/Black Suede Brim',
        images: [
          '/images/products/hats/partybarthalffelt.png',
          '/images/products/hats/partybarthalffeltbrim.png',
        ],
      },
      {
        label: 'Belico Bart w/Green Brim, Full Suede',
        images: [
          '/images/products/hats/belicobartfullsuede.png',
          '/images/products/hats/belicobartfullsuedebrim.png',
        ],
      },
      {
        label: 'Belico Bart w/Black Suede Brim',
        images: [
          '/images/products/hats/belicobarthalfsuede.png',
          '/images/products/hats/belicobarthalfsuedebrim.png',
        ],
      },
      {
        label: 'Belico Bart Trucker w/Green Brim',
        images: [
          '/images/products/hats/belicobarttrucker.png',
          '/images/products/hats/belicobarttruckerbrim.png',
        ],
      },  
    ],
    category: 'hats',
    inStock: true,
    stripePriceId: 'price_1THHv5JwIdpAFh8rtjP27ukZ',
  },
  {
    id: 'hellcat-hat',
    name: 'Hellcat Snapback Hat — One Size',
    description: 'Hellcat logo front and center. Built for the ones who don\'t fold under pressure. Structured crown, clean brim. More styles coming soon — stay ready.',
    priceInCents: 4000,
    images: ['/images/products/hellcathats.png'],
    variants: [
      {
        label: 'Grey Hellcat w/Grey Suede Brim',
        images: [
          '/images/products/hats/grayhellcat.png',
          '/images/products/hats/grayhellcatback.png',
          '/images/products/hats/grayhellcatbrim.png',
        ],
      },
      {
        label: 'Red Hellcat w/Red Suede Brim',
        images: [
          '/images/products/hats/redhellcat.png',
          '/images/products/hats/redhellcatback.png',
          '/images/products/hats/redhellcatbrim.png',
        ],
      },
    ],
    category: 'hats',
    inStock: true,
    stripePriceId: 'price_1THHvGJwIdpAFh8rAYaxkJ0k',
  },
];

export const getProductById = (id: string): Product | undefined => {
  return products.find((product) => product.id === id);
};

export const getProductsByCategory = (category: ProductCategory): Product[] => {
  if (category === 'all') return products;
  return products.filter((product) => product.category === category);
};

// Hand-pick featured products by ID (in the order you want them displayed)
export const featuredProductIds: string[] = [
  'black-blingout-bart-tee',
  'black-redbottom-bart-hoodie',
  'bart-hats',
  'women-pink-party-bart-tee',
];

export const getFeaturedProducts = (limit: number = 4): Product[] => {
  return featuredProductIds
    .slice(0, limit)
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => p !== undefined && p.inStock);
};
