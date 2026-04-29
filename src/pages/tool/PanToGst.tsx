import { useState } from "react";
import {
  FileText,
  Search,
  Copy,
  Share,
  MapPin,
  AlertCircle,
  Hash,
} from "lucide-react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { mockApi, PanLookupResult } from "@/lib/mock-api";

export default function PanToGst() {
  const [pan, setPan] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PanLookupResult | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pan || pan.length !== 10) return;

    setLoading(true);
    setResult(null);

    try {
      const data = await mockApi.lookupPan(pan.toUpperCase());
      setResult(data);
    } catch (err) {
      toast.error("Failed to lookup PAN");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <ToolLayout
      title="PAN to GSTIN"
      description="Enter a PAN number to retrieve the linked GSTIN, status, and state."
      icon={<FileText className="h-8 w-8" />}
      color="text-amber-400"
    >
      <Card className="border-amber-500/20 bg-card/40 backdrop-blur-sm">
        <CardContent className="p-6">
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="flex-1">
              <Input
                value={pan}
                onChange={(e) => setPan(e.target.value.toUpperCase())}
                placeholder="ABCDE1234F"
                maxLength={10}
                className="h-14 text-lg font-mono tracking-widest uppercase bg-background/50 border-amber-500/20 focus-visible:ring-amber-500"
              />
            </div>
            <Button
              type="submit"
              disabled={loading || pan.length !== 10}
              className="h-14 px-8 bg-amber-600 hover:bg-amber-700 text-white shadow-[0_0_20px_rgba(217,119,6,0.3)] hover:shadow-[0_0_30px_rgba(217,119,6,0.5)] transition-all"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  Searching...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Find GSTIN
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {loading && (
        <Card className="border-border/50 bg-card/20 animate-pulse">
          <CardContent className="p-6 space-y-6">
            <Skeleton className="h-8 w-64 bg-amber-500/10" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton
                  key={i}
                  className="h-20 w-full rounded-xl bg-amber-500/10"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-amber-500/30 bg-card/60 backdrop-blur shadow-[0_0_50px_-12px_rgba(217,119,6,0.15)] overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

            <CardHeader className="border-b border-border/50 pb-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <FileText className="h-8 w-8 text-amber-400" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-bold tracking-tight">
                      GSTIN Found
                    </CardTitle>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="font-mono bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded text-sm border border-amber-500/20">
                        PAN {result.pan}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleCopy(JSON.stringify(result, null, 2))
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-col gap-2 md:col-span-2">
                  <span className="text-sm text-amber-500/80 flex items-center gap-2">
                    <Hash className="h-4 w-4" /> GST Number
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl tracking-wider text-amber-300">
                      {result.gstNum}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(result.gstNum)}
                      className="text-amber-400 hover:text-amber-300"
                    >
                      <Copy className="h-4 w-4 mr-2" /> Copy
                    </Button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-background/50 border border-border/50 flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" /> Status
                  </span>
                  <span className="font-bold text-emerald-400">
                    {result.status}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-background/50 border border-border/50 flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> State
                  </span>
                  <span className="font-semibold text-foreground/90">
                    {result.state}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-background/50 border border-border/50 flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4" /> PAN
                  </span>
                  <span className="font-mono font-semibold tracking-wider text-foreground/90">
                    {result.pan}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </ToolLayout>
  );
}
