import Image from 'next/image';
import Link from 'next/link';
import { getPlaiceholder } from 'plaiceholder';

import { Product } from '@/lib/models/ProductModel';

import { Rating } from './Rating';

const ProductItem = async ({ product }: { product: Product }) => {
  // const buffer = await fetch(product.image).then(async (res) =>
  //   Buffer.from(await res.arrayBuffer()),
  // );

  // const { base64 } = await getPlaiceholder(buffer);
  const formattedPrice = product.price.toLocaleString('en-PK', {
    style: 'currency',
    currency: 'PKR',
  });
  return (
    <div className='card mb-4 bg-base-300'>
      <figure>
        <Link
          href={`/product/${product.slug}`}
          className='relative aspect-square h-full w-full'
        >
          <Image
            src={product.image}
            alt={product.name}
            placeholder='blur'
            blurDataURL={product.image}
            width={350}
            height={350}
            className='h-full w-full object-cover'
          />
        </Link>
      </figure>
      <div className='card-body'>
        <Link href={`/product/${product.slug}`}>
          <h3 className='card-title line-clamp-1 font-normal'>
            {product.name}
          </h3>
        </Link>
        <Rating value={product.rating} caption={`(${product.name})`} isCard />
        <p className='line-clamp-1'>{product.brand}</p>
        <div className='card-actions flex items-center justify-between'>
          <span className='text-2xl'>{formattedPrice}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
