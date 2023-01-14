import { 
  // @ts-ignore
  PrismaClient, 
  // @ts-ignore
  Prisma } from "@prisma/client";
import express from "express";

type PrismaCallback = () => Promise<typeof express.response>
export async function prismaCall(f: PrismaCallback, res: typeof express.response): Promise<any> {
  try {
    await f();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError &&
      (error as Prisma.PrismaClientKnownRequestError).code === "P2025") {
      return res.status(404).send({ status: "not found" });
    } else {
      return res.status(500).send({ status: "error" });
    }
  }
}

export const prisma : PrismaClient = new PrismaClient();
