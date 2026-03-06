import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { copyFromInfoSchema, copyFromUrlSchema } from "@/lib/validators";

// OpenAI REST API constants
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_MODEL = "gpt-3.5-turbo"; // can be parameterized later

// Helper: fetch and extract main text from a URL
async function extractWebsiteText(url: string): Promise<string> {
  const res = await fetch(url, { method: "GET", redirect: "follow", headers: { "User-Agent": "CopyLiftBot/1.0" } });
  if (!res.ok) throw new Error("Failed to fetch website content.");
  const html = await res.text();

  // Naive parse: strip tags, grab <title> and main <body>
  const doc = new DOMParser().parseFromString(html, "text/html");
  let parts: string[] = [];
  if (doc.title) parts.push(doc.title);
  const body = doc.body ? doc.body.innerText : "";
  if (body) parts.push(body);

  // Sanitized, simple merge
  const content = parts.join("\n").replace(/\s{2,}/g, " ").substring(0, 3500); // truncate, avoid prompt overflow
  return content;
}

async function generateCopyFromOpenAI(prompt: string, apiKey: string) {
  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert SaaS landing-page copywriter. For each task, return a JSON object with keys: headline (string), subheadline (string), features (array of strings), cta (string). Write clear, enthusiastic, concise marketing copy.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 512,
      n: 1,
      stop: null,
    }),
  });

  if (!response.ok) throw new Error("Failed to generate copy from the LLM.");

  const data = await response.json();

  // Post-processing: Try to extract the structured result from the LLM content
  let text: string = "";
  try {
    // LLM output is typically in data.choices[0].message.content
    text = data.choices?.[0]?.message?.content ?? "";
    // Attempt to parse a JSON object from the text
    // Support if model prepends markdown or text before JSON
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1) throw new Error("Malformed LLM reply.");

    const jsonText = text.substring(jsonStart, jsonEnd + 1);
    const parsed = JSON.parse(jsonText);

    // Must have all four keys for success
    if (
      typeof parsed.headline === "string" &&
      typeof parsed.subheadline === "string" &&
      Array.isArray(parsed.features) &&
      typeof parsed.cta === "string"
    ) {
      return {
        headline: parsed.headline.trim(),
        subheadline: parsed.subheadline.trim(),
        features: parsed.features.map((f: string) => f.trim()).filter(Boolean),
        cta: parsed.cta.trim(),
      };
    }
    throw new Error("Missing keys in LLM output.");
  } catch (e) {
    throw new Error("Invalid response from copy generator. " + (e as Error).message);
  }
}

export async function POST(req: NextRequest) {
  // Verify server-side OpenAI API key
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: "Missing OPENAI_API_KEY environment variable." },
      { status: 500 }
    );
  }

  // Parse JSON body
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  // Info-flow or URL-flow
  if (body.type === "info") {
    // Validate product name and desc
    const parse = copyFromInfoSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json(
        { success: false, error: parse.error.errors[0]?.message || "Invalid input." },
        { status: 400 }
      );
    }
    const { productName, productDesc } = parse.data;

    // Prompt engineering
    const prompt = `Generate high-converting landing page copy for the following SaaS product. Return as valid JSON with keys: headline (string), subheadline (string), features (array of strings), cta (string).
Product Name: ${productName}
Description: ${productDesc}
Write concise, bold copy to attract B2B or B2C founders.`;

    try {
      const copy = await generateCopyFromOpenAI(prompt, apiKey);
      return NextResponse.json(
        { success: true, copy },
        { status: 200 }
      );
    } catch (e: any) {
      return NextResponse.json(
        { success: false, error: e.message || "Copy generation failed." },
        { status: 500 }
      );
    }
  } else if (body.type === "url") {
    // Validate website URL
    const parse = copyFromUrlSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json(
        { success: false, error: parse.error.errors[0]?.message || "Invalid URL." },
        { status: 400 }
      );
    }
    const { websiteUrl } = parse.data;
    try {
      // Note: DOMParser is not available in Node. Use a minimal regex/text scrape for MVP.
      const siteRes = await fetch(websiteUrl, { method: "GET", redirect: "follow", headers: { "User-Agent": "CopyLiftBot/1.0" } });
      if (!siteRes.ok) throw new Error("Failed to fetch target website.");
      const html = await siteRes.text();
      // Strip HTML tags (naive)
      const text = html.replace(/<script[\s\S]*?<\/script>/gi, "")
        .replace(/<style[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .substring(0, 3500);

      const prompt = `Rewrite and improve the landing page copy for this website. Ignore irrelevant content and focus on product value. Return as valid JSON with keys: headline, subheadline, features (array), cta.
Website raw content: """${text}"""`;

      const copy = await generateCopyFromOpenAI(prompt, apiKey);
      return NextResponse.json(
        { success: true, copy },
        { status: 200 }
      );
    } catch (e: any) {
      return NextResponse.json(
        { success: false, error: e.message || "Website copy generation failed." },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { success: false, error: "Invalid request type." },
      { status: 400 }
    );
  }
}