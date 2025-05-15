// Store configuration in a self-explanatory, strongly typed and hierarchical store
import dotenv from "dotenv";
import path from "path";
import { z } from "zod";

if (
  process.env["NODE_ENV"] === "development" ||
  process.env["NODE_ENV"] === "production"
) {
  dotenv.config({ path: path.join(__dirname, "../../.env") });
}

const envSchema = z.object({
  NODE_ENV: z.union([
    z.literal("production"),
    z.literal("development"),
    z.literal("test"),
  ]),
  PORT: z
    .string()
    .default("8080")
    .transform((str) => parseInt(str, 10)),
  DATABASE_URL: z.string().describe("Database connection URL"),
});

const envVars = envSchema.parse(process.env);

const config = {
  NODE_ENV: envVars.NODE_ENV,
  PORT: envVars.PORT,
  DATABASE_URL: envVars.DATABASE_URL,
};

export default config;
