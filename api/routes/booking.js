// import express from "express";
// import User from "../models/users.js";
// import Booking from "../models/booking.js";
// import Room from "../models/rooms.js";
// import fetchUser from "../middleware/fetchuser.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// const router = express.Router();
// const JWT_SECRET = "this_is_secret"; // Ensure this is set in your environment variables







// // POST /api/booking
// router.post('/', fetchUser, async (req, res) => {
//   const userId = req.user.userId;
//   const { roomId, checkInDate, checkOutDate } = req.body;

//   // Basic validation
//   if (!roomId || !checkInDate || !checkOutDate) {
//     return res.status(400).json({ message: 'Room ID, check-in, and check-out dates are required.' });
//   }

//   const checkIn = new Date(checkInDate);
//   const checkOut = new Date(checkOutDate);

//   if (checkOut <= checkIn) {
//     return res.status(400).json({ message: 'Check-out must be after check-in.' });
//   }

//   try {
//     // Check if room exists
//     const room = await Room.findById(roomId);
//     if (!room) return res.status(404).json({ message: 'Room not found.' });

//     // Check for conflicting bookings
//     // const conflict = await Booking.findOne({
//     //   roomId: roomId,
//     //   checkInDate: { $lt: checkOut },
//     //   checkOutDate: { $gt: checkIn }
//     // });

//     // if (conflict) {
//     //   return res.status(409).json({ message: 'Room is not available for the selected dates.' });
//     // }

//     // Calculate total price
//     const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
//     const totalPrice = nights * room.pricePerNight;

//     // Create booking
//     const booking = new Booking({
//       userId,
//       roomId,
//       checkInDate: checkIn,
//       checkOutDate: checkOut,
//       totalPrice,
//     });

//     await booking.save();

//     res.status(201).json({
//       message: 'Room booked successfully.',
//       booking,
//     });
//   } catch (err) {
//     console.error('Booking error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// export default router;

