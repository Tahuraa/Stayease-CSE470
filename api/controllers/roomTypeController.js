import RoomType from "../models/roomtype.js";
import { io } from "../index.js";
// Create a new RoomType
export const createRoomType = async (req, res) => {
  try {
    const { roomTypeName, description, sizeSqm, bedType, view, features, amenities, maxOccupancy, pricePerNight, totalRooms, images, rating } = req.body;

    // Check if a room type with same name already exists
    const existing = await RoomType.findOne({ roomTypeName });
    if (existing) {
      return res.status(400).json({ message: "Room type with this name already exists" });
    }

    const newRoomType = new RoomType({
      roomTypeName,
      description,
      sizeSqm,
      bedType,
      view,
      features,
      amenities,
      maxOccupancy,
      pricePerNight,
      totalRooms,
      images,
      rating
    });

    await newRoomType.save();
    io.emit("roomTypeCreated", newRoomType);
    res.status(201).json({ message: "Room type created successfully", roomType: newRoomType });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Optional: fetch all room types
export const getAllRoomTypes = async (req, res) => {
  try {
    const roomTypes = await RoomType.find();
    res.status(200).json(roomTypes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
