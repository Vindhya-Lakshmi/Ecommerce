
import { useEffect, useState } from "react";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { addToCart } from "@/store/shop/cart-slice";

function ShoppingWishlist() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);

  const [wishlist, setWishlist] = useState([]);

  // Load wishlist saved for this user
  useEffect(() => {
    if (!user?.id) return;

    const savedWishlist = localStorage.getItem(
      `wishlist_${user.id}`
    );

    setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);
  }, [user?.id]);

  // Save wishlist whenever it changes
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(
        `wishlist_${user.id}`,
        JSON.stringify(wishlist)
      );
    }
  }, [wishlist, user?.id]);

  // Remove a product from wishlist
  function handleRemove(productId) {
    setWishlist((previous) =>
      previous.filter((product) => product._id !== productId)
    );

    toast.success("Product removed from wishlist");
  }

  // Add a wishlist product to cart
  function handleAddToCart(product) {
    if (!user?.id) {
      toast.error("Please log in first");
      return;
    }

    dispatch(
      addToCart({
        userId: user.id,
        productId: product._id,
        quantity: 1,
      })
    );

    toast.success("Added to cart");
  }

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 py-10">
      <div className="mb-8 flex items-center gap-3">
        <Heart className="h-8 w-8 fill-red-500 text-red-500" />

        <div>
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <p className="mt-1 text-sm text-gray-500">
            Your favourite products, all in one place.
          </p>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-16 text-center">
            <Heart className="mb-4 h-16 w-16 text-gray-300" />

            <h2 className="text-xl font-semibold">
              Your wishlist is empty
            </h2>

            <p className="mt-2 text-gray-500">
              Save products you love and find them here later.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((product) => (
            <Card key={product._id} className="overflow-hidden">
              <div className="relative bg-gray-50">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-64 w-full object-contain p-4"
                />

                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-3 top-3 rounded-full bg-white"
                  onClick={() => handleRemove(product._id)}
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>

              <CardContent className="space-y-4 p-4">
                <h2 className="line-clamp-2 font-semibold">
                  {product.title}
                </h2>

                <p className="text-lg font-bold">
                  ₹{product.price}
                </p>

                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleRemove(product._id)}
                  >
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default ShoppingWishlist;
