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
    querystring: { island: { type: "string", date: "integer" } },
  },
};

export default async function (
  fastify: FastifyInstance,
  _: RouteOptions,
  done: DoneFuncWithErrOrRes
) {
  void fastify.get<{
    Querystring: IQueryString;
  }>("/date", opts, async (req, reply) => {
    const date = parseInt(req.query.date);

    const island = getIslandToDefault(req.query.island);

    if (!island)
      return void (await reply
        .status(400)
        .send({ success: false, message: "Invalid Island provided." }));

    if (!date ?? !new Date(date).getTime())
      return void (await reply
        .status(400)
        .send({ success: false, message: "Provide a valid date." }));

    return void (await reply.status(200).send({
      success: true,
      ...prayer.getPrayerByDate(island, date),
      island,
      atoll: prayer.getAtoll(island.atoll),
    }));
  });

  void done();
}

interface IQueryString {
  island?: string;
  date: string;
}
