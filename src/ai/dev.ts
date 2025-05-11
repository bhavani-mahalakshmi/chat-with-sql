import { config } from 'dotenv';
config();

import '@/ai/flows/generate-sql.ts';
import '@/ai/flows/understand-query.ts';
import '@/ai/flows/get-database-schema.ts';
