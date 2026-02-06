import type { z } from "zod"

import type { healthCheckOutputSchema } from "../schemas/health-check"

export type HealthCheckOutput = z.infer<typeof healthCheckOutputSchema>
