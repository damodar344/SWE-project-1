import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import jwt from "jsonwebtoken";

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("Please provide NEXTAUTH_SECRET environment variable");
}

const JWT_SECRET = process.env.NEXTAUTH_SECRET;

export function generateToken(payload: any, expiresIn: string) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function getSession() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return null;
    }

    return {
      userId: session.user.id,
      email: session.user.email,
      name: session.user.name,
      emailVerified: session.user.emailVerified,
    };
  } catch (error) {
    console.error("Session error:", error);
    return null;
  }
}
