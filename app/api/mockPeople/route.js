import { NextResponse } from "next/server";
import mockPeople from "../../../app/person_search_mock.json";

export async function GET(request) {
  const response = NextResponse.json(mockPeople);
  return response;
}
