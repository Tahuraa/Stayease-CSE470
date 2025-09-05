// routes/rooms.js or similar
// import express from 'express';
// import Room from '../models/rooms.js'; // adjust the path as needed

// const router = express.Router();

// // GET /api/rooms/:roomId
// router.get('/:roomId', async (req, res) => {
//   const { roomId } = req.params;

//   try {
//     const room = await Room.findById(roomId);

//     if (!room) {
//       return res.status(404).json({ message: 'Room not found' });
//     }

//     res.status(200).json(room);
//   } catch (error) {
//     console.error('Error fetching room:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// export default router;
