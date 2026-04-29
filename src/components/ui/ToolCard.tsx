import { Link } from "wouter";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { ReactNode } from "react";

interface ToolCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
  color?: string;
  bg?: string;
}

export function ToolCard({ title, description, icon, href, color = "text-primary", bg = "bg-primary/10" }: ToolCardProps) {
  return (
    <Link href={href}>
      <Card className="group relative overflow-hidden h-full bg-card/50 hover:bg-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(0,190,255,0.15)] hover:-translate-y-1 cursor-pointer">
        <div className={`absolute top-0 right-0 w-32 h-32 opacity-20 blur-3xl rounded-full transition-all group-hover:opacity-40 group-hover:scale-150 ${bg.replace('/10', '/30')}`} />
        <CardHeader>
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-lg ${bg} ${color}`}>
              {icon}
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground opacity-0 -translate-x-4 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
          </div>
          <CardTitle className="text-xl mb-2">{title}</CardTitle>
          <CardDescription className="text-sm line-clamp-2">
            {description}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}