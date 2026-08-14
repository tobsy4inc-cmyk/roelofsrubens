import * as esbuild from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create a temporary entry file that imports and executes the inject function
const entryContent = `
import { injectSpeedInsights } from '@vercel/speed-insights';

// Initialize Speed Insights when the script loads
if (typeof window !== 'undefined') {
  injectSpeedInsights();
}
`;

// Build the bundle
await esbuild.build({
  stdin: {
    contents: entryContent,
    resolveDir: process.cwd(),
    sourcefile: 'speed-insights-entry.js'
  },
  bundle: true,
  minify: true,
  format: 'iife',
  platform: 'browser',
  outfile: join(__dirname, '../js/speed-insights.js'),
  target: ['es2015']
});

console.log('✓ Speed Insights bundle created at js/speed-insights.js');
