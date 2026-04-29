import { useState } from "react";
import { Video, Search, Download, Shield, PlayCircle, ExternalLink, Sparkles } from "lucide-react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { mockApi, VideoLookupResult } from "@/lib/mock-api";

export default function VideoDownloader() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VideoLookupResult | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setResult(null);

    try {
      const data = await mockApi.lookupVideo(url);
      setResult(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to fetch video";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (downloadUrl: string) => {
    if (!downloadUrl) {
      toast.error("No download link available");
      return;
    }
    try {
      // Open in new tab — browser will save or play depending on headers
      window.open(downloadUrl, "_blank", "noopener,noreferrer");
      toast.success("Opening download…");
    } catch {
      toast.error("Could not start download");
    }
  };

  return (
    <ToolLayout
      title="Video Downloader"
      description="Paste an Instagram reel, YouTube, TikTok or Facebook URL to grab the direct video link."
      icon={<Video className="h-8 w-8" />}
      color="text-rose-400"
    >
      <Card className="border-rose-500/20 bg-card/40 backdrop-blur-sm">
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.instagram.com/reel/..."
                className="h-14 text-lg bg-background/50 border-rose-500/20 focus-visible:ring-rose-500"
              />
            </div>
            <Button
              type="submit"
              disabled={loading || !url}
              className="h-14 px-8 bg-rose-600 hover:bg-rose-700 text-white shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:shadow-[0_0_30px_rgba(225,29,72,0.5)] transition-all"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  Extracting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Fetch Video
                </span>
              )}
            </Button>
          </form>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground justify-center">
            <span className="flex items-center gap-1">
              <Shield className="h-3 w-3" /> No watermark
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Instagram • TikTok • YouTube • Facebook
            </span>
          </div>
        </CardContent>
      </Card>

      {loading && (
        <Card className="border-border/50 bg-card/20 animate-pulse">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Skeleton className="h-48 md:w-80 w-full rounded-xl bg-rose-500/10 shrink-0" />
              <div className="flex-1 space-y-4 py-2">
                <Skeleton className="h-8 w-3/4 bg-rose-500/10" />
                <Skeleton className="h-4 w-1/2 bg-rose-500/10" />
                <div className="pt-4 flex flex-wrap gap-2">
                  <Skeleton className="h-12 w-40 rounded-md bg-rose-500/10" />
                  <Skeleton className="h-12 w-40 rounded-md bg-rose-500/10" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-rose-500/30 bg-card/60 backdrop-blur shadow-[0_0_50px_-12px_rgba(225,29,72,0.15)] overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-500/5 rounded-full blur-[100px] pointer-events-none" />

            <CardContent className="p-6 relative">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Thumbnail */}
                <div className="shrink-0 group relative rounded-xl overflow-hidden md:w-[320px] aspect-video border border-rose-500/20 shadow-xl bg-black/40">
                  {result.thumbnail ? (
                    <img
                      src={result.thumbnail}
                      alt="Video thumbnail"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="h-16 w-16 text-rose-500/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle className="h-12 w-12 text-white drop-shadow-md" />
                  </div>
                  <div className="absolute top-2 left-2 bg-rose-600/90 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                    {result.platform}
                  </div>
                </div>

                {/* Details & Actions */}
                <div className="flex-1 flex flex-col">
                  <div className="mb-6">
                    <p className="text-xs text-rose-400 font-semibold uppercase tracking-wider mb-2">
                      Ready to download
                    </p>
                    <h3 className="text-2xl font-bold mb-2 leading-tight">
                      {result.platform} {result.type}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Direct, no-watermark link extracted successfully.
                    </p>
                  </div>

                  <div className="mt-auto space-y-3">
                    <Button
                      onClick={() => handleDownload(result.downloadUrl)}
                      className="w-full h-14 text-base bg-rose-600 hover:bg-rose-700 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]"
                    >
                      <Download className="mr-2 h-5 w-5" />
                      Download Video
                    </Button>
                    <Button
                      variant="outline"
                      asChild
                      className="w-full h-12 border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400"
                    >
                      <a href={result.videoUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open in new tab
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </ToolLayout>
  );
}
