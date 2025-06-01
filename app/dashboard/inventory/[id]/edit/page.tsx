'"use client"'
import { use, Suspense } from "react"
import { EditProductContent } from "./edit-product-content"

export default function EditProduct({ params }: { params: { id: string } }) {
  // Unwrap params using React.use()
  const unwrappedParams = use(Promise.resolve(params));
  
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <EditProductContent id={unwrappedParams.id} />
    </Suspense>
  );
}
