import { google } from "googleapis";
import { NextResponse } from "next/server";

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL!;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n");

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const rowIndex = (await params).id;

  console.log("rowIndex", rowIndex);

  try {
    const auth = new google.auth.JWT(CLIENT_EMAIL, undefined, PRIVATE_KEY, [
      "https://www.googleapis.com/auth/spreadsheets.readonly",
    ]);

    const sheets = google.sheets({ version: "v4", auth });

    const range = `Sheet1!A${rowIndex}:D${rowIndex}`;
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range,
    });

    const row = res.data.values?.[0];

    if (!row) {
      return NextResponse.json({ message: "Data not found" }, { status: 404 });
    }

    const [name, email, message, fileId] = row;

    return NextResponse.json({
      name,
      email,
      message,
      fileId,
      rowIndex,
    });
  } catch (err) {
    console.error("GET ONE error:", err);
    return NextResponse.json(
      { message: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
