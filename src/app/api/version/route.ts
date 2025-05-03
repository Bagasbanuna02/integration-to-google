/* eslint-disable @typescript-eslint/no-unused-vars */
import versionInfo from "../../../../package.json";

export async function GET(req: Request) {
  const v = versionInfo.version
  return Response.json(versionInfo.version);
}
