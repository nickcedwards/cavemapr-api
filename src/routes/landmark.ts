import { prisma, prismaCall } from "../utilities"
import express from 'express';
const hri = require('human-readable-ids').hri;

export const router = express.Router({mergeParams: true});

router.get("/", async (req, res) => {
  const { mapId } = req.params as any
  const landmarks = await prisma.landmark.findMany({
    where: { mapId: parseInt(mapId) },
    orderBy: { id: "asc" },
  });

  res.json(landmarks);
});

router.post("/", async (req, res) => {
  const { mapId } = req.params as any;
  const landmark = await prisma.landmark.create({
    data: {
      mapId: parseInt(mapId),
      name: req.body.name ?? hri.random(),
    },
  });

  return res.json(landmark);
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const landmark = await prisma.landmark.findUnique({
    where: { id },
  });

  return res.json(landmark);
});

router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id)
  const landmark = await prisma.landmark.update({
    where: { id },
    data: req.body,
  });

  return res.json(landmark);
})

router.delete("/:id", async (req, res) => {
  prismaCall( async () => {
    const id = parseInt(req.params.id);
    await prisma.landmark.delete({
      where: { id },
    });
    return res.send({ status: "ok" });
  }, res)
});
