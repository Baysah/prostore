import ProductList from '@/components/shared/product/ProductList';
import { getProducts } from '@/lib/actions/product.actions';

const AllProductsPage = async () => {
  const products = await getProducts();
  return (
    <>
      <ProductList data={products} title="Products" />
    </>
  );
};

export default AllProductsPage;
