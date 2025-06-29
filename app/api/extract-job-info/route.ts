import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

function extractJobText(html: string) {
  const $ = cheerio.load(html);
  return $("body").text().replace(/\s+/g, " ").trim();
}

export async function POST(request: NextRequest) {
  try {
    const { html } = await request.json();

    if (!html) {
      return NextResponse.json(
        { error: "HTML content is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const visibleText = extractJobText(html);

    const prompt = `
You are an AI assistant that extracts job posting info.
Languages that the job postings are in can vary so be aware of that.
Typically, location is a city or can be a country but remote. In that case, it should be mentioned as "Country (Remote)".
From the following text, extract:

- Job title
- Company name
- Location

Return the result as a pure string text with the data separated by comas in the following format:
Job title, Company name, Location

Job posting text:
"""
${visibleText.slice(0, 10000)}
"""`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const parts = text.split(",").map((part) => part.trim());

    return NextResponse.json({
      title: parts[0] || "",
      company: parts[1] || "",
      location: parts[2] || "",
    });
  } catch (error) {
    console.error("AI extract job info error:", error);
    return NextResponse.json(
      { error: "Failed to extract job information" },
      { status: 500 }
    );
  }
}
