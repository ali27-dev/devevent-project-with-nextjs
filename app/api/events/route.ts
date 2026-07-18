import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import type { UploadApiResponse } from "cloudinary";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";

const requiredEventFields = [
  "title",
  "description",
  "overview",
  "venue",
  "location",
  "date",
  "time",
  "mode",
  "audience",
  "organizer",
] as const;

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();
    const event = Object.fromEntries(formData.entries());
    const file = formData.get("image");

    if (!(file instanceof File) || file.size === 0)
      return NextResponse.json(
        { message: "A non-empty image file is required" },
        { status: 400 }
      );

    const rawTags = formData.get("tags");
    const rawAgenda = formData.get("agenda");

    if (typeof rawTags !== "string" || typeof rawAgenda !== "string") {
      return NextResponse.json(
        { message: "Tags and agenda are required" },
        { status: 400 }
      );
    }

    let tags: string[];
    let agenda: string[];

    try {
      tags = JSON.parse(rawTags);
      agenda = JSON.parse(rawAgenda);
    } catch {
      return NextResponse.json(
        { message: "Tags and agenda must be valid JSON arrays" },
        { status: 400 }
      );
    }

    if (!Array.isArray(tags) || !Array.isArray(agenda)) {
      return NextResponse.json(
        { message: "Tags and agenda must be arrays" },
        { status: 400 }
      );
    }

    const missingFields = requiredEventFields.filter((field) => {
      const value = event[field];
      return typeof value !== "string" || value.trim().length === 0;
    });

    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: "Required event fields are missing", fields: missingFields },
        { status: 400 }
      );
    }

    const mode = (event.mode as string).trim().toLowerCase();
    if (!["online", "offline", "hybrid"].includes(mode)) {
      return NextResponse.json(
        { message: "Mode must be online, offline, or hybrid" },
        { status: 400 }
      );
    }

    if (
      tags.length === 0 ||
      agenda.length === 0 ||
      !tags.every((tag) => typeof tag === "string" && tag.trim()) ||
      !agenda.every((item) => typeof item === "string" && item.trim())
    ) {
      return NextResponse.json(
        { message: "Tags and agenda must contain non-empty text values" },
        { status: 400 }
      );
    }

    event.mode = mode;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise<UploadApiResponse>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { resource_type: "image", folder: "DevEvent" },
            (error, result) => {
              if (error) {
                reject(error);
                return;
              }

              if (!result?.secure_url) {
                reject(new Error("Cloudinary did not return an image URL"));
                return;
              }

              resolve(result);
            }
          )
          .end(buffer);
      }
    );

    event.image = uploadResult.secure_url;

    const createdEvent = await Event.create({
      ...event,
      tags,
      agenda,
    });

    return NextResponse.json(
      { message: "Event created successfully", event: createdEvent },
      { status: 201 }
    );
  } catch (error) {
    const cloudinaryError = error as {
      message?: string;
      name?: string;
      http_code?: number;
    };

    console.error("Event creation failed", {
      message: cloudinaryError.message,
      name: cloudinaryError.name,
      httpCode: cloudinaryError.http_code,
    });

    return NextResponse.json(
      {
        message: "Event creation failed",
      },
      { status: cloudinaryError.http_code ? 502 : 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const events = await Event.find().sort({ createdAt: -1 });

    return NextResponse.json(
      { message: "Events fetched successfully", events },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Event fetching failed", error: e },
      { status: 500 }
    );
  }
}
