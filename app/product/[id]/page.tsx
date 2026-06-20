import dbConnect from '../../../lib/dbConnect';
import Product from '../../../models/Product';
import AddToCartButton from '../../../components/AddToCartButton';
import ReviewForm from '../../../components/ReviewForm';

async function getProduct(id: string) {
  try {
    await dbConnect();
    const product = await Product.findById(id).lean();
    if (!product) return null;
    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error("Error loading product directly:", error);
    return null;
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    return (
      <div className="text-center py-20 bg-gray-900 m-10 rounded-2xl border border-dashed border-gray-800">
        <h2 className="text-2xl font-bold text-white">Product Not Found</h2>
        <p className="text-gray-400 mt-2">Could not find an item with ID: {resolvedParams.id}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-12 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <div className="w-full md:w-1/2 bg-gray-50 rounded-2xl overflow-hidden aspect-square relative">
          <img
            src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <span className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">
            {product.category}
          </span>
          <h1 className="text-4xl font-black text-gray-900 mb-4">{product.name}</h1>
          <p className="text-lg text-gray-500 mb-8 leading-relaxed">
            {product.description}
          </p>
          
          <div className="flex items-center space-x-4 mb-8">
            <span className="text-4xl font-black text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.stockCount > 0 ? (
              <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-bold">
                In Stock ({product.stockCount})
              </span>
            ) : (
              <span className="bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full font-bold">
                Out of Stock
              </span>
            )}
          </div>

          <AddToCartButton product={product} />
        </div>
      </div>

      <div className="mt-16 border-t border-gray-800 pt-12 max-w-4xl mx-auto">
        <h2 className="text-2xl font-black text-white mb-8">Customer Reviews</h2>
        
        <ReviewForm productId={product._id} />

        <div className="space-y-6">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((rev: any) => (
              <div key={rev._id} className="border-b border-gray-800 pb-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-sm font-bold text-white">{rev.username}</h4>
                    <p className="text-xs text-blue-400 font-semibold mt-0.5">{'⭐'.repeat(rev.rating)}</p>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-300 font-medium leading-relaxed">{rev.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic bg-gray-900/30 border border-gray-800/50 p-4 rounded-xl text-center">
              No reviews yet. Be the first to verify this premium hardware!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}