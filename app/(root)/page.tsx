import ProductList from '@/components/shared/product/ProductList';
import { getLatestProducts } from '@/lib/actions/product.actions';

const HomePage = async () => {
  const latestProducts = await getLatestProducts();

  return (
    <>
      <ProductList data={latestProducts} title="Newest Arricals" />
    </>
  );
};

export default HomePage;
