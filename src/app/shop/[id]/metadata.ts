import type { Metadata } from 'next';
import { getProductById } from '@/data/products';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  const price = (product.priceInCents / 100).toFixed(2);
  const image = product.variants?.[0]?.images[0] ?? product.images[0];

  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} | G.Era`,
      description: product.description.slice(0, 160),
      url: `https://g-era.com/shop/${product.id}`,
      images: image
        ? [{ url: `https://g-era.com${image}`, width: 800, height: 800, alt: product.name }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | G.Era`,
      description: product.description.slice(0, 160),
      images: image ? [`https://g-era.com${image}`] : [],
    },
    other: {
      'product:price:amount': price,
      'product:price:currency': 'USD',
    },
  };
}
