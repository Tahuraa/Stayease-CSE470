import Booking from "../models/booking.js";
import User from "../models/users.js";

// ✅ Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("userId", "name email").populate("roomTypeId","roomTypeName");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

// ✅ Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// ✅ Get revenue stats
export const getRevenueStats = async (req, res) => {
  try {
    const bookings = await Booking.find({ status: "confirmed" });

    const total = bookings.reduce((sum, b) => sum + b.totalPrice, 0);

    const currentMonth = new Date().getMonth();
    const monthly = bookings
      .filter(b => new Date(b.checkInDate).getMonth() === currentMonth)
      .reduce((sum, b) => sum + b.totalPrice, 0);

    const occupancyRate = Math.round((bookings.length / 48) * 100); // assuming 48 rooms

    res.json({ total, monthly, occupancyRate });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch revenue stats" });
  }
};





// ✅ Assign or update staff role
export const updateStaffRole = async (req, res) => {
  try {
    const { userId } = req.params; // staff user to update
    const { accountType, department, departmentRole, floorNumber , salary } = req.body;

    // Validate required fields
    if (!accountType) {
      return res.status(400).json({
        success: false,
        message: "accountType is required",
      });
    }

    // Fetch the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Only staff/admin can have this endpoint
    if (!["staff", "admin"].includes(accountType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid accountType. Must be 'staff' or 'admin'",
      });
    }

    // Update fields
    user.accountType = accountType;

    if (accountType === "staff") {
      user.department = department || user.department;
      user.departmentRole = departmentRole || user.departmentRole;
      user.salary = salary || user.salary;

      // Only housekeeping staff needs floorNumber
      if (department === "housekeeping" && floorNumber !== undefined) {
        user.floorNumber = floorNumber;
      } else {
        user.floorNumber = undefined;
      }
    } else {
      // Admins don’t need staff-specific fields
      user.department = undefined;
      user.departmentRole = undefined;
      user.floorNumber = undefined;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        accountType: user.accountType,
        department: user.department,
        departmentRole: user.departmentRole,
        floorNumber: user.floorNumber,
        salary: user.salary,
      },
    });
  } catch (err) {
    console.error("Error updating user role:", err);
    res.status(500).json({ message: "Server error" });
  }
};








// DELETE /api/admin/users/:userId
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: `User ${user.name} has been deleted successfully`,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};
