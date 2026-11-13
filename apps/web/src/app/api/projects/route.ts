import { jsonResponse, projectList } from "@/lib/api";

export function GET() {
  return jsonResponse(projectList());
}
