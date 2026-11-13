import { jsonResponse, jsonResume } from "@/lib/api";

/** Résumé in the JSON Resume schema. */
export function GET() {
  return jsonResponse(jsonResume());
}
