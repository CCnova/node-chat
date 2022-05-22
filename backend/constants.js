import { fileURLToPath } from 'url';
import path from 'path';

export const DIRECTORY_NAME = path.dirname(fileURLToPath(import.meta.url));
export const DATABASE_JSON_PATH = path.join(DIRECTORY_NAME, 'database.json');
export const PORT = process.env.port || 3001;