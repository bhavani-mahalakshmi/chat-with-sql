import type { ReactNode } from 'react';

export type MessageSender = 'user' | 'ai';

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  content: ReactNode;
  timestamp: Date;
  queryDetails?: string;
  sqlQuery?: string;
  data?: any; // Raw data from SQL query (mocked)
}

export type VisualizationType = 'bar' | 'pie' | 'table' | 'text';

// Example data structures - adjust based on actual data needs
export interface BarChartDataItem {
  name: string;
  value: number;
  [key: string]: any; // Allow other properties
}

export interface PieChartDataItem {
  name: string;
  value: number;
  fill?: string; // Optional fill color for pie slices
  [key: string]: any;
}

export type TableDataItem = Record<string, any>;

export interface UnderstandQueryOutput {
  isDataRequest: boolean;
  databaseType?: string;
  queryDetails?: string;
}

export interface GenerateSQLOutput {
  sqlQuery: string;
}

export interface GetDatabaseSchemaInput {
  uri: string;
}

export interface GetDatabaseSchemaOutput {
  schema: string;
}
