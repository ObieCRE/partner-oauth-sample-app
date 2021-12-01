import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";

/**
 * An endpoint that returns any policies that are stored in the `policies` "DB".
 * This endpoint is just an example endpoint for demonstration purposes
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const policies = fs.readFileSync("./policies.json", "utf-8");

  try {
    res.send(JSON.parse(policies));
  } catch (e) {
    res.send([]);
  }
}
