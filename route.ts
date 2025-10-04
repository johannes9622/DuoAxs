import twilio from "twilio";

export async function POST(req: Request) {
  const { identity, room } = await req.json();
  const AccessToken = (twilio as any).jwt.AccessToken;
  const VideoGrant = AccessToken.VideoGrant;
  const token = new AccessToken(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_API_KEY_SID!, process.env.TWILIO_API_KEY_SECRET!, { identity });
  token.addGrant(new VideoGrant({ room }));
  return Response.json({ token: token.toJwt() });
}
