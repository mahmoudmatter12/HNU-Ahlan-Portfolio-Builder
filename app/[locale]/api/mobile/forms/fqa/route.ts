// display the collages with its fqa forms only for the version 1.0.0

import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  //  get all the collages with its only name slug
  // select the forms
  // where the fqa           where: {
  // fields: {
  //     some: {
  //       validation: {
  //         path: ["FAQ"],
  //         equals: true,
  //       },
  //     },
  //   },
  // },
  const collages = await db.college.findMany({
    select: {
      name: true,
      slug: true,
      logoUrl: true,
      forms: {
        include: {
          fields: true,
        },
        where: {
          fields: {
            some: {
              validation: {
                path: ["FAQ"],
                equals: true,
              },
            },
          },
        },
      },
    },
  });
  return NextResponse.json(collages);
}
