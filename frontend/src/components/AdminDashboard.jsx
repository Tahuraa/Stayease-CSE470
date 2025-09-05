// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  LogOut,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Building,
  UserCheck,
  Star,
} from "lucide-react";
import axios from "axios";
import { useToast } from "../hooks/use-toast";
import { useAuth } from "../context/AuthContext";
import UserDrawer from "./UserDrawer";

const AdminDashboard = () => {
  const { user, setUser , logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [revenue, setRevenue] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [bookingsRes, usersRes, revenueRes] = await Promise.all([
        axios.get("http://localhost:3000/api/admin/bookings"),
        axios.get("http://localhost:3000/api/admin/users"),
        axios.get("http://localhost:3000/api/admin/revenue"),
      ]);

      setBookings(bookingsRes.data);
      setUsers(usersRes.data);
      setRevenue(revenueRes.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "staff":
        return "bg-blue-100 text-blue-800";
      case "guest":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  // ✅ Handle Save User
  const handleSave = async (updatedUser) => {
    try {
      await axios.patch(`http://localhost:3000/api/admin/users/${updatedUser._id}/role`, {
        salary: updatedUser.salary,
        department: updatedUser.department,
        departmentRole: updatedUser.departmentRole,
        floorNumber: updatedUser.floorNumber,
      });

      toast({ title: "Success", description: "User updated successfully" });
      setDrawerOpen(false);
      loadDashboardData();
    } catch (error) {
      toast({ title: "Error", description: error.response?.data?.message || "Update failed", variant: "destructive" });
    }
  };

  // ✅ Handle Delete User
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/admin/users/${selectedUser._id}`);
      toast({ title: "Deleted", description: "User deleted successfully" });
      setDrawerOpen(false);
      loadDashboardData();
    } catch (error) {
      toast({ title: "Error", description: error.response?.data?.message || "Delete failed", variant: "destructive" });
    }
  };

  const totalRevenue = revenue.total || 0;
  const monthlyRevenue = revenue.monthly || 0;
  const occupancyRate = revenue.occupancyRate || 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-amber-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.name}!</p>
            </div>
            <Button onClick={logout} variant="outline" className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${totalRevenue.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                ${monthlyRevenue.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{occupancyRate}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{users.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="bookings">All Bookings</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Revenue Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">This Month</span>
                      <span className="font-semibold text-green-600">
                        ${monthlyRevenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Average per Booking</span>
                      <span className="font-semibold text-blue-600">
                        ${bookings.length ? Math.round(totalRevenue / bookings.length) : 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Occupancy Rate</span>
                      <span className="font-semibold text-amber-600">{occupancyRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Keeping mock values */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Customer Satisfaction</span>
                      <Badge className="bg-green-100 text-green-800">4.8/5.0</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Booking Conversion</span>
                      <Badge className="bg-blue-100 text-blue-800">85.2%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Repeat Customers</span>
                      <Badge className="bg-purple-100 text-purple-800">42.1%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  All Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="flex items-center justify-between p-4 border rounded-lg bg-white/50"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium text-gray-900">{booking.userId.name}</h3>
                          <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Room {booking.roomNumber} • {booking.roomTypeId.roomTypeName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(booking.checkInDate).toLocaleDateString()} -{" "}
                          {new Date(booking.checkOutDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">${booking.totalPrice}</p>
                        {/* <p className="text-sm text-gray-500">{booking.nights} nights</p> */}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((userData) => (
                    <div
                      key={userData._id}
                      className="flex items-center justify-between p-4 border rounded-lg bg-white/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {userData.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{userData.name}</h3>
                          <p className="text-sm text-gray-600">{userData.email}</p>
                          <p className="text-sm text-gray-500">
                            Joined: {new Date(userData.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getRoleColor(userData.accountType)}>{userData.accountType}</Badge>
                        <button
    onClick={() => {
      setSelectedUser(userData);
      setDrawerOpen(true);
    }}
    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
  >
    Edit
  </button>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <UserCheck className="h-4 w-4" />
                          Active
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>


      <UserDrawer
  open={drawerOpen}
  onClose={() => setDrawerOpen(false)}
  user={selectedUser}
  onSave={handleSave}
  onDelete={handleDelete}
/>

    </div>

        // user drawer 
        

    
  );
};

export default AdminDashboard;
