import { NextRequest } from "next/server";
import { verifyToken } from "./auth";
import { UserPayload } from "@/types";

export function getAuthUser(request: NextRequest): UserPayload | null {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }

    const token = authHeader.split(" ")[1];
    return verifyToken(token);
}