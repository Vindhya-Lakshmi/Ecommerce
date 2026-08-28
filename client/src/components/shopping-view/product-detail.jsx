import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "sonner";
import { setProductDetails } from "@/store/shop/product-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);

  // Rating change
  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  // Add product to cart
  function handleAddToCart(getCurrentProductId, getTotalStock) {
    const getCartItems = cartItems?.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );

      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;

        if (getQuantity + 1 > getTotalStock) {
          toast.error(
            `Only ${getQuantity} quantity can be added for this item`
          );

          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast.success("Product is added to cart");
      }
    });
  }

  // Close dialog
  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  }

  // Add review
  function handleAddReview() {
    if (!reviewMsg.trim()) {
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        setRating(0);
        setReviewMsg("");

        dispatch(getReviews(productDetails?._id));

        toast.success("Review added successfully!");
      }
    });
  }

  // Get reviews when product changes
  useEffect(() => {
    if (productDetails?._id) {
      dispatch(getReviews(productDetails._id));
    }
  }, [productDetails?._id, dispatch]);

  // Calculate average review
  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce(
          (sum, reviewItem) => sum + reviewItem.reviewValue,
          0
        ) / reviews.length
      : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-6
          p-6
          sm:p-8
          max-w-[90vw]
          sm:max-w-[80vw]
          lg:max-w-[70vw]
        "
      >
        {/* ================= LEFT SIDE - PRODUCT IMAGE ================= */}
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="aspect-square w-full object-cover"
          />
        </div>

        {/* ================= RIGHT SIDE - PRODUCT DETAILS ================= */}
        <div className="flex flex-col">
          {/* Product title and description */}
          <div>
            <h1 className="text-2xl font-bold">
              {productDetails?.title}
            </h1>

            <p className="text-muted-foreground text-base mt-2 mb-3">
              {productDetails?.description}
            </p>
          </div>

          {/* ================= PRICE ================= */}
          <div className="flex items-center justify-between">
            <p
              className={`text-3xl font-bold text-primary ${
                productDetails?.salePrice > 0
                  ? "line-through"
                  : ""
              }`}
            >
              ${productDetails?.price}
            </p>

            {productDetails?.salePrice > 0 && (
              <p className="text-2xl font-bold text-muted-foreground">
                ${productDetails?.salePrice}
              </p>
            )}
          </div>

          {/* ================= RATING ================= */}
          <div className="flex items-center gap-2 mt-2">
            <StarRatingComponent rating={averageReview} />

            <span className="text-sm text-muted-foreground">
              ({averageReview.toFixed(2)})
            </span>
          </div>

          {/* ================= ADD TO CART ================= */}
          <div className="mt-4 mb-4">
            {productDetails?.totalStock === 0 ? (
              <Button
                className="w-full opacity-60 cursor-not-allowed"
                disabled
              >
                Out of Stock
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() =>
                  handleAddToCart(
                    productDetails?._id,
                    productDetails?.totalStock
                  )
                }
              >
                Add to Cart
              </Button>
            )}
          </div>

          <Separator />

          {/* ================= REVIEWS ================= */}
          <div className="max-h-[250px] overflow-auto mt-4">
            <h2 className="text-xl font-bold mb-4">
              Reviews
            </h2>

            <div className="grid gap-4">
              {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem) => (
                  <div
                    key={reviewItem?._id}
                    className="flex gap-4"
                  >
                    {/* Avatar */}
                    <Avatar className="w-10 h-10 border">
                      <AvatarFallback>
                        {reviewItem?.userName
                          ?.charAt(0)
                          ?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>

                    {/* Review content */}
                    <div className="grid gap-1">
                      <h3 className="font-bold">
                        {reviewItem?.userName}
                      </h3>

                      <div className="flex items-center">
                        <StarRatingComponent
                          rating={reviewItem?.reviewValue}
                        />
                      </div>

                      <p className="text-muted-foreground">
                        {reviewItem?.reviewMessage}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">
                  No Reviews
                </p>
              )}
            </div>
          </div>

          {/* ================= WRITE A REVIEW ================= */}
          <div className="mt-6 flex flex-col gap-2">
            <Label>Write a review</Label>

            {/* Rating */}
            <div className="flex gap-1">
              <StarRatingComponent
                rating={rating}
                handleRatingChange={handleRatingChange}
              />
            </div>

            {/* Review input */}
            <Input
              name="reviewMsg"
              value={reviewMsg}
              onChange={(event) =>
                setReviewMsg(event.target.value)
              }
              placeholder="Write a review..."
            />

            {/* Submit */}
            <Button
              onClick={handleAddReview}
              disabled={reviewMsg.trim() === ""}
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;