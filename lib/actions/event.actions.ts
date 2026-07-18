"use server";

import { Event } from "@/database";
import connectDB from "../mongodb";

export async function getSimilarEventBySlug(slug: string) {
  try {
    // Fetch similar events based on the slug

    await connectDB();

    const event = await Event.findOne({ slug });

    return await Event.find({
      _id: { $ne: event._id },
      tags: { $in: event.tags },
    }).lean();
  } catch {
    return [];
  }
}
