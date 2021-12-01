import fs from "fs";

import type { NextApiRequest, NextApiResponse } from "next";

/**
 * A lightweight webhook endpoint for receiving events from the Obie API.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).send({ status: "error" });
    return;
  }

  res.status(200).send({ status: "success" });

  if (req.body?.type !== "policy_created") return;

  fs.writeFileSync("./policies.json", JSON.stringify([req.body.policy]));
}
