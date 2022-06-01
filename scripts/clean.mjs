import { rm } from "node:fs/promises";

const options = { recursive: true, force: true };

await rm(new URL("../build", import.meta.url), options);
