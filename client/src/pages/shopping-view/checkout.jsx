import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { toast } from "sonner";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.shopOrder);

  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);

  const dispatch = useDispatch();

  console.log(currentSelectedAddress, "selected address");
  console.log(cartItems, "cart items");

  // Calculate total amount
  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  // Place COD order
  function handlePlaceOrder() {
    // Check cart
    if (!cartItems?.items || cartItems.items.length === 0) {
      toast.error("Your cart is empty. Please add items to proceed");
      return;
    }

    // Check address
    if (!currentSelectedAddress) {
      toast.error("Please select one address to proceed.");
      return;
    }

    // Check user
    if (!user?.id) {
      toast.error("Please login before placing an order.");
      return;
    }

    const orderData = {
      userId: user.id,

      cartId: cartItems?._id,

      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),

      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },

      orderStatus: "pending",
      paymentMethod: "cod",
      paymentStatus: "pending",

      totalAmount: totalCartAmount,
    };

    console.log("Sending order:", orderData);

    dispatch(createNewOrder(orderData)).then((data) => {
      console.log("Order response:", data);

      if (data?.payload?.success) {
        toast.success("Order placed successfully!");

        // Optional: you can navigate to orders page here
        // navigate("/shop/account");
      } else {
        toast.error(
          data?.payload?.message || "Failed to place order"
        );
      }
    });
  }

  return (
    <div className="flex flex-col">
      {/* Header Image */}
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={img}
          className="h-full w-full object-cover object-center"
          alt="Checkout"
        />
      </div>

      {/* Checkout Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        {/* Address Section */}
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />

        {/* Cart + Order Summary */}
        <div className="flex flex-col gap-4">
          {/* Cart Items */}
          {cartItems &&
          cartItems.items &&
          cartItems.items.length > 0 ? (
            cartItems.items.map((item) => (
              <UserCartItemsContent
                key={item.productId}
                cartItem={item}
              />
            ))
          ) : (
            <p className="text-center text-gray-500">
              Your cart is empty.
            </p>
          )}

          {/* Total */}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>

              <span className="font-bold">
                ${totalCartAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* COD Button */}
          <div className="mt-4 w-full">
            <Button
              onClick={handlePlaceOrder}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading
                ? "Placing Order..."
                : "Place Order (Cash on Delivery)"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;