import { Jwt } from "@/models/util/util.model";
import { password } from "bun";
import { readFileSync as readFile } from "fs";
import { verify as verifyToken } from "hono/jwt";

export const jwtConfig = {
  secret: {
    publicKey: () =>
      readFile("./resources/certs/public-key.pem", {
        encoding: "utf-8",
      }),
    privateKey: () =>
      readFile("./resources/certs/private-key.pem", {
        encoding: "utf-8",
      }),
  },
  alg: "RS256" as const,
};

export async function verify(pass: string, hash: string): Promise<boolean> {
  return await password.verify(pass, hash, "bcrypt");
}

export async function encode(pass: string): Promise<string> {
  return await password.hash(pass, "bcrypt");
}

export async function getPayload(token: string): Promise<Jwt> {
  return (await verifyToken(
    token.split(" ")[1],
    jwtConfig.secret.privateKey(),
    jwtConfig.alg
  )) as Jwt;
}
