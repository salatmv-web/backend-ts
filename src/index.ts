import { prayer } from "#lib/prayer";
import fastify from "fastify";
import fastifyAutoload from "fastify-autoload";
import fastifyCors from "fastify-cors";
import { join } from "path";
import "./lib/csv";

const app = fastify({ logger: true });

void app.register(fastifyAutoload, {
  dir: join(__dirname, "routes", "v1"),
  options: { prefix: "/v1" },
});

void app.register(fastifyCors, {
  origin: "*",
  credentials: true,
});

void app.listen(3200, async (err) => {
  if (err) console.error(err);

  void (await prayer.init());
});
