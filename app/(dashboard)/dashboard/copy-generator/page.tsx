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

export default function CopyGeneratorDashboardPage() {
  // State management for dashboard copy generator (same as landing, but auth-only)
  const [productName, setProductName] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [genLoading, setGenLoading] = useState(false);
  const [urlLoading, setUrlLoading] = useState(false);
  const [genResult, setGenResult] = useState<null | CopyResult>(null);
  const [urlResult, setUrlResult] = useState<null | CopyResult>(null);
  const [genError, setGenError] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);

  // Refs for copy
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

  // Handlers
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

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <FileTextIcon className="text-orange-500" />
        Copy Generator
      </h1>
      <div className="mb-12 flex flex-col gap-8 sm:flex-row sm:gap-12">
        {/* Product Info Form */}
        <div className="flex-1 bg-white border p-6 rounded-xl shadow-sm">
          <form onSubmit={onGenerateCopy}>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-800">
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
              <span className="block mt-3 text-red-500 text-sm">{genError}</span>
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
        {/* Website URL Form */}
        <div className="flex-1 bg-white border p-6 rounded-xl shadow-sm">
          <form onSubmit={onGenerateFromUrl}>
            <div className="flex items-center gap-2 mb-3">
              <ExternalLink className="text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-800">
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
              <span className="block mt-3 text-red-500 text-sm">{urlError}</span>
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
  );
}

// The FileText icon not always imported as its own name in lucide-react
function FileTextIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      {...props}
      width={28}
      height={28}
      strokeWidth={2}
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}