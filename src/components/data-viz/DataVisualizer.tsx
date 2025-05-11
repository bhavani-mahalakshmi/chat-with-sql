"use client";

import { useState, useEffect, useMemo } from "react";
import type { VisualizationType, BarChartDataItem, PieChartDataItem, TableDataItem } from "@/lib/types";
import { BarChartDisplay } from "./BarChartDisplay";
import { PieChartDisplay } from "./PieChartDisplay";
import { TableDisplay } from "./TableDisplay";
import { TextResponseDisplay } from "./TextResponseDisplay";
import { VisualizationTypeSelector } from "./VisualizationTypeSelector";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

interface DataVisualizerProps {
  data: any; // Raw data from (mocked) SQL query
  queryDetails?: string; // Details about the query from AI
  sqlQuery?: string; // Generated SQL query
}

const isSingleValue = (data: any): boolean => {
  return typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean';
};

const isLikelyChartData = (data: any[]): data is Array<BarChartDataItem | PieChartDataItem> => {
  if (!Array.isArray(data) || data.length === 0) return false;
  return data.every(item => typeof item === 'object' && item !== null && 'name' in item && 'value' in item && typeof item.value === 'number');
};

const isLikelyTableData = (data: any[]): data is TableDataItem[] => {
  if (!Array.isArray(data) || data.length === 0) return false;
  return data.every(item => typeof item === 'object' && item !== null);
};


export function DataVisualizer({ data, queryDetails, sqlQuery }: DataVisualizerProps) {
  const [selectedType, setSelectedType] = useState<VisualizationType | null>(null);

  const availableTypes = useMemo<VisualizationType[]>(() => {
    const types: VisualizationType[] = [];
    if (isSingleValue(data)) types.push('text');
    if (Array.isArray(data)) {
      if (isLikelyChartData(data)) {
        types.push('bar');
        types.push('pie');
      }
      if (isLikelyTableData(data)) types.push('table');
    }
    if (types.length === 0 && data !== undefined && data !== null) { // Fallback for unrecognized array data
        if (Array.isArray(data) && data.length > 0) types.push('table');
        else if (!Array.isArray(data)) types.push('text'); // if not array, try text
    }
    return types;
  }, [data]);

  useEffect(() => {
    if (availableTypes.length > 0) {
      // Auto-select logic
      if (queryDetails?.toLowerCase().includes("pie chart")) {
        setSelectedType(availableTypes.includes('pie') ? 'pie' : availableTypes[0]);
      } else if (queryDetails?.toLowerCase().includes("bar chart") || queryDetails?.toLowerCase().includes("histogram")) {
        setSelectedType(availableTypes.includes('bar') ? 'bar' : availableTypes[0]);
      } else if (queryDetails?.toLowerCase().includes("table") || queryDetails?.toLowerCase().includes("list")) {
         setSelectedType(availableTypes.includes('table') ? 'table' : availableTypes[0]);
      } 
      else {
        setSelectedType(availableTypes[0]);
      }
    } else {
      setSelectedType(null);
    }
  }, [data, queryDetails, availableTypes]);

  if (data === undefined || data === null || availableTypes.length === 0) {
    return (
       <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>No Visualization Available</AlertTitle>
        <AlertDescription>
          The data received could not be visualized, or no data was returned.
          {sqlQuery && <pre className="mt-2 whitespace-pre-wrap bg-muted p-2 rounded-md text-sm font-mono">{sqlQuery}</pre>}
        </AlertDescription>
      </Alert>
    );
  }

  const renderVisualization = () => {
    switch (selectedType) {
      case "bar":
        return <BarChartDisplay data={data as BarChartDataItem[]} title={queryDetails || "Bar Chart"} />;
      case "pie":
        return <PieChartDisplay data={data as PieChartDataItem[]} title={queryDetails || "Pie Chart"} />;
      case "table":
        return <TableDisplay data={data as TableDataItem[]} title={queryDetails || "Data Table"} />;
      case "text":
        return <TextResponseDisplay data={data} title={queryDetails || "Response"} />;
      default:
        return (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Unsupported Data</AlertTitle>
            <AlertDescription>
              The data format is not supported for visualization.
            </AlertDescription>
          </Alert>
        );
    }
  };

  return (
    <div className="space-y-4">
      {sqlQuery && (
        <details className="mt-2 p-2 bg-muted/50 rounded-md">
            <summary className="text-sm font-medium cursor-pointer text-muted-foreground hover:text-foreground">View Generated SQL</summary>
            <pre className="mt-1 whitespace-pre-wrap p-2 rounded-md text-xs font-mono bg-background border">{sqlQuery}</pre>
        </details>
      )}
      <VisualizationTypeSelector
        currentType={selectedType!}
        onTypeChange={setSelectedType}
        availableTypes={availableTypes}
      />
      {selectedType ? renderVisualization() : <p className="text-muted-foreground">Selecting best visualization...</p>}
    </div>
  );
}
