import { GoogleGenerativeAI } from "@google/generative-ai";
import * as cheerio from "cheerio";

function extractJobText(html: string) {
  const $ = cheerio.load(html);
  return $("body").text().replace(/\s+/g, " ").trim();
}

export async function getJobListingData(url: string) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "NEXT_PUBLIC_GEMINI_API_KEY is not set in environment variables",
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  try {
    const res = await fetch("/api/fetch-job", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!res.ok) {
      throw new Error(`API request failed: ${res.status}`);
    }

    const data = await res.json();
    if (data.error) {
      throw new Error(data.error);
    }

    const html = data.html;
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

    return {
      title: parts[0] || "",
      company: parts[1] || "",
      location: parts[2] || "",
    };
  } catch (error) {
    console.error("AI extractJobInfoFromURL error:", error);
    return null;
  }
}
