import { prisma, prismaCall } from "../utilities"
import express from 'express';
const { param } = require('express-validator')
const hri = require('human-readable-ids').hri;

export const router = express.Router({mergeParams: true});

router.get("/", async (req, res) => {
  const { mapId } = req.params as any
  const passages = await prisma.passage.findMany({
    where: { mapId: parseInt(mapId) },
    orderBy: { id: "asc" },
  });

  res.json(passages);
});

router.post("/", [ param('mapId').isInt().toInt() ],
  async (req: express.Request, res: express.Response) => {
  const { mapId } = req.params as any;
  const passage = await prisma.passage.create({
    data: {
      mapId: mapId,
      name: req.body.name ?? hri.random(),
      sourceId: parseInt(req.body.sourceId),
      targetId: parseInt(req.body.targetId)
    },
  });

  return res.json(passage);
});

router.get("/:id", [param('id').isInt().toInt()],
  async (req: express.Request, res: express.Response) => {
    const passage = await prisma.passage.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    return res.json(passage);
  });

router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id)
  const passage = await prisma.passage.update({
    where: { id },
    data: req.body,
  });

  return res.json(passage);
})

router.delete("/:id", async (req, res) => {
  prismaCall( async () => {
    const id = parseInt(req.params.id);
    await prisma.passage.delete({
      where: { id },
    });
    return res.send({ status: "ok" });
  }, res)
});
