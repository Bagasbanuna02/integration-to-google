import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL!;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n");
const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID!;

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;
  const rowIndex = formData.get("rowIndex") as string;
  const file = formData.get("file") as File | null;
  const oldFileId = formData.get("oldFileId") as string;

  if (!rowIndex || !name || !email || !message) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  try {
    const auth = new google.auth.JWT(CLIENT_EMAIL, undefined, PRIVATE_KEY, [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive",
    ]);

    const sheets = google.sheets({ version: "v4", auth });
    const drive = google.drive({ version: "v3", auth });

    let newFileId = "";

    if (file && file.name) {
      const buffer = Buffer.from(await file.arrayBuffer());

      // Hapus file lama jika ada
      if (oldFileId) {
        try {
          console.log("Menghapus file lama dengan ID:", oldFileId);
          await drive.files.delete({ fileId: oldFileId });
        } catch (deleteErr) {
          console.error("Gagal menghapus file lama:", deleteErr);
        }
      }

      const uploadRes = await drive.files.create({
        requestBody: {
          name: file.name,
          parents: [DRIVE_FOLDER_ID],
        },
        media: {
          mimeType: file.type,
          body: Readable.from(buffer),
        },
        fields: "id",
      });

      newFileId = uploadRes.data.id!;

      // Update data di Google Sheets
      const range = `Sheet1!A${rowIndex}:D${rowIndex}`;
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[name, email, message, newFileId]],
        },
      });
    }

    // Update data di Google Sheets
    const range = `Sheet1!A${rowIndex}:C${rowIndex}`;
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[name, email, message]],
      },
    });

    return NextResponse.json({ message: "Data updated successfully!" });
  } catch (error) {
    console.error("Edit error:", error);
    return NextResponse.json(
      { message: "Failed to update", error },
      { status: 500 }
    );
  }
}
