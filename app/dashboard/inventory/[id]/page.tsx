import { use } from 'react';
import { ProductDetailsContent } from './product-details-content';

export default function ProductDetails({ params }: { params: { id: string } }) {
  const resolvedParams = use(Promise.resolve(params));
  return (
    <div>
      <ProductDetailsContent id={resolvedParams.id} />
    </div>
  );
}
