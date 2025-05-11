"use client";

import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TextResponseDisplayProps {
  data: ReactNode;
  title?: string;
}

export function TextResponseDisplay({ data, title = "Response" }: TextResponseDisplayProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {typeof data === 'string' || typeof data === 'number' ? (
          <p className="text-foreground text-base">{data}</p>
        ) : (
          <div className="text-foreground text-base">{data}</div>
        )}
      </CardContent>
    </Card>
  );
}
