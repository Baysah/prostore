import { Metadata } from 'next';
import ProductForm from '@/components/ProductForm';

export const metadata: Metadata = {
  title: 'Create Product',
};

const ProductCreatePage = () => {
  return (
    <>
      <h1 className="h2-bold">Create Product</h1>
      <div className="my-8">
        <ProductForm type='Create' />
      </div>
    </>
  );
};

export default ProductCreatePage;
