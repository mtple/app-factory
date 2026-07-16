import { palettePotionManifest } from "../../../lib/manifest";

export const dynamic = "force-static";

export function GET() {
  return Response.json(palettePotionManifest);
}
