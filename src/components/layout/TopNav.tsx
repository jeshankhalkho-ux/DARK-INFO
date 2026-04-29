import { Link } from "wouter";
import { Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TopNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center px-4 md:px-8">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold text-xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
            DARK INFO
          </span>
          <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-medium text-primary border border-primary/20">
            BETA
          </span>
        </Link>
        
        <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Home
          </Link>
          <a
            href="https://www.instagram.com/jishann_15?igsh=MTI2MnhrZW5rcHpjaQ=="
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            About
          </a>
        </nav>
        
        <div className="flex items-center justify-end space-x-4">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
            <Moon className="h-4 w-4" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
}