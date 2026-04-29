import { useState } from "react";
import {
  Landmark,
  Search,
  Copy,
  Share,
  MapPin,
  Phone,
  Hash,
  Building2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { mockApi, IfscLookupResult } from "@/lib/mock-api";

export default function IfscLookup() {
  const [ifsc, setIfsc] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IfscLookupResult | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ifsc || ifsc.length !== 11) return;

    setLoading(true);
    setResult(null);

    try {
      const data = await mockApi.lookupIfsc(ifsc.toUpperCase());
      setResult(data);
    } catch (err) {
      toast.error("Failed to lookup IFSC");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const modeBadge = (label: string, enabled: boolean) => (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium ${
        enabled
          ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
          : "border-border/40 bg-background/40 text-muted-foreground"
      }`}
    >
      {enabled ? (
        <CheckCircle2 className="h-4 w-4" />
      ) : (
        <XCircle className="h-4 w-4" />
      )}
      {label}
    </div>
  );

  return (
    <ToolLayout
      title="IFSC Code Lookup"
      description="Enter an 11-character IFSC code to find the bank, branch, address, and supported transfer modes."
      icon={<Landmark className="h-8 w-8" />}
      color="text-cyan-400"
    >
      <Card className="border-cyan-500/20 bg-card/40 backdrop-blur-sm">
        <CardContent className="p-6">
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="flex-1">
              <Input
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                placeholder="HDFC0000240"
                maxLength={11}
                className="h-14 text-lg font-mono tracking-widest uppercase bg-background/50 border-cyan-500/20 focus-visible:ring-cyan-500"
              />
            </div>
            <Button
              type="submit"
              disabled={loading || ifsc.length !== 11}
              className="h-14 px-8 bg-cyan-600 hover:bg-cyan-700 text-white shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:shadow-[0_0_30px_rgba(8,145,178,0.5)] transition-all"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  Searching...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Find Branch
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {loading && (
        <Card className="border-border/50 bg-card/20 animate-pulse">
          <CardContent className="p-6 space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-8 w-64 bg-cyan-500/10" />
              <Skeleton className="h-4 w-48 bg-cyan-500/10" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton
                  key={i}
                  className="h-24 w-full rounded-xl bg-cyan-500/10"
                />
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton
                  key={i}
                  className="h-12 w-full rounded-lg bg-cyan-500/10"
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
          <Card className="border-cyan-500/30 bg-card/60 backdrop-blur shadow-[0_0_50px_-12px_rgba(8,145,178,0.18)] overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

            <CardHeader className="border-b border-border/50 pb-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-3xl font-bold tracking-tight">
                      {result.bank}
                    </CardTitle>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-muted-foreground">
                    <span className="text-lg text-foreground font-medium flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-cyan-400" />{" "}
                      {result.branch}
                    </span>
                    <span className="hidden sm:inline text-border">•</span>
                    <span className="font-mono bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded text-sm border border-cyan-500/20">
                      {result.ifsc}
                    </span>
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

            <CardContent className="p-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-background/50 border border-border/50 flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Hash className="h-4 w-4" /> MICR Code
                  </span>
                  <span className="font-semibold font-mono tracking-wider text-foreground/90">
                    {result.micr}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-background/50 border border-border/50 flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4" /> Branch Contact
                  </span>
                  <span className="font-semibold text-foreground/90">
                    {result.contact}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex flex-col gap-1">
                  <span className="text-sm text-cyan-500/80 flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Location
                  </span>
                  <span className="font-bold text-cyan-400">
                    {result.city}, {result.state}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-cyan-400" /> Branch Address
                </h3>
                <div className="p-4 rounded-lg border border-border/50 bg-background/40 text-foreground/90 leading-relaxed">
                  {result.address}
                  <div className="mt-2 text-sm text-muted-foreground">
                    {result.district}, {result.state}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-cyan-400" /> Supported
                  Transfer Modes
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {modeBadge("RTGS", result.rtgs)}
                  {modeBadge("NEFT", result.neft)}
                  {modeBadge("IMPS", result.imps)}
                  {modeBadge("UPI", result.upi)}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </ToolLayout>
  );
}
