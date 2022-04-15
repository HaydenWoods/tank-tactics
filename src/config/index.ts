import { Config } from "@/types/config";

import { config as dev } from "./dev";

const configs: Record<string, Config> = {
  dev,
}

export const config = configs[process.env.NODE_ENV || "dev"];
