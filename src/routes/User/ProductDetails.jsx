import MainLayout from '../../layouts/MainLayout'

const ProductDetails = () => {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="bg-white dark:bg-dark-800 rounded-xl p-8">
            <div className="w-full h-96 bg-gradient-to-br from-primary-200 to-wine-200 rounded-lg flex items-center justify-center">
              <span className="text-8xl">💎</span>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <h1 className="text-4xl font-elegant font-bold text-dark-900 dark:text-white">
              Premium Gold Necklace
            </h1>
            <p className="text-3xl font-bold text-primary-500">$249.99</p>
            <p className="text-dark-600 dark:text-dark-300 text-lg">
              Exquisitely crafted 18k gold necklace with diamond accents. Perfect for special occasions and everyday elegance.
            </p>
            
            <div className="space-y-4">
              <button className="w-full bg-wine-500 hover:bg-wine-600 text-white py-4 rounded-lg font-semibold text-lg transition-colors">
                Add to Cart
              </button>
              <button className="w-full border-2 border-primary-500 text-primary-500 dark:border-primary-400 dark:text-primary-400 hover:bg-primary-500 hover:text-white py-4 rounded-lg font-semibold text-lg transition-colors">
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default ProductDetails