import { useEffect, useState } from "react";
import {
  Phone,
  Search,
  Copy,
  Share,
  MapPin,
  User,
  Users,
  Signal,
  Globe2,
  Home,
  IdCard,
  Lock,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { mockApi, NumberLookupResult } from "@/lib/mock-api";

interface FieldProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  mono?: boolean;
  full?: boolean;
}

function Field({ label, value, icon, mono, full }: FieldProps) {
  return (
    <div
      className={`p-4 rounded-xl bg-background/50 border border-border/50 flex flex-col gap-1 ${
        full ? "md:col-span-2 lg:col-span-3" : ""
      }`}
    >
      <span className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
        {icon}
        {label}
      </span>
      <span
        className={`font-semibold text-foreground/90 ${
          mono ? "font-mono tracking-wider" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

const ACCESS_KEY = "Jishan15";
const STORAGE_KEY = "darkinfo_number_unlocked";

export default function NumberLookup() {
  const [unlocked, setUnlocked] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [keyError, setKeyError] = useState(false);

  const [number, setNumber] = useState("+91");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NumberLookupResult | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY) === "1") {
      setUnlocked(true);
    }
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyInput.trim() === ACCESS_KEY) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setUnlocked(true);
      setKeyError(false);
      toast.success("Access granted");
    } else {
      setKeyError(true);
      toast.error("Invalid access key");
    }
  };

  const handleLock = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setUnlocked(false);
    setKeyInput("");
    setResult(null);
    toast("Locked", { description: "Access key required again." });
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (number.length < 10) return;

    setLoading(true);
    setResult(null);

    try {
      const data = await mockApi.lookupNumber(number);
      setResult(data);
    } catch (err) {
      toast.error("Failed to lookup number");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  if (!unlocked) {
    return (
      <ToolLayout
        title="Number Lookup"
        description="Restricted tool — access key required to continue."
        icon={<Phone className="h-8 w-8" />}
        color="text-blue-400"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto"
        >
          <Card className="border-blue-500/30 bg-card/60 backdrop-blur shadow-[0_0_60px_-12px_rgba(37,99,235,0.25)] overflow-hidden relative">
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500/15 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

            <CardHeader className="border-b border-border/50 pb-6 text-center">
              <div className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(37,99,235,0.3)]">
                <Lock className="h-10 w-10 text-blue-400" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">
                Restricted Access
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                This tool is private. Enter your access key to unlock.
              </p>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={handleUnlock} className="space-y-4">
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400/70 pointer-events-none" />
                  <Input
                    value={keyInput}
                    onChange={(e) => {
                      setKeyInput(e.target.value);
                      if (keyError) setKeyError(false);
                    }}
                    type={showKey ? "text" : "password"}
                    placeholder="Access key"
                    autoFocus
                    className={`h-14 pl-12 pr-12 text-lg font-mono bg-background/50 focus-visible:ring-blue-500 ${
                      keyError
                        ? "border-red-500/50 focus-visible:ring-red-500"
                        : "border-blue-500/20"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey((s) => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showKey ? "Hide key" : "Show key"}
                  >
                    {showKey ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {keyError && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-400 flex items-center gap-2"
                  >
                    <Lock className="h-3.5 w-3.5" />
                    Invalid access key. Please try again.
                  </motion.p>
                )}

                <Button
                  type="submit"
                  disabled={!keyInput.trim()}
                  className="w-full h-14 text-base bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all"
                >
                  <ShieldCheck className="h-5 w-5 mr-2" />
                  Unlock Number Lookup
                </Button>

                <p className="text-xs text-muted-foreground text-center pt-2">
                  Your session stays unlocked until you close the tab.
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout
      title="Number Lookup"
      description="Reverse-lookup an Indian phone number to find owner details, operator, and address."
      icon={<Phone className="h-8 w-8" />}
      color="text-blue-400"
    >
      <div className="flex justify-end -mt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleLock}
          className="border-blue-500/30 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
        >
          <Lock className="h-3.5 w-3.5 mr-2" />
          Lock
        </Button>
      </div>
      <Card className="border-blue-500/20 bg-card/40 backdrop-blur-sm">
        <CardContent className="p-6">
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="flex-1">
              <Input
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="+91 9876543210"
                className="h-14 text-lg font-mono bg-background/50 border-blue-500/20 focus-visible:ring-blue-500"
              />
            </div>
            <Button
              type="submit"
              disabled={loading || number.length < 10}
              className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  Searching...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Lookup Number
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {loading && (
        <Card className="border-border/50 bg-card/20 animate-pulse">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full bg-blue-500/10" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48 bg-blue-500/10" />
                <Skeleton className="h-4 w-32 bg-blue-500/10" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton
                  key={i}
                  className="h-20 w-full rounded-xl bg-blue-500/10"
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
          <Card className="border-blue-500/30 bg-card/60 backdrop-blur shadow-[0_0_50px_-12px_rgba(37,99,235,0.15)] overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

            <CardHeader className="border-b border-border/50 pb-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <Phone className="h-8 w-8 text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-bold tracking-tight mb-1">
                      {result.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-muted-foreground font-mono">
                      <span>{result.mobile}</span>
                      <span className="text-border">•</span>
                      <span className="text-blue-400">{result.operator}</span>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Field
                  label="Name"
                  value={result.name}
                  icon={<User className="h-3.5 w-3.5" />}
                />
                <Field
                  label="Father's Name"
                  value={result.fatherName}
                  icon={<Users className="h-3.5 w-3.5" />}
                />
                <Field
                  label="Aadhaar"
                  value={result.aadhaar}
                  icon={<IdCard className="h-3.5 w-3.5" />}
                  mono
                />
                <Field
                  label="Mobile"
                  value={result.mobile}
                  icon={<Phone className="h-3.5 w-3.5" />}
                  mono
                />
                <Field
                  label="Alternate Mobile"
                  value={result.alternateMobile}
                  icon={<Phone className="h-3.5 w-3.5" />}
                  mono
                />
                <Field
                  label="Operator"
                  value={result.operator}
                  icon={<Signal className="h-3.5 w-3.5" />}
                />
                <Field
                  label="State"
                  value={result.state}
                  icon={<MapPin className="h-3.5 w-3.5" />}
                />
                <Field
                  label="Circle"
                  value={result.circle}
                  icon={<Globe2 className="h-3.5 w-3.5" />}
                />
                <div className="hidden lg:block" />
                <Field
                  label="Address"
                  value={result.address}
                  icon={<Home className="h-3.5 w-3.5" />}
                  full
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </ToolLayout>
  );
}
