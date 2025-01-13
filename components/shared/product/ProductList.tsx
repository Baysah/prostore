import { Product } from "@/types";
import ProductCard from "./ProductCard";

interface ProductListProps {
  data: Product[];
  title?: string;
  limit?: number;
}

const ProductList = ({ data, title, limit }: ProductListProps) => {
  
    const limitedData = limit ? data.slice(0, limit) : data;
  return (
    <div className="my-10">
      <h2 className="h2-bold mb-4">{title}</h2>

      {data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {limitedData.map((product: Product, index: number) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      ) : (
        <div>
          <h3>No products found</h3>
        </div>
      )}
    </div>
  );
};

export default ProductList;
