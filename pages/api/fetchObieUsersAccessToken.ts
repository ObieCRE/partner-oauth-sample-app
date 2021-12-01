import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

type Data = {
  status: string;
  message?: string;
};

/**
 * An endpoint that receives an authorization code from the frontend and exchanges it for an access token.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    res
      .status(405)
      .send({ status: "error", message: "Only POST requests allowed" });
    return;
  }

  const data = await exchangeCodeForAccessToken(req.body.code);

  // Store these in  your DB so you can fetch policy data on behalf of this user.
  const accessToken = data.access_token;
  const obieUserId = data.user_id;

  console.log({ accessToken, obieUserId });

  res.status(200).send({ status: "success" });
}

const exchangeCodeForAccessToken = async (code: string) => {
  const { data } = await axios.post(
    `${process.env.OBIE_API_ENDPOINT}/api/partners/oauth/access_token`,
    {
      code,
      client_id: process.env.OBIE_CLIENT_ID,
      client_secret: process.env.OBIE_CLIENT_SECRET,
    }
  );

  return data;
};
