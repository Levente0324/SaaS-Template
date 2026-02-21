"use client";

import { useState } from "react";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";

type AIResult = {
  success: boolean;
  result?: string;
  imageUrl?: string;
  error?: string;
};

export default function DashboardPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch("/api/ai/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolName: "demo", // Must match a tool in lib/ai/run-tool.ts
          input: { promptText: input },
        }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({ success: false, error: "Network error occurred." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          AI Generator
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Input Section */}
        <div className="rounded-xl border border-border/50 bg-card shadow-sm p-6 transition-colors duration-300">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="prompt"
                className="block text-sm font-medium text-foreground/80 mb-2"
              >
                Enter your prompt
              </label>
              <textarea
                id="prompt"
                className="w-full min-h-[200px] rounded-lg border-border/50 bg-background/50 text-foreground shadow-sm focus:border-indigo-500 focus:ring-indigo-500 resize-none p-3 border"
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-full inline-flex justify-center items-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Response
                </>
              )}
            </button>
          </form>
        </div>

        {/* Output Section */}
        <div className="rounded-xl border border-border/50 bg-card shadow-sm p-6 min-h-[300px] flex flex-col transition-colors duration-300">
          <h3 className="text-sm font-medium text-foreground/80 mb-4">
            Result
          </h3>

          <div className="flex-1 rounded-lg bg-muted/30 p-4 border border-border/50 overflow-auto">
            {loading ? (
              <div className="flex h-full items-center justify-center text-foreground/40">
                <Loader2 className="h-8 w-8 animate-spin opacity-50" />
              </div>
            ) : response ? (
              response.success ? (
                response.imageUrl ? (
                  <div className="flex flex-col items-center justify-center space-y-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={response.imageUrl}
                      alt="AI Generated Result"
                      className="w-full max-w-full h-auto rounded-md shadow-sm border border-border/50 object-cover"
                      loading="lazy"
                    />
                    {response.result && (
                      <p className="text-sm text-foreground/70 italic text-center">
                        {response.result}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
                    {response.result}
                  </div>
                )
              ) : (
                <div className="flex h-full items-center justify-center text-red-500 space-x-2">
                  <AlertCircle className="h-5 w-5" />
                  <span>{response.error}</span>
                </div>
              )
            ) : (
              <div className="flex h-full items-center justify-center text-foreground/40 text-sm">
                Your AI-generated content will appear here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
