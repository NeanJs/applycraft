import { GenerationType } from "@prisma/client";
import { prisma } from "./prisma";
import { Prisma } from "../generated/prisma/client";

type SaveGenerationInput = {
  userId: string;
  resumeId?: string;

  type: GenerationType;

  title?: string;
  input?: Prisma.InputJsonValue;
  result: Prisma.InputJsonValue;
};

export async function saveGeneration({
  userId,
  resumeId,
  type,
  title,
  input,
  result,
}: SaveGenerationInput) {
  return await prisma.generation.create({
    data: {
      userId,
      resumeId,
      type,
      title,
      input,
      result,
    },
  });
}
