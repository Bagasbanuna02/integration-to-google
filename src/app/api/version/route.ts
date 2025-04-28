/* eslint-disable @typescript-eslint/no-unused-vars */
import versionInfo from "../../../../package.json";

export async function GET(req: Request) {
  return Response.json(versionInfo.version);
}
