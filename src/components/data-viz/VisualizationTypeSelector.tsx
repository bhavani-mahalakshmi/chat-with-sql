"use client";

import { BarChart2, PieChartIcon, Table2, Baseline, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { VisualizationType } from "@/lib/types";

interface VisualizationTypeSelectorProps {
  currentType: VisualizationType;
  onTypeChange: (type: VisualizationType) => void;
  availableTypes: VisualizationType[];
}

const iconMap: Record<VisualizationType, React.ElementType> = {
  bar: BarChart2,
  pie: PieChartIcon,
  table: Table2,
  text: Baseline,
};

const labelMap: Record<VisualizationType, string> = {
  bar: "Bar Chart",
  pie: "Pie Chart",
  table: "Table",
  text: "Text",
};

export function VisualizationTypeSelector({
  currentType,
  onTypeChange,
  availableTypes,
}: VisualizationTypeSelectorProps) {
  if (availableTypes.length <= 1) {
    return null; // Don't show selector if only one type is available or none
  }

  return (
    <div className="flex justify-end mb-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Settings2 className="h-4 w-4" />
            Change View
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {availableTypes.map((type) => {
            const IconComponent = iconMap[type];
            return (
              <DropdownMenuItem
                key={type}
                onClick={() => onTypeChange(type)}
                className={currentType === type ? "bg-accent" : ""}
              >
                <IconComponent className="h-4 w-4 mr-2" />
                {labelMap[type]}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
