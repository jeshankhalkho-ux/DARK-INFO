import { ReactNode } from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface ToolLayoutProps {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
  color?: string;
}

export function ToolLayout({ title, description, icon, children, color = "text-primary" }: ToolLayoutProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container max-w-4xl py-10 px-4 md:px-8 mx-auto"
    >
      <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Link>
      
      <div className="mb-10 flex items-start gap-4">
        <div className={`p-4 rounded-xl bg-card border border-border shadow-lg ${color}`}>
          {icon}
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">{title}</h1>
          <p className="text-muted-foreground text-lg">{description}</p>
        </div>
      </div>
      
      <div className="space-y-8">
        {children}
      </div>
    </motion.div>
  );
}