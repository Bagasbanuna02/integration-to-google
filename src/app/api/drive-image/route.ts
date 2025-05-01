// app/api/drive-image/route.ts
import { google } from "googleapis";
import { NextResponse } from "next/server";

const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL!;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY!.replace(
  /\\n/g,
  "\n"
);

const auth = new google.auth.JWT(
  GOOGLE_CLIENT_EMAIL,
  undefined,
  GOOGLE_PRIVATE_KEY,
  ["https://www.googleapis.com/auth/drive.readonly"]
);

const drive = google.drive({ version: "v3", auth });

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fileId = searchParams.get("fileId");

  if (!fileId) {
    return NextResponse.json({ error: "Missing fileId" }, { status: 400 });
  }

  try {
    const driveRes = await drive.files.get(
      { fileId, alt: "media" },
      { responseType: "stream" }
    );

    const contentType = driveRes.headers["content-type"] || "image/jpeg";
    const stream = driveRes.data;

    // Convert stream to Buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    return new Response(buffer, {
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    console.error("Drive image fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 }
    );
  }
}
