'use client';
import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface Props {
  images: string[];
}

const ProductImages = ({ images }: Props) => {
  const [currentImage, setCurrentImage] = useState(0);
  return (
    <div className="space-y-4">
      <Image
        src={images[currentImage]}
        alt="product image"
        width={1000}
        height={1000}
        className="min-h-[300px] object-cover object-center"
      />
      <div className="flex">
        {images.map((image, index) => (
          <div
            key={index}
            className={cn(
              'cursor-pointer border mr-2 hover:border-foreground',
              index === currentImage && 'border-orange-500'
            )}
            onClick={() => setCurrentImage(index)}
          >
            <Image src={image} alt="product image" width={100} height={100} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
