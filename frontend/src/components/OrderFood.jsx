// src/components/OrderFood.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useAuth } from "../context/AuthContext";
export default function OrderFood() {
  const { user } = useAuth();
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);

  // ✅ Fetch menu from backend
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/services/food");
        setMenu(res.data);
      } catch (err) {
        console.error("Error fetching menu:", err);
      }
    };
    fetchMenu();
  }, []);
  // Inside OrderFood component
const [bookings, setBookings] = useState([]);
const [selectedBooking, setSelectedBooking] = useState(null);

// ✅ Fetch active bookings for this user
useEffect(() => {
  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/bookings/user/${user.id}`
      );
      // filter for checked-in only
      setBookings(res.data.filter((b) => b.status === "checked-in"));
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };
  if (user?.id) fetchBookings();
}, [user]);

  // ✅ Add item to cart
  const addToCart = (item) => {
    const exists = cart.find((c) => c._id === item._id);
    if (exists) {
      setCart(
        cart.map((c) =>
          c._id === item._id ? { ...c, quantity: c.quantity + 1 } : c
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1, instructions: "" }]);
    }
  };

  // ✅ Update quantity
  const updateQuantity = (id, delta) => {
    setCart(
      cart.map((c) =>
        c._id === id
          ? { ...c, quantity: Math.max(1, c.quantity + delta) }
          : c
      )
    );
  };

  // ✅ Update instructions
  const updateInstructions = (id, value) => {
    setCart(
      cart.map((c) => (c._id === id ? { ...c, instructions: value } : c))
    );
  };

  // ✅ Calculate total
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // ✅ Confirm Order
  const confirmOrder = async () => {
    if (cart.length === 0) return alert("Your cart is empty!");
    if (!selectedBooking) return alert("Please select a room before ordering!");

    try {
      await axios.post("http://localhost:3000/api/service-requests", {
        userId: user.id, // get from auth
        BookingId: selectedBooking._id, // get from booking
        roomNumber: selectedBooking.roomNumber, // replace dynamically
        serviceType: "Food",
        serviceTypeRef: "FoodService",
        items: cart.map((item) => ({
          serviceId: item._id,
          name: item.name,
          quantity: item.quantity,
          priceAtOrder: item.price,
          instructions: item.instructions,
        })),
        totalAmount,
      });

      alert("Order placed successfully!");
      setCart([]);
      // redirect to guest-dashboard -> active orders tab
      // window.location.href = "/guest-dashboard?tab=active-orders";
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Failed to place order");
    }
  };

  return (
    <div className="flex p-6 gap-6">
      {/* ✅ Menu Section */}
      <div className="w-2/3 grid grid-cols-2 gap-4">
        {menu.map((item) => (
          <Card key={item._id} className="shadow-lg rounded-2xl">
            <CardContent className="p-4 flex flex-col items-center">
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-32 h-32 object-cover rounded-xl mb-3"
                />
              )}
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-gray-600 mb-2">৳ {item.price}</p>
              <Button onClick={() => addToCart(item)}>Add to Cart</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ✅ Cart Section */}
      <div className="w-1/3 bg-white shadow-xl rounded-2xl p-4 sticky top-6 h-fit">
        <h2 className="text-xl font-bold mb-4">Your Cart</h2>
        {cart.length === 0 ? (
          <p className="text-gray-500">No items yet</p>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item._id} className="border-b pb-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p>৳ {item.price * item.quantity}</p>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateQuantity(item._id, -1)}
                  >
                    -
                  </Button>
                  <span>{item.quantity}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateQuantity(item._id, 1)}
                  >
                    +
                  </Button>
                </div>
                <Textarea
                  placeholder="Add instructions..."
                  value={item.instructions}
                  onChange={(e) =>
                    updateInstructions(item._id, e.target.value)
                  }
                  className="mt-2"
                />
              </div>
            ))}
          </div>
        )}

        {/* ✅ Room Selection */}

       {/* Room Selection */}
<div className="mt-3">
  <label className="font-semibold">Select Room:</label>
  {bookings.length > 0 ? (
    <select
      value={selectedBooking?._id || ""}
      onChange={(e) =>
        setSelectedBooking(
          bookings.find((b) => b._id === e.target.value)
        )
      }
      className="w-full border rounded-lg p-2 mt-1"
    >
      <option value="">-- Choose Room --</option>
      {bookings.map((b) => (
        <option key={b._id} value={b._id}>
          Room {b.roomNumber}
        </option>
      ))}
    </select>
  ) : (
    <p className="text-red-500 mt-1">
      You have not checked into any room.
    </p>
  )}
</div>




        {/* ✅ total ammount  Section */}


        {cart.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold text-lg">
              Total: ৳ {totalAmount}
            </h3>
            <Button className="w-full mt-3" onClick={confirmOrder}>
              Confirm Order
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
