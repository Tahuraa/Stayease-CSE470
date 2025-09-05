// import express from 'express';
// import Room from '../models/rooms.js';
// import Booking from '../models/booking.js';

// const router = express.Router();

// // // POST /api/availability
// // router.post('/', async (req, res) => {
// //   try {
// //     const { checkInDate, checkOutDate } = req.body;

// //     if (!checkInDate || !checkOutDate) {
// //       return res.status(400).json({ message: 'Please provide check-in and check-out dates.' });
// //     }

// //     const checkIn = new Date(checkInDate);
// //     const checkOut = new Date(checkOutDate);

// //     if (checkOut <= checkIn) {
// //       return res.status(400).json({ message: 'Check-out must be after check-in.' });
// //     }

// //     // Find room IDs that have conflicting bookings
// //     const conflictingBookings = await Booking.find({
// //       $or: [
// //         {
// //           checkInDate: { $lt: checkOut },
// //           checkOutDate: { $gt: checkIn }
// //         }
// //       ]
// //     }).select('roomId');

// //     const bookedRoomIds = conflictingBookings.map(b => b.roomId.toString());

// //     // Find rooms that are not in the list of booked rooms
// //     const availableRooms = await Room.find({
// //       _id: { $nin: bookedRoomIds }
// //     });

// //     res.status(200).json({ availableRooms });
// //   } catch (err) {
// //     console.error('Availability check error:', err);
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // });




// router.post('/', async (req, res) => {
//   const { checkInDate, checkOutDate } = req.body;

//   // Validate inputs before doing anything async
//   if (!checkInDate || !checkOutDate) {
//     return res.status(400).json({ message: 'Check-in and check-out dates are required.' });
//   }

//   const checkIn = new Date(checkInDate);
//   const checkOut = new Date(checkOutDate);

//   if (isNaN(checkIn) || isNaN(checkOut)) {
//     return res.status(400).json({ message: 'Invalid date format.' });
//   }

//   if (checkOut <= checkIn) {
//     return res.status(400).json({ message: 'Check-out must be after check-in.' });
//   }

//   try {
//     // Find bookings that conflict with the given date range
//     const conflictingBookings = await Booking.find({
//       $or: [
//         {
//           checkInDate: { $lt: checkOut },
//           checkOutDate: { $gt: checkIn }
//         }
//       ]
//     }).select('roomId');

//     const bookedRoomIds = conflictingBookings.map(b => b.roomId.toString());

//     // Get rooms not in the booked list
//     const availableRooms = await Room.find({
//       _id: { $nin: bookedRoomIds }
//     });

//     res.status(200).json({ availableRooms });
//   } catch (err) {
//     console.error('Error checking availability:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });
// export default router;