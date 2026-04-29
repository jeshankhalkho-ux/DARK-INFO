import { Github, Twitter, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4 md:px-8">
        <p className="text-sm leading-loose text-muted-foreground">
          © {new Date().getFullYear()} DARK INFO v1.0. All rights reserved.
        </p>
        <div className="flex items-center space-x-4 text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">
            <Github className="h-4 w-4" />
            <span className="sr-only">GitHub</span>
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            <Twitter className="h-4 w-4" />
            <span className="sr-only">Twitter</span>
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            <Mail className="h-4 w-4" />
            <span className="sr-only">Email</span>
          </a>
        </div>
      </div>
    </footer>
  );
}