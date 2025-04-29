import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";

const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL!;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY!.replace(
  /\\n/g,
  "\n"
);
const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID!;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;
    const file = formData.get("photo") as File | null;

    if (!name || !email || !message) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const auth = new google.auth.JWT(
      GOOGLE_CLIENT_EMAIL,
      undefined,
      GOOGLE_PRIVATE_KEY,
      [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive.file",
      ]
    );

    const sheets = google.sheets({ version: "v4", auth });
    const drive = google.drive({ version: "v3", auth });

    let fileId = "";

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const uploadRes = await drive.files.create({
        requestBody: {
          name: file.name,
          parents: [GOOGLE_DRIVE_FOLDER_ID],
        },
        media: {
          mimeType: file.type,
          body: Readable.from(buffer),
        },
        fields: "id",
      });

      fileId = uploadRes.data.id || "";

      // Set permission hanya jika fileId tersedia
      if (fileId) {
        await drive.permissions.create({
          fileId,
          requestBody: {
            role: "reader",
            type: "anyone",
          },
        });
      }
    }

    const sheetId = GOOGLE_SHEET_ID;
    const sheetName = "Sheet1";

    const existing = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${sheetName}!A1:D1`,
    });

    if (!existing.data.values || existing.data.values.length === 0) {
      await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: `${sheetName}!A1:D1`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [["Nama", "Email", "Message", "PhotoFileId"]],
        },
      });
    }

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `${sheetName}!A:D`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[name, email, message, fileId]],
      },
    });

    return NextResponse.json(
      { message: "Data saved successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Google Sheets Error:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}
