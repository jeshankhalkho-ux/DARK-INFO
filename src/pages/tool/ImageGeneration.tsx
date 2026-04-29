import { useState } from "react";
import {
  Image as ImageIcon,
  Wand2,
  Download,
  Layers,
  Expand,
  ExternalLink,
} from "lucide-react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { mockApi, ImageGenResult } from "@/lib/mock-api";

const STYLES = ["Cyberpunk", "Photorealistic", "Anime", "Minimalist", "3D Render", "Concept Art"];
const RATIOS = ["1:1", "16:9", "9:16", "4:3"];

export default function ImageGeneration() {
  const [prompt, setPrompt] = useState("");
  const [activeStyle, setActiveStyle] = useState(STYLES[0]);
  const [activeRatio, setActiveRatio] = useState(RATIOS[0]);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [result, setResult] = useState<ImageGenResult | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;

    setLoading(true);
    setImageLoading(true);
    setResult(null);

    try {
      // Append the chosen style as a hint to the prompt (the API only takes `imgp`)
      const fullPrompt = `${prompt}, ${activeStyle.toLowerCase()} style`;
      const data = await mockApi.generateImage(fullPrompt, activeStyle, activeRatio);
      setResult(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to generate image";
      toast.error(msg);
      setImageLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (img: string) => {
    if (!img) return;
    // Open in new tab — most browsers auto-prompt save for image responses
    window.open(img, "_blank", "noopener,noreferrer");
    toast.success("Opening image — right-click → Save");
  };

  return (
    <ToolLayout
      title="Image Generation"
      description="Turn your text prompt into a stunning AI-generated image."
      icon={<ImageIcon className="h-8 w-8" />}
      color="text-purple-400"
    >
      <Card className="border-purple-500/20 bg-card/40 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want to see... (e.g., A neon-lit cyber city in the rain)"
                className="min-h-[120px] text-lg bg-background/50 border-purple-500/20 focus-visible:ring-purple-500 resize-none p-4"
              />
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <Layers className="h-4 w-4" /> Style
                </p>
                <div className="flex flex-wrap gap-2">
                  {STYLES.map((s) => (
                    <Button
                      key={s}
                      variant={activeStyle === s ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveStyle(s)}
                      className={
                        activeStyle === s
                          ? "bg-purple-600 hover:bg-purple-700 text-white"
                          : "border-purple-500/20 hover:bg-purple-500/10"
                      }
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <Expand className="h-4 w-4" /> Aspect Ratio
                </p>
                <div className="flex flex-wrap gap-2">
                  {RATIOS.map((r) => (
                    <Button
                      key={r}
                      variant={activeRatio === r ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveRatio(r)}
                      className={
                        activeRatio === r
                          ? "bg-purple-600 hover:bg-purple-700 text-white font-mono"
                          : "border-purple-500/20 hover:bg-purple-500/10 font-mono"
                      }
                    >
                      {r}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading || !prompt}
              className="w-full h-14 text-lg bg-purple-600 hover:bg-purple-700 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] transition-all mt-4"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  Generating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5" />
                  Generate Image
                </span>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {(loading || imageLoading) && !result && (
        <Skeleton className="aspect-square w-full max-w-2xl mx-auto rounded-xl bg-purple-500/10 animate-pulse border border-purple-500/20" />
      )}

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative max-w-3xl mx-auto"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

          <Card className="border-purple-500/30 bg-card/60 backdrop-blur shadow-[0_0_50px_-12px_rgba(147,51,234,0.2)] overflow-hidden">
            <CardContent className="p-4 sm:p-6">
              <div className="relative rounded-xl overflow-hidden border border-purple-500/30 bg-card mb-4">
                {imageLoading && (
                  <Skeleton className="absolute inset-0 z-10 bg-purple-500/10 animate-pulse" />
                )}
                <img
                  src={result.images[0]}
                  alt={result.prompt}
                  onLoad={() => setImageLoading(false)}
                  onError={() => {
                    setImageLoading(false);
                    toast.error("Could not load generated image");
                  }}
                  className="w-full max-h-[600px] object-contain bg-black/40"
                />
              </div>

              <p className="text-sm text-muted-foreground mb-4 italic line-clamp-2">
                "{result.prompt}"
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => handleDownload(result.images[0])}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="flex-1 border-purple-500/30 hover:bg-purple-500/10 hover:text-purple-400"
                >
                  <a href={result.images[0]} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open Full Size
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </ToolLayout>
  );
}
