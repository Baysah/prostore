import { Metadata } from 'next';
import ProductForm from '@/components/ProductForm';
import { auth } from '@/auth';
import { getProductById } from '@/lib/actions/product.actions';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Update Product',
};

interface Props {
  params: Promise<{
    id: string;
  }>;
}

const AdminProductEditPage = async ({ params }: Props) => {
  //get the order id from the url
  const { id } = await params;

  //check if user as an admin
  const session = await auth();

  const isAdmin = session?.user?.role === 'admin' || false;
  if (!isAdmin) return <div>Not Authorized</div>;

  //get the product from the database
  const product = await getProductById(id);

  if(!product) return notFound();

  return (
    <div className='space-y-8 max-w-5xl mx-auto'>
      <h1 className="h2-bold">Update Product</h1>
        <ProductForm type="Update" product={product} productId={id} />
    </div>
  );
};

export default AdminProductEditPage;
