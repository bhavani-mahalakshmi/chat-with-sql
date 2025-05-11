// This is an AI-powered function to determine whether a user query is a request for data or a general question.
// - understandQuery - A function that handles the plant diagnosis process.
// - UnderstandQueryInput - The input type for the understandQuery function.
// - UnderstandQueryOutput - The return type for the understandQuery function.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UnderstandQueryInputSchema = z.object({
  query: z.string().describe('The user query to understand.'),
});
export type UnderstandQueryInput = z.infer<typeof UnderstandQueryInputSchema>;

const UnderstandQueryOutputSchema = z.object({
  isDataRequest: z
    .boolean()
    .describe(
      'True if the query is a request for data from a database, false if it is a general question.'
    ),
  databaseType: z
    .string()
    .optional()
    .describe(
      'The type of database to query, e.g., MySQL, PostgreSQL, BigQuery. Only applicable if isDataRequest is true.'
    ),
  queryDetails: z
    .string()
    .optional()
    .describe(
      'Details about the data being requested. Only applicable if isDataRequest is true.'
    ),
});
export type UnderstandQueryOutput = z.infer<typeof UnderstandQueryOutputSchema>;

export async function understandQuery(input: UnderstandQueryInput): Promise<UnderstandQueryOutput> {
  return understandQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'understandQueryPrompt',
  input: {schema: UnderstandQueryInputSchema},
  output: {schema: UnderstandQueryOutputSchema},
  prompt: `You need to determine if the following query is a request for data from a database, or a general question.

Query: {{{query}}}

Respond with a JSON object. The isDataRequest field should be true if the query is a request for data and false otherwise. If isDataRequest is true, populate the databaseType and queryDetails fields, otherwise they should be omitted.  The databaseType field should be the type of database to query, e.g., MySQL, PostgreSQL, BigQuery. The queryDetails field should be details about the data being requested.

Example 1:
Query: What is the capital of France?
{
  "isDataRequest": false
}

Example 2:
Query: Show me the average sales for the last month from the sales table.
{
  "isDataRequest": true,
  "databaseType": "Unknown",
  "queryDetails": "Average sales for the last month"
}

Example 3:
Query: list all customers from the customers table
{
  "isDataRequest": true,
  "databaseType": "Unknown",
  "queryDetails": "all customers"
}

Output:
`,
});

const understandQueryFlow = ai.defineFlow(
  {
    name: 'understandQueryFlow',
    inputSchema: UnderstandQueryInputSchema,
    outputSchema: UnderstandQueryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
