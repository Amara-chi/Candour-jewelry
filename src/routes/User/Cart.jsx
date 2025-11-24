import MainLayout from '../../layouts/MainLayout'

const Cart = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-elegant font-bold text-dark-900 dark:text-white mb-8">
          Shopping Cart
        </h1>
        
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6">
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🛒</span>
            <h3 className="text-xl font-semibold text-dark-700 dark:text-dark-300 mb-2">
              Your cart is empty
            </h3>
            <p className="text-dark-500 dark:text-dark-400 mb-6">
              Discover our beautiful jewelry collection and add some sparkle to your cart!
            </p>
            <button className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default Cart