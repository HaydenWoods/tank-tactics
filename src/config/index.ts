import { Config } from "@/types/config";

import { config as dev } from "./dev";
// import { config as prd } from "./prd";

const configs: Record<string, Config> = {
  dev,
  // prd,
}

export const config = configs[process.env.NODE_ENV || "dev"];
