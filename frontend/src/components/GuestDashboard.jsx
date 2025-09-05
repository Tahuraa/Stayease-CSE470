import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Bed, 
  Calendar, 
  CreditCard, 
  Bell, 
  Star, 
  MapPin, 
  LogOut,
  Plus,
  ShoppingCart,
  Clock,
  CheckCircle,
  Package
} from 'lucide-react';
import { mockRooms, mockBookings, mockOrders, mockServices, logoutUser } from '../lib/mock';
import { useToast } from '../hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import  { useEffect } from "react";
import axios from "axios";


const GuestDashboard = () => {
  const { user, setUser , loading , logout } = useAuth();
  const [UserBookings, setUserBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  if (loading) return <p>Loading user info...</p>;
  if (!user) return <p>Please login to see this page.</p>;
  const [activeOrders, setActiveOrders] = useState(mockOrders);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast({
      title: "Logged out successfully",
      description: "Thank you for using StayEase",
      duration: 3000,
    });
    navigate("/login"); 
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/bookings/user/${user.id}`);
      setUserBookings(res.data); // backend should return array of bookings
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load your bookings",
        variant: "destructive",
      });
    } finally {
      setLoadingBookings(false);
    }
  };


  

  // const userBookings = mockBookings.filter(booking => booking.guestId === user.id);
  const userOrders = mockOrders.filter(order => order.guestId === user.id);

  const orderFood = (item) => {
    const newOrder = {
      id: `o${Date.now()}`,
      guestId: user.id,
      roomNumber: '101',
      items: [{ name: item.name, quantity: 1, price: item.price }],
      total: item.price,
      status: 'preparing',
      orderTime: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 30 * 60000).toISOString()
    };
    
    setActiveOrders([...activeOrders, newOrder]);
    toast({
      title: "Order placed successfully!",
      description: `${item.name} has been ordered`,
      duration: 3000,
    });
  };

  const requestService = (serviceName) => {
    toast({
      title: "Service requested",
      description: `${serviceName} has been requested for your room`,
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Bed className="h-8 w-8 text-amber-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-amber-600 bg-clip-text text-transparent">
                StayEase
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Bell className="h-6 w-6 text-gray-600 cursor-pointer hover:text-blue-600 transition-colors" />
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>
     

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}!
          </h2>
          <p className="text-gray-600">Manage your bookings and enjoy our services</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link to="/booking">
            <Card className="hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer border-2 border-transparent hover:border-blue-200">
              <CardHeader className="text-center">
                <Plus className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Book New Room</CardTitle>
                <CardDescription>Find and book your perfect stay</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link to="/order-food">
            <Card className="hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer border-2 border-transparent hover:border-amber-200">
              <CardHeader className="text-center">
                <ShoppingCart className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Room Service</CardTitle>
                <CardDescription>Order food & amenities</CardDescription>
            </CardHeader>
          </Card>
          </Link>
          <Link to="/housekeeping">
            <Card className="hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer border-2 border-transparent hover:border-green-200">
              <CardHeader className="text-center">
                <Package className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Housekeeping</CardTitle>
                <CardDescription>Request cleaning services</CardDescription>
            </CardHeader>
          </Card>
          </Link>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/60 backdrop-blur-sm">
            <TabsTrigger value="bookings" className="data-[state=active]:bg-blue-100">
              My Bookings
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-amber-100">
              Active Orders
            </TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-green-100">
              Room Service
            </TabsTrigger>
            <TabsTrigger value="housekeeping" className="data-[state=active]:bg-purple-100">
              Housekeeping
            </TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <div className="grid gap-6">
              {UserBookings.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <CardTitle className="text-xl text-gray-600 mb-2">No bookings yet</CardTitle>
                    <CardDescription className="mb-4">Start your journey by booking your first room</CardDescription>
                    <Link to="/booking">
                      <Button className="bg-gradient-to-r from-blue-600 to-amber-600 hover:from-blue-700 hover:to-amber-700">
                        Book Now
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                UserBookings.map((booking) => {

                  return (
                    <Card key={booking._id} className="shadow-lg border-0">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl mb-2">{booking.roomTypeId.roomTypeName}</CardTitle>
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin className="h-4 w-4" />
                              <span>Room {booking.roomNumber}</span>
                            </div>
                          </div>
                          <Badge className={`${
                            booking.status === 'confirmed' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {booking.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Check-in</p>
                            <p className="font-semibold">{new Date(booking.checkInDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Check-out Date</p>
                            <p className="font-semibold">{new Date(booking.checkOutDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Total Amount</p>
                            <p className="font-semibold text-green-600">${booking.totalPrice}</p>
                          </div>
                        </div>
                        {/* {booking.specialRequests && (
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-700">
                              <strong>Special Request:</strong> {booking.specialRequests}
                            </p>
                          </div>
                        )} */}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="grid gap-6">
              {activeOrders.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <CardTitle className="text-xl text-gray-600 mb-2">No active orders</CardTitle>
                    <CardDescription>Your room service orders will appear here</CardDescription>
                  </CardContent>
                </Card>
              ) : (
                activeOrders.map((order) => (
                  <Card key={order.id} className="shadow-lg border-0">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                        <Badge className={`${
                          order.status === 'preparing' 
                            ? 'bg-amber-100 text-amber-700' 
                            : order.status === 'delivered'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          <Clock className="h-3 w-3 mr-1" />
                          {order.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between">
                            <span>{item.quantity}x {item.name}</span>
                            <span className="font-semibold">${item.price}</span>
                          </div>
                        ))}
                        <div className="border-t pt-3 flex justify-between font-bold">
                          <span>Total</span>
                          <span>${order.total}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Room: {order.roomNumber}</p>
                          <p>Estimated delivery: {new Date(order.estimatedDelivery).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Room Service Tab */}
          <TabsContent value="services" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockServices[0].items.map((item) => (
                <Card key={item.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow">
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-green-600">${item.price}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-amber-500 fill-current" />
                        <span className="text-sm text-gray-600">4.5</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                      onClick={() => orderFood(item)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Order Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Housekeeping Tab */}
          <TabsContent value="housekeeping" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockServices[1].items.map((service) => (
                <Card key={service.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl w-fit">
                      <Package className="h-8 w-8 text-purple-600" />
                    </div>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <div className="text-2xl font-bold text-green-600">
                      {service.price === 0 ? 'Free' : `$${service.price}`}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      onClick={() => requestService(service.name)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Request Service
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GuestDashboard;