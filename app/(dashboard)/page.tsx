'use client';

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Loader2,
  CheckCircle2,
  Lightbulb,
  StickyNote,
  TextQuote,
  ExternalLink,
} from "lucide-react";

export default function HomePage() {
  // Minimal client state to show loading, error, and results for both copy generators
  // Only enable "use client" for input section relevant to submission
  // In a real production version, these would be split out, but here for atomicity

  // Client-side only sections below
  // Handles both generator flows: product info and website URL

  const [productName, setProductName] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [genLoading, setGenLoading] = useState(false);
  const [urlLoading, setUrlLoading] = useState(false);
  const [genResult, setGenResult] = useState<null | CopyResult>(null);
  const [urlResult, setUrlResult] = useState<null | CopyResult>(null);
  const [genError, setGenError] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);

  // Refs for easy select/copy
  const headlineRef = useRef<HTMLParagraphElement>(null);
  const featuresRef = useRef<HTMLUListElement>(null);
  const ctaRef = useRef<HTMLParagraphElement>(null);

  // Types
  type CopyResult = {
    headline: string;
    subheadline?: string;
    features: string[];
    cta: string;
  };

  // Helpers
  function copyText(text: string) {
    navigator.clipboard.writeText(text);
  }

  function copyList(list: string[]) {
    navigator.clipboard.writeText(list.join("\n"));
  }

  // Calls the OpenAI/LLM-backed API route for product info
  async function onGenerateCopy(e: React.FormEvent) {
    e.preventDefault();
    setGenError(null);
    setGenResult(null);
    setGenLoading(true);
    try {
      const res = await fetch("/api/generate-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "info", productName, productDesc }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setGenError(data.error || "Copy generation failed");
      } else {
        setGenResult(data.copy);
      }
    } catch (e) {
      setGenError("Unexpected error. Please try again.");
    }
    setGenLoading(false);
  }

  async function onGenerateFromUrl(e: React.FormEvent) {
    e.preventDefault();
    setUrlError(null);
    setUrlResult(null);
    setUrlLoading(true);
    try {
      const res = await fetch("/api/generate-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "url", websiteUrl }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setUrlError(data.error || "Copy generation failed");
      } else {
        setUrlResult(data.copy);
      }
    } catch (e) {
      setUrlError("Unexpected error. Please try again.");
    }
    setUrlLoading(false);
  }

  // Main page markup
  return (
    <main>
      {/* HERO */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-black text-gray-900 tracking-tight sm:text-6xl">
              <span className="text-orange-500">CopyLift</span>
            </h1>
            <h2 className="mt-6 text-2xl font-semibold text-gray-700">
              Generate killer landing page copy. Instantly.
            </h2>
            <p className="mt-6 text-lg text-gray-500">
              The AI-powered SaaS for founders & marketers to create
              high-converting headlines, feature lists, and CTAs for your
              next big idea. Just drop in your product info or a competitor’s website—get
              copy that sells, fast.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center">
              <a
                href="mailto:hi@chirag.co"
                className="inline-flex items-center px-6 py-3 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors font-semibold text-lg shadow"
              >
                Contact the Founder <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE FORMS */}
      <section className="bg-white py-16 border-y">
        <div className="max-w-4xl mx-auto px-4 sm:px-8">
          <div className="mb-12 flex flex-col gap-8 sm:flex-row sm:gap-12">
            {/* Generate from Product Info */}
            <div className="flex-1 bg-gray-50 p-8 rounded-xl shadow transition-shadow hover:shadow-md">
              <form onSubmit={onGenerateCopy}>
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="text-orange-500" />
                  <h3 className="text-xl font-semibold text-gray-800">
                    Generate Copy From Product Info
                  </h3>
                </div>
                <label className="block text-sm font-medium">
                  Product Name<span className="text-orange-500">*</span>
                  <input
                    className="block w-full mt-1 px-3 py-2 border rounded focus:ring-orange-400 focus:border-orange-500"
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                    maxLength={50}
                  />
                </label>
                <label className="block text-sm font-medium mt-4">
                  Description<span className="text-orange-500">*</span>
                  <textarea
                    className="block w-full mt-1 px-3 py-2 border rounded focus:ring-orange-400 focus:border-orange-500 min-h-[84px]"
                    value={productDesc}
                    onChange={(e) => setProductDesc(e.target.value)}
                    required
                    maxLength={500}
                  />
                </label>
                <Button
                  size="lg"
                  className="mt-6 w-full rounded-full flex items-center justify-center"
                  type="submit"
                  disabled={genLoading}
                >
                  {genLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate Copy <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
                {genError && (
                  <span className="block mt-3 text-red-500 text-sm">
                    {genError}
                  </span>
                )}
              </form>
              {genResult && (
                <div className="mt-9 border-t pt-6">
                  <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="text-green-500" />
                    Generated Copy
                  </h4>
                  <div className="space-y-4">
                    <div className="group relative">
                      <span className="font-semibold">Headline:</span>
                      <p
                        ref={headlineRef}
                        className="inline-block ml-2 pr-10 font-medium text-gray-900"
                      >
                        {genResult.headline}
                      </p>
                      <button
                        type="button"
                        onClick={() => copyText(genResult.headline)}
                        title="Copy"
                        className="absolute right-0 top-0 opacity-70 hover:opacity-100"
                      >
                        <StickyNote className="w-4 h-4" />
                      </button>
                    </div>
                    {genResult.subheadline && (
                      <div>
                        <span className="font-semibold">Subheadline:</span>
                        <p className="ml-2 inline-block font-medium text-gray-800">
                          {genResult.subheadline}
                        </p>
                      </div>
                    )}
                    <div className="group relative">
                      <span className="font-semibold">Features:</span>
                      <ul
                        ref={featuresRef}
                        className="list-disc ml-8 text-gray-700"
                      >
                        {genResult.features.map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                        ))}
                      </ul>
                      <button
                        type="button"
                        onClick={() => copyList(genResult.features)}
                        title="Copy"
                        className="absolute -right-4 top-0 opacity-70 hover:opacity-100"
                      >
                        <TextQuote className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="group relative">
                      <span className="font-semibold">Call to Action:</span>
                      <p
                        ref={ctaRef}
                        className="inline-block ml-2 font-medium text-orange-600"
                      >
                        {genResult.cta}
                      </p>
                      <button
                        type="button"
                        onClick={() => copyText(genResult.cta)}
                        title="Copy"
                        className="absolute right-0 top-0 opacity-70 hover:opacity-100"
                      >
                        <StickyNote className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Generate from Website URL */}
            <div className="flex-1 bg-gray-50 p-8 rounded-xl shadow transition-shadow hover:shadow-md">
              <form onSubmit={onGenerateFromUrl}>
                <div className="flex items-center gap-2 mb-3">
                  <ExternalLink className="text-orange-500" />
                  <h3 className="text-xl font-semibold text-gray-800">
                    Generate Copy From Website URL
                  </h3>
                </div>
                <label className="block text-sm font-medium">
                  Website URL<span className="text-orange-500">*</span>
                  <input
                    className="block w-full mt-1 px-3 py-2 border rounded focus:ring-orange-400 focus:border-orange-500"
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://"
                    required
                    pattern="https?://.+"
                  />
                </label>
                <Button
                  size="lg"
                  className="mt-6 w-full rounded-full flex items-center justify-center"
                  type="submit"
                  disabled={urlLoading}
                >
                  {urlLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate Copy <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
                {urlError && (
                  <span className="block mt-3 text-red-500 text-sm">
                    {urlError}
                  </span>
                )}
              </form>
              {urlResult && (
                <div className="mt-9 border-t pt-6">
                  <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="text-green-500" />
                    Improved Copy
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <span className="font-semibold">Headline:</span>
                      <p className="inline-block ml-2 font-medium text-gray-900">
                        {urlResult.headline}
                      </p>
                    </div>
                    {urlResult.subheadline && (
                      <div>
                        <span className="font-semibold">Subheadline:</span>
                        <p className="ml-2 inline-block font-medium text-gray-800">
                          {urlResult.subheadline}
                        </p>
                      </div>
                    )}
                    <div>
                      <span className="font-semibold">Features:</span>
                      <ul className="list-disc ml-8 text-gray-700">
                        {urlResult.features.map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="font-semibold">Call to Action:</span>
                      <p className="inline-block ml-2 font-medium text-orange-600">
                        {urlResult.cta}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* BRAND NOTE AND CONTACT */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">How CopyLift Works</h2>
          <ul className="text-left text-gray-700 mx-auto list-decimal list-inside mb-6">
            <li>
              Input your product info or competitor’s URL—CopyLift
              analyzes your details or scrapes the page.
            </li>
            <li>
              Instantly get a ready-to-use Headline, Subheadline, Feature list, and CTA copy fine-tuned to convert.
            </li>
            <li>
              Copy & paste your new sections directly into your site or builder.
            </li>
          </ul>
          <p className="text-gray-500">
            Built by <span className="font-medium text-gray-800">Chirag Dodiya</span> (<a className="text-orange-500 underline" href="mailto:hi@chirag.co">hi@chirag.co</a>)
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-lg font-bold text-orange-500">CopyLift</span>{" "}
            <span className=" ml-1 text-sm text-gray-400 tracking-wide">
              © {new Date().getFullYear()} Chirag Dodiya. All rights reserved.
            </span>
          </div>

          <a
            className="inline-flex items-center px-4 py-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors"
            href="mailto:hi@chirag.co"
          >
            Contact <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </footer>
    </main>
  );
}