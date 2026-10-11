import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";

import ShoppingOrderDetailsView from "./order-details";

import {
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails,
} from "@/store/shop/order-slice";

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector(
    (state) => state.shopOrder
  );

  function handleFetchOrderDetails(id) {
    dispatch(getOrderDetails(id));
  }

  useEffect(() => {
    if (user?.id) {
      dispatch(getAllOrdersByUserId());
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (orderDetails !== null) {
      setOpenDetailsDialog(true);
    }
  }, [orderDetails]);

  async function handleCancelOrder(orderId) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      setCancellingOrderId(orderId);

      const response = await axios.patch(
        `http://localhost:5000/api/shop/order/cancel/${orderId}`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Order cancelled successfully!");

        // Refresh the order list from the backend.
        await dispatch(getAllOrdersByUserId()).unwrap();

        // If this order is open in the details dialog, refresh its details.
        if (orderDetails?._id === orderId) {
          dispatch(resetOrderDetails());
          setOpenDetailsDialog(false);
        }
      } else {
        toast.error(response.data.message || "Unable to cancel order.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to cancel order."
      );
    } finally {
      setCancellingOrderId(null);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orderList && orderList.length > 0 ? (
              orderList.map((orderItem) => (
                <TableRow key={orderItem?._id}>
                  <TableCell className="max-w-[160px] break-all">
                    {orderItem?._id}
                  </TableCell>

                  <TableCell>
                    {orderItem?.orderDate?.split("T")[0] || "N/A"}
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={`py-1 px-3 ${
                        orderItem?.orderStatus === "confirmed"
                          ? "bg-green-500"
                          : orderItem?.orderStatus === "cancelled"
                          ? "bg-red-600"
                          : orderItem?.orderStatus === "rejected"
                          ? "bg-red-600"
                          : "bg-black"
                      }`}
                    >
                      {orderItem?.orderStatus}
                    </Badge>
                  </TableCell>

                  <TableCell>${orderItem?.totalAmount}</TableCell>

                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          handleFetchOrderDetails(orderItem?._id)
                        }
                      >
                        View Details
                      </Button>

                      {["pending", "confirmed"].includes(
                        orderItem?.orderStatus
                      ) && (
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={cancellingOrderId === orderItem?._id}
                          onClick={() =>
                            handleCancelOrder(orderItem?._id)
                          }
                        >
                          {cancellingOrderId === orderItem?._id
                            ? "Cancelling..."
                            : "Cancel Order"}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Dialog
          open={openDetailsDialog}
          onOpenChange={(open) => {
            setOpenDetailsDialog(open);

            if (!open) {
              dispatch(resetOrderDetails());
            }
          }}
        >
          {orderDetails && (
            <ShoppingOrderDetailsView orderDetails={orderDetails} />
          )}
        </Dialog>
      </CardContent>
    </Card>
  );
}

export default ShoppingOrders;