import { prisma, prismaCall } from "../utilities"
import { router as landmarksRouter } from './landmark';
import { router as passageRouter } from './passage';
import express from 'express';
const hri = require('human-readable-ids').hri;

export const router = express.Router();

router.use("/:mapId/landmarks", landmarksRouter)
router.use("/:mapId/passages", passageRouter)

router.get("/", async (req, res) => {
  const maps = await prisma.map.findMany({
    orderBy: { id: "asc" },
  });

  res.json(maps);
});

router.post("/", async (req, res) => {
  const map = await prisma.map.create({
    data: {
      name: req.body.name ?? hri.random(),
    },
  });

  return res.json(map);
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const map = await prisma.map.findUnique({
    where: { id },
  });

  return res.json(map);
});

router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id)
  const map = await prisma.map.update({
    where: { id },
    data: req.body,
  });

  return res.json(map);
})

router.delete("/:id", async (req, res) => {
  prismaCall( async () => {
    const id = parseInt(req.params.id);
    await prisma.map.delete({
      where: { id },
    });
    return res.send({ status: "ok" });
  }, res)
});