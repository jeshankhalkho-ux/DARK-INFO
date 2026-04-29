import { useState } from "react";
import {
  Car,
  Search,
  Copy,
  Share,
  Shield,
  Calendar,
  User,
  Users,
  Hash,
  Building2,
  Fuel,
  Gauge,
  CreditCard,
  FileText,
  MapPin,
  Phone,
  Globe,
  Home,
  Clock,
  AlertCircle,
  CheckCircle2,
  Ban,
  ScrollText,
} from "lucide-react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { mockApi, VehicleLookupResult } from "@/lib/mock-api";

interface RowProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  mono?: boolean;
  accent?: string;
}

function Row({ label, value, icon, mono, accent }: RowProps) {
  return (
    <div className="p-4 rounded-xl bg-background/50 border border-border/50 flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
        {icon}
        {label}
      </span>
      <span
        className={`font-semibold ${
          mono ? "font-mono tracking-wider" : ""
        } ${accent ?? "text-foreground/90"}`}
      >
        {value}
      </span>
    </div>
  );
}

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  accent: string;
  children: React.ReactNode;
}

function Section({ title, icon, accent, children }: SectionProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className={accent}>{icon}</span>
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {children}
      </div>
    </div>
  );
}

function formatRemaining(dateStr: string): {
  label: string;
  expired: boolean;
} {
  const target = new Date(dateStr);
  if (Number.isNaN(target.getTime())) {
    return { label: "—", expired: false };
  }
  const now = new Date();
  const expired = target.getTime() < now.getTime();

  let from = expired ? target : now;
  let to = expired ? now : target;

  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const label = `${years} year${years === 1 ? "" : "s"}, ${months} month${
    months === 1 ? "" : "s"
  } & ${days} day${days === 1 ? "" : "s"}`;
  return { label, expired };
}

export default function VehicleLookup() {
  const [rc, setRc] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VehicleLookupResult | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rc) return;

    setLoading(true);
    setResult(null);

    try {
      const data = await mockApi.lookupVehicle(rc.toUpperCase());
      setResult(data);
    } catch (err) {
      toast.error("Failed to lookup vehicle");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const insuranceRemaining = result
    ? formatRemaining(result.insurance.insuranceExpiry)
    : null;
  const pucRemaining = result ? formatRemaining(result.dates.pucUpto) : null;

  return (
    <ToolLayout
      title="Vehicle Lookup"
      description="Fetch comprehensive RC info, owner details, insurance, PUC, and more from the registration number."
      icon={<Car className="h-8 w-8" />}
      color="text-emerald-400"
    >
      <Card className="border-emerald-500/20 bg-card/40 backdrop-blur-sm">
        <CardContent className="p-6">
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
                <span className="text-xs font-bold text-blue-500 bg-white/10 px-1 py-0.5 rounded mr-2">
                  IND
                </span>
              </div>
              <Input
                value={rc}
                onChange={(e) => setRc(e.target.value.toUpperCase())}
                placeholder="MH12AB1234"
                className="h-14 pl-16 text-lg font-mono tracking-widest uppercase bg-background/50 border-emerald-500/20 focus-visible:ring-emerald-500"
              />
            </div>
            <Button
              type="submit"
              disabled={loading || !rc}
              className="h-14 px-8 bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_0_20px_rgba(5,150,105,0.3)] hover:shadow-[0_0_30px_rgba(5,150,105,0.5)] transition-all"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  Searching...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Lookup RC
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
              <Skeleton className="h-16 w-16 rounded-xl bg-emerald-500/10" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-48 bg-emerald-500/10" />
                <Skeleton className="h-4 w-32 bg-emerald-500/10" />
              </div>
            </div>
            {[1, 2, 3].map((row) => (
              <div
                key={row}
                className="grid grid-cols-2 md:grid-cols-3 gap-3"
              >
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton
                    key={i}
                    className="h-20 w-full rounded-lg bg-emerald-500/10"
                  />
                ))}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {result && insuranceRemaining && pucRemaining && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-emerald-500/30 bg-card/60 backdrop-blur shadow-[0_0_50px_-12px_rgba(5,150,105,0.15)] overflow-hidden relative">
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

            <CardHeader className="border-b border-border/50 pb-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-3xl font-bold tracking-tight">
                      {result.vehicle.modelName}
                    </CardTitle>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                      ACTIVE
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-muted-foreground font-mono">
                    <span className="text-xl text-foreground font-bold tracking-widest">
                      {result.registrationNumber}
                    </span>
                    <span className="hidden sm:inline text-border">•</span>
                    <span className="flex items-center gap-1">
                      <Fuel className="h-4 w-4" /> {result.vehicle.fuelType}
                    </span>
                    <span className="hidden sm:inline text-border">•</span>
                    <span>{result.ownership.registeredRto}</span>
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

            <CardContent className="p-6 space-y-10">
              {/* Owner Highlight */}
              <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-500/80 font-medium mb-1">
                    Registered Owner
                  </p>
                  <p className="text-xl font-bold text-emerald-400">
                    {result.ownership.ownerName}
                  </p>
                </div>
                <Shield className="h-10 w-10 text-emerald-500/30" />
              </div>

              {/* Ownership Details */}
              <Section
                title="Ownership Details"
                icon={<User className="h-5 w-5" />}
                accent="text-emerald-400"
              >
                <Row
                  label="Owner Name"
                  value={result.ownership.ownerName}
                  icon={<User className="h-3.5 w-3.5" />}
                />
                <Row
                  label="Father's Name"
                  value={result.ownership.fatherName}
                  icon={<Users className="h-3.5 w-3.5" />}
                />
                <Row
                  label="Owner Serial No"
                  value={result.ownership.ownerSerialNo}
                  icon={<Hash className="h-3.5 w-3.5" />}
                />
                <Row
                  label="Registration Number"
                  value={result.ownership.registrationNumber}
                  icon={<Car className="h-3.5 w-3.5" />}
                  mono
                />
                <Row
                  label="Financier Name"
                  value={result.ownership.financierName}
                  icon={<CreditCard className="h-3.5 w-3.5" />}
                />
                <Row
                  label="Registered RTO"
                  value={result.ownership.registeredRto}
                  icon={<Building2 className="h-3.5 w-3.5" />}
                />
              </Section>

              {/* Vehicle Details */}
              <Section
                title="Vehicle Details"
                icon={<Car className="h-5 w-5" />}
                accent="text-emerald-400"
              >
                <Row
                  label="Model Name"
                  value={result.vehicle.modelName}
                  icon={<Car className="h-3.5 w-3.5" />}
                />
                <Row
                  label="Maker Model"
                  value={result.vehicle.makerModel}
                  icon={<Building2 className="h-3.5 w-3.5" />}
                />
                <Row
                  label="Vehicle Class"
                  value={result.vehicle.vehicleClass}
                  icon={<FileText className="h-3.5 w-3.5" />}
                />
                <Row
                  label="Fuel Type"
                  value={result.vehicle.fuelType}
                  icon={<Fuel className="h-3.5 w-3.5" />}
                />
                <Row
                  label="Fuel Norms"
                  value={result.vehicle.fuelNorms}
                  icon={<Gauge className="h-3.5 w-3.5" />}
                />
                <div className="hidden md:block lg:hidden" />
                <Row
                  label="Chassis Number"
                  value={result.vehicle.chassisNumber}
                  icon={<Hash className="h-3.5 w-3.5" />}
                  mono
                />
                <Row
                  label="Engine Number"
                  value={result.vehicle.engineNumber}
                  icon={<Hash className="h-3.5 w-3.5" />}
                  mono
                />
              </Section>

              {/* Insurance Information */}
              <Section
                title="Insurance Information"
                icon={<Shield className="h-5 w-5" />}
                accent="text-emerald-400"
              >
                <Row
                  label={`Insurance Valid Upto ${insuranceRemaining.label}`}
                  value={
                    insuranceRemaining.expired
                      ? `Expired ${insuranceRemaining.label} ago`
                      : `Valid for ${insuranceRemaining.label}`
                  }
                  icon={
                    insuranceRemaining.expired ? (
                      <AlertCircle className="h-3.5 w-3.5 text-red-400" />
                    ) : (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    )
                  }
                  accent={
                    insuranceRemaining.expired
                      ? "text-red-400"
                      : "text-emerald-400"
                  }
                />
                <Row
                  label="Insurance Expiry"
                  value={result.insurance.insuranceExpiry}
                  icon={<Calendar className="h-3.5 w-3.5" />}
                />
                <Row
                  label="Insurance No"
                  value={result.insurance.insuranceNo}
                  icon={<Hash className="h-3.5 w-3.5" />}
                  mono
                />
                <Row
                  label="Insurance Company"
                  value={result.insurance.insuranceCompany}
                  icon={<Building2 className="h-3.5 w-3.5" />}
                />
              </Section>

              {/* Important Dates & Validity */}
              <Section
                title="Important Dates & Validity"
                icon={<Calendar className="h-5 w-5" />}
                accent="text-emerald-400"
              >
                <Row
                  label="Registration Date"
                  value={result.dates.registrationDate}
                  icon={<Calendar className="h-3.5 w-3.5" />}
                />
                <Row
                  label="Vehicle Age"
                  value={result.dates.vehicleAge}
                  icon={<Clock className="h-3.5 w-3.5" />}
                />
                <Row
                  label="Fitness Upto"
                  value={result.dates.fitnessUpto}
                  icon={<CheckCircle2 className="h-3.5 w-3.5" />}
                />
                <Row
                  label="Tax Upto"
                  value={result.dates.taxUpto}
                  icon={<CreditCard className="h-3.5 w-3.5" />}
                />
                <Row
                  label="PUC No"
                  value={result.dates.pucNo}
                  icon={<Hash className="h-3.5 w-3.5" />}
                  mono
                />
                <Row
                  label="PUC Upto"
                  value={result.dates.pucUpto}
                  icon={<Calendar className="h-3.5 w-3.5" />}
                />
                <Row
                  label="PUC Expiry In"
                  value={
                    pucRemaining.expired
                      ? `Expired ${pucRemaining.label} ago`
                      : pucRemaining.label
                  }
                  icon={
                    pucRemaining.expired ? (
                      <AlertCircle className="h-3.5 w-3.5 text-red-400" />
                    ) : (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    )
                  }
                  accent={
                    pucRemaining.expired ? "text-red-400" : "text-emerald-400"
                  }
                />
                <Row
                  label="Insurance Upto"
                  value={result.dates.insuranceUpto}
                  icon={<Calendar className="h-3.5 w-3.5" />}
                />
                <Row
                  label="Insurance Expiry In"
                  value={
                    insuranceRemaining.expired
                      ? `Expired ${insuranceRemaining.label} ago`
                      : insuranceRemaining.label
                  }
                  icon={
                    insuranceRemaining.expired ? (
                      <AlertCircle className="h-3.5 w-3.5 text-red-400" />
                    ) : (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    )
                  }
                  accent={
                    insuranceRemaining.expired
                      ? "text-red-400"
                      : "text-emerald-400"
                  }
                />
              </Section>

              {/* Other Information */}
              <Section
                title="Other Information"
                icon={<ScrollText className="h-5 w-5" />}
                accent="text-emerald-400"
              >
                <Row
                  label="Financer Name"
                  value={result.other.financerName}
                  icon={<CreditCard className="h-3.5 w-3.5" />}
                />
                <Row
                  label="Cubic Capacity"
                  value={result.other.cubicCapacity}
                  icon={<Gauge className="h-3.5 w-3.5" />}
                />
                <Row
                  label="Seating Capacity"
                  value={result.other.seatingCapacity}
                  icon={<Users className="h-3.5 w-3.5" />}
                />
                <Row
                  label="Permit Type"
                  value={result.other.permitType}
                  icon={<FileText className="h-3.5 w-3.5" />}
                />
                <Row
                  label="Blacklist Status"
                  value={result.other.blacklistStatus}
                  icon={<Ban className="h-3.5 w-3.5" />}
                  accent={
                    result.other.blacklistStatus.toLowerCase().includes("no")
                      ? "text-emerald-400"
                      : "text-red-400"
                  }
                />
                <Row
                  label="NOC Details"
                  value={result.other.nocDetails}
                  icon={<ScrollText className="h-3.5 w-3.5" />}
                />
              </Section>

              {/* Basic Card Info */}
              <Section
                title="Basic Card Info"
                icon={<CreditCard className="h-5 w-5" />}
                accent="text-emerald-400"
              >
                <Row
                  label="Modal Name"
                  value={result.basicCard.modalName}
                  icon={<Car className="h-3.5 w-3.5" />}
                />
                <Row
                  label="Owner Name"
                  value={result.basicCard.ownerName}
                  icon={<User className="h-3.5 w-3.5" />}
                />
                <Row
                  label="Code"
                  value={result.basicCard.code}
                  icon={<Hash className="h-3.5 w-3.5" />}
                  mono
                />
                <Row
                  label="City Name"
                  value={result.basicCard.cityName}
                  icon={<MapPin className="h-3.5 w-3.5" />}
                />
                <Row
                  label="Phone"
                  value={result.basicCard.phone}
                  icon={<Phone className="h-3.5 w-3.5" />}
                  mono
                />
                <Row
                  label="Website"
                  value={result.basicCard.website}
                  icon={<Globe className="h-3.5 w-3.5" />}
                />
                <Row
                  label="Address"
                  value={result.basicCard.address}
                  icon={<Home className="h-3.5 w-3.5" />}
                />
              </Section>

              {/* Root Level */}
              <Section
                title="Root Level Fields"
                icon={<Hash className="h-5 w-5" />}
                accent="text-emerald-400"
              >
                <Row
                  label="registration_number"
                  value={result.registrationNumber}
                  icon={<Car className="h-3.5 w-3.5" />}
                  mono
                />
              </Section>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </ToolLayout>
  );
}
