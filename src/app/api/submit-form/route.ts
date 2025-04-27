import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL!;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY!.replace(
  /\\n/g,
  "\n"
);

// console.log("GPrivate", GOOGLE_PRIVATE_KEY);
// console.log("GID", GOOGLE_SHEET_ID);
// console.log("GCEmail", GOOGLE_CLIENT_EMAIL);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  try {
    const auth = new google.auth.JWT(
      GOOGLE_CLIENT_EMAIL,
      undefined,
      GOOGLE_PRIVATE_KEY,
      ["https://www.googleapis.com/auth/spreadsheets"]
    );

    const sheets = google.sheets({ version: "v4", auth });

    const sheetId = GOOGLE_SHEET_ID
    const sheetName = "Sheet1";

    // Cek apakah ada header
    const existing = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${sheetName}!A1:C1`,
    });

    if (!existing.data.values || existing.data.values.length === 0) {
      // Kalau belum ada, buat header
      await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: `${sheetName}!A1:C1`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [["Nama", "Email", "Message"]],
        },
      });
    }

    // Setelah itu append data user
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `${sheetName}!A:C`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[name, email, message]],
      },
    });

    return NextResponse.json(
      { message: "Data saved to Google Sheets!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Google Sheets Error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error },
      { status: 500 }
    );
  }
}
