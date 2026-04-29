import { motion } from "framer-motion";
import { TOOLS } from "@/components/layout/FAB";
import { ToolCard } from "@/components/ui/ToolCard";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Clock } from "lucide-react";

export default function Home() {
  const toolDescriptions = [
    "Reverse-lookup Indian phone numbers — owner, operator, address.",
    "Fetch full RC, owner, insurance, PUC and RTO details.",
    "Download videos from YouTube, Insta, and TikTok in high quality.",
    "Generate stunning AI images with a single prompt.",
    "Find linked GSTIN, status, and state from a PAN number.",
    "Lookup any Indian bank branch by IFSC — address, MICR, and modes.",
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-12 md:py-24 max-w-6xl"
    >
      {/* Hero Section */}
      <div className="text-center mb-16 space-y-6">
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tighter"
        >
          One App.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
            Every Lookup.
          </span>
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          The ultimate multi-tool for power users. Fast, accurate, and completely ad-free.
        </motion.p>
        
        {/* Stats Strip */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 md:gap-8 pt-4"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-4 py-2 rounded-full border border-border">
            <Activity className="w-4 h-4 text-primary" />
            <span>4.2M Lookups Served</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-4 py-2 rounded-full border border-border">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Real-time Data</span>
          </div>
        </motion.div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {TOOLS.map((tool, i) => {
          const Icon = tool.icon;
          return (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <ToolCard
                title={tool.name}
                description={toolDescriptions[i]}
                icon={<Icon className="w-8 h-8" />}
                href={tool.path}
                color={tool.color}
                bg={tool.bg}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity Mock */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" /> Live Feed
        </h2>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {[
                { action: "Number Lookup", detail: "Jio Mobile • Mumbai", time: "Just now" },
                { action: "Vehicle Lookup", detail: "MH-12 Pune RTO", time: "2m ago" },
                { action: "PAN to GST", detail: "Registered 01 Apr 2020", time: "5m ago" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="font-medium text-foreground/80">{item.action}</span>
                    <span className="text-muted-foreground hidden sm:inline">— {item.detail}</span>
                  </div>
                  <span className="text-muted-foreground">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}