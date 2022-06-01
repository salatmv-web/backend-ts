import { prayer } from "#lib/prayer";
import { getIslandToDefault } from "#lib/utils";
import type {
  DoneFuncWithErrOrRes,
  FastifyInstance,
  RouteOptions,
  RouteShorthandOptions,
} from "fastify";

const opts: RouteShorthandOptions = {
  schema: {
    querystring: { island: { type: "string" } },
  },
};

export default async function (
  fastify: FastifyInstance,
  _: RouteOptions,
  done: DoneFuncWithErrOrRes
) {
  void fastify.get<{
    Querystring: IQueryString;
  }>("/today", opts, async (req, reply) => {
    const island = getIslandToDefault(req.query.island);

    if (!island)
      return void (await reply
        .status(400)
        .send({ success: false, message: "Invalid Island provided." }));

    return void (await reply.status(200).send({
      success: true,
      ...prayer.getTodayDetailed(island),
      island,
      atoll: prayer.getAtoll(island.atoll),
    }));
  });

  void done();
}

interface IQueryString {
  island?: string;
}
