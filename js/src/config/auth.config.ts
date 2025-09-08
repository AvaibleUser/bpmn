import { readFileSync as readFile } from "fs";

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
  alg: "RS512" as const,
};
