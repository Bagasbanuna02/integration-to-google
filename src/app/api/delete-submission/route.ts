import { google } from "googleapis";
import { NextResponse } from "next/server";

const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL!;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY!.replace(
  /\\n/g,
  "\n"
);

export async function POST(req: Request) {
  try {
    const { rowIndex, fileId } = await req.json();
    const auth = new google.auth.JWT(
      GOOGLE_CLIENT_EMAIL,
      undefined,
      GOOGLE_PRIVATE_KEY,
      [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive",
      ]
    );

    console.log("fileID", fileId);

    const sheets = google.sheets({ version: "v4", auth });
    const drive = google.drive({ version: "v3", auth });

    // 1. Menghapus gambar di Google Drive
    if (fileId) {
      await drive.files.delete({
        fileId: fileId, // fileId gambar yang akan dihapus
      });
    }

    // 2. Menyusun permintaan untuk menghapus baris di Google Sheets
    const request = {
      spreadsheetId: GOOGLE_SHEET_ID,
      resource: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0, // ID sheet yang sesuai (biasanya 0 untuk sheet pertama)
                dimension: "ROWS",
                startIndex: rowIndex - 1, // baris di Google Sheets dimulai dari 0
                endIndex: rowIndex,
              },
            },
          },
        ],
      },
    };

    // 3. Mengirimkan permintaan batchUpdate untuk menghapus baris
    await sheets.spreadsheets.batchUpdate(request);

    return NextResponse.json({ message: "Data dan gambar berhasil dihapus" });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      { error: "Gagal menghapus data dan gambar" },
      { status: 500 }
    );
  }
}
