import { z } from "zod";

export const HealthCheckResponse = z.object({
  status: z.enum(["ok", "error"]),
  message: z.string().optional(),
});

export type HealthCheckResponseType = z.infer<typeof HealthCheckResponse>;
