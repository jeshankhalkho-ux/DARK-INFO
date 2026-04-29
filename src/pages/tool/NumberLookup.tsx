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

  const [number, setNumber] = useState("");  
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
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-non
            
