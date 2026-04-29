import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { FAB } from "@/components/layout/FAB";
import { Switch, Route } from "wouter";
import { AnimatePresence } from "framer-motion";
import Home from "@/pages/Home";
import NumberLookup from "@/pages/tool/NumberLookup";
import VehicleLookup from "@/pages/tool/VehicleLookup";
import VideoDownloader from "@/pages/tool/VideoDownloader";
import ImageGeneration from "@/pages/tool/ImageGeneration";
import PanToGst from "@/pages/tool/PanToGst";
import IfscLookup from "@/pages/tool/IfscLookup";
import NotFound from "@/pages/not-found";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <TopNav />
      <main className="flex-1 relative z-10 w-full">
        {children}
      </main>
      <Footer />
      <FAB />
    </div>
  );
}

export function AppRouter() {
  return (
    <AnimatePresence mode="wait">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/tool/number-lookup" component={NumberLookup} />
        <Route path="/tool/vehicle-lookup" component={VehicleLookup} />
        <Route path="/tool/video-downloader" component={VideoDownloader} />
        <Route path="/tool/image-generation" component={ImageGeneration} />
        <Route path="/tool/pan-to-gst" component={PanToGst} />
        <Route path="/tool/ifsc-lookup" component={IfscLookup} />
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}