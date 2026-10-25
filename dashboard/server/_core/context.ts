import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { ENV } from "./env";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

// When no OAuth server is configured (running outside Manus), every visitor is
// treated as this signed-in local owner so the terminal is fully usable in
// standalone/dev deployments. Configure OAUTH_SERVER_URL to restore real auth.
const localDevUser = (): User => ({
  id: 1,
  openId: "local-dev-user",
  name: "Local User",
  email: null,
  loginMethod: "local",
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
});

let warnedLocalAuth = false;

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  if (!user && !ENV.oAuthServerUrl) {
    if (!warnedLocalAuth) {
      warnedLocalAuth = true;
      console.warn(
        "[Auth] OAUTH_SERVER_URL not configured — running in open local mode (all visitors are signed in as a local admin user)."
      );
    }
    user = localDevUser();
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
