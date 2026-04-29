import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Command } from "cmdk";
import { 
  Terminal, 
  Phone, 
  Car, 
  Video, 
  Image as ImageIcon, 
  FileText, 
  Landmark,
  X,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const TOOLS = [
  { id: "number", name: "Number Lookup", path: "/tool/number-lookup", icon: Phone, color: "text-blue-400", bg: "bg-blue-400/10" },
  { id: "vehicle", name: "Vehicle Lookup", path: "/tool/vehicle-lookup", icon: Car, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { id: "video", name: "Video Downloader", path: "/tool/video-downloader", icon: Video, color: "text-rose-400", bg: "bg-rose-400/10" },
  { id: "image", name: "Image Generation", path: "/tool/image-generation", icon: ImageIcon, color: "text-purple-400", bg: "bg-purple-400/10" },
  { id: "pan", name: "PAN to GST", path: "/tool/pan-to-gst", icon: FileText, color: "text-amber-400", bg: "bg-amber-400/10" },
  { id: "ifsc", name: "IFSC Lookup", path: "/tool/ifsc-lookup", icon: Landmark, color: "text-cyan-400", bg: "bg-cyan-400/10" },
];

export function FAB() {
  const [open, setOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCmdOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleToolSelect = (path: string) => {
    setLocation(path);
    setOpen(false);
    setCmdOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="flex flex-col-reverse gap-3 mb-2"
            >
              {TOOLS.map((tool, i) => {
                const Icon = tool.icon;
                return (
                  <motion.button
                    key={tool.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleToolSelect(tool.path)}
                    className="flex items-center gap-3 group"
                  >
                    <span className="bg-card/90 backdrop-blur border border-border px-3 py-1.5 rounded-md text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      {tool.name}
                    </span>
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center border border-border/50 bg-card/90 backdrop-blur shadow-lg hover:scale-110 transition-transform ${tool.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1 bg-card/80 backdrop-blur border border-border px-3 py-1.5 rounded-full text-xs text-muted-foreground shadow-sm">
            <kbd className="font-mono">⌘K</kbd>
          </div>
          <Button
            size="icon"
            className="h-14 w-14 rounded-full shadow-[0_0_20px_rgba(0,190,255,0.3)] hover:shadow-[0_0_30px_rgba(0,190,255,0.5)] transition-all bg-primary hover:bg-primary/90"
            onClick={() => setOpen(!open)}
          >
            <motion.div
              animate={{ rotate: open ? 45 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {open ? <X className="h-6 w-6 text-primary-foreground" /> : <Terminal className="h-6 w-6 text-primary-foreground" />}
            </motion.div>
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {cmdOpen && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
            >
              <Command className="w-full">
                <div className="flex items-center border-b border-border px-3">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <Command.Input 
                    className="flex-1 h-14 bg-transparent border-none focus:ring-0 px-3 outline-none text-foreground placeholder:text-muted-foreground" 
                    placeholder="Search tools..." 
                    autoFocus
                  />
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <kbd className="bg-muted px-1.5 py-0.5 rounded">ESC</kbd>
                  </div>
                </div>
                <Command.List className="max-h-[300px] overflow-y-auto p-2">
                  <Command.Empty className="p-4 text-center text-sm text-muted-foreground">
                    No tools found.
                  </Command.Empty>
                  <Command.Group heading="Available Tools" className="text-xs font-medium text-muted-foreground p-2">
                    {TOOLS.map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <Command.Item
                          key={tool.id}
                          onSelect={() => handleToolSelect(tool.path)}
                          className="flex items-center gap-3 px-3 py-3 rounded-md cursor-pointer hover:bg-accent/50 aria-selected:bg-accent/50 text-foreground transition-colors"
                        >
                          <div className={`p-2 rounded-md ${tool.bg} ${tool.color}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="font-medium">{tool.name}</span>
                        </Command.Item>
                      );
                    })}
                  </Command.Group>
                </Command.List>
              </Command>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}