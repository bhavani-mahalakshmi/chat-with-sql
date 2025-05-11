This application is an AI-powered chat interface that allows users to interact with a database using natural language queries. It leverages several key AI flows and React components to understand user intent, generate SQL queries, execute them against a connected database, and visualize the results in various formats.

## Application Logic

1.  **User Interaction:** Users interact with the database through a chat interface (`src/components/chat/ChatInterface.tsx`).
2.  **Query Understanding:** AI models analyze user queries to understand their intent (`src/ai/flows/understand-query.ts`).
3.  **SQL Generation:** Based on the understanding, AI generates appropriate SQL queries (`src/ai/flows/generate-sql.ts`). The database schema is retrieved to aid in this process (`src/ai/flows/get-database-schema.ts`).
4.  **Data Retrieval:** The generated SQL queries are executed against the database.
5.  **Data Visualization:** The retrieved data is displayed using various visualization components:
    *   `src/components/data-viz/DataVisualizer.tsx`: Orchestrates the display of different visualization types.
    *   `src/components/data-viz/BarChartDisplay.tsx`: Displays data as a bar chart.
    *   `src/components/data-viz/DataVisualizer.tsx`: Orchestrates the display of different visualization types.
    *   `src/components/data-viz/BarChartDisplay.tsx`: Displays data as a bar chart.
    *   `src/components/data-viz/PieChartDisplay.tsx`: Displays data as a pie chart.
    *   `src/components/data-viz/TableDisplay.tsx`: Displays data in a tabular format.
    *   `src/components/data-viz/PieChartDisplay.tsx`: Displays data as a pie chart.
    *   `src/components/data-viz/TableDisplay.tsx`: Displays data in a tabular format.
    *   `src/components/data-viz/TextResponseDisplay.tsx`: Displays plain text responses.
    *   `src/components/data-viz/VisualizationTypeSelector.tsx`: Allows users to select the desired visualization type.
6.  **Chat Display:** Chat messages and responses are displayed using the `src/components/chat/ChatMessage.tsx` component.

To get started, take a look at src/app/page.tsx.

## Setup Instructions

Follow these steps to set up and run the application:

### 1. Install Dependencies

Navigate to the project root directory in your terminal and run:


