import { google } from "googleapis";
import { NextResponse } from "next/server";

const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL!;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY!.replace(
  /\\n/g,
  "\n"
);

export async function GET() {
  try {
    const auth = new google.auth.JWT(
      GOOGLE_CLIENT_EMAIL,
      undefined,
      GOOGLE_PRIVATE_KEY,
      ["https://www.googleapis.com/auth/spreadsheets.readonly"]
    );

    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEET_ID,
      range: "Sheet1!A2:D",
    });

    // console.log("data sheet >>", response.data.values);

    const rows = response.data.values || [];

    // Map ke format frontend
    const data = rows.map((row, idx) => ({
      name: row[0],
      email: row[1],
      message: row[2],
      fileId: row[3],
      imageUrl: row[3]
        ? `https://drive.google.com/uc?export=view&id=${row[3]}`
        : null,
      rowIndex: idx + 2, // +2 karena dimulai dari baris 2 di sheet
    }));


    const fixData = data.reverse();

    return NextResponse.json(fixData);
  } catch (err) {
    console.error("Fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
