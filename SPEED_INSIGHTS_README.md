# Vercel Speed Insights Setup

This project has been configured with Vercel Speed Insights to track real-user performance metrics.

## What was installed

- **Package**: `@vercel/speed-insights` v1.0.12
- **Build tool**: `esbuild` v0.19.0 (dev dependency)

## How it works

Since this is a static HTML website without a JavaScript framework or build system, we've implemented a custom solution:

1. **Build Script** (`scripts/build-speed-insights.js`): This script uses esbuild to bundle the Speed Insights `injectSpeedInsights()` function into a standalone JavaScript file.

2. **Bundled Script** (`js/speed-insights.js`): The generated bundle is included in all HTML pages and automatically initializes Speed Insights when the page loads.

3. **HTML Integration**: All HTML pages (root pages, bespoke pages, and product pages) include the following script tag:
   ```html
   <script defer src="js/speed-insights.js"></script>
   ```
   or for subdirectory pages:
   ```html
   <script defer src="../js/speed-insights.js"></script>
   ```

## Rebuilding the Speed Insights bundle

If you need to rebuild the Speed Insights bundle (e.g., after updating the package version):

```bash
npm run build
```

This will regenerate `js/speed-insights.js`.

## Deployment

Speed Insights will automatically start collecting data once the site is deployed to Vercel. Note:

- Speed Insights does **not** track data in development mode
- Metrics will appear in the Vercel dashboard after deployment
- It may take a few days of visitor traffic before you can explore meaningful metrics

## Files Modified

The following files were created or modified:

### Created:
- `package.json` - Node.js package configuration
- `package-lock.json` - Locked dependency versions
- `.gitignore` - Ignores node_modules and build artifacts
- `scripts/build-speed-insights.js` - Build script for Speed Insights bundle
- `js/speed-insights.js` - Bundled Speed Insights script
- `SPEED_INSIGHTS_README.md` - This file

### Modified:
- All HTML files in the root directory (7 files)
- All HTML files in `bespoke-pages/` (4 files)
- All HTML files in `products/` (162 files)

Total: 173 HTML files updated with Speed Insights integration.

## Viewing Metrics

After deployment to Vercel:

1. Go to your Vercel dashboard
2. Select your project
3. Navigate to the "Speed Insights" tab
4. View real-user performance metrics including:
   - First Contentful Paint (FCP)
   - Largest Contentful Paint (LCP)
   - Cumulative Layout Shift (CLS)
   - First Input Delay (FID)
   - Time to First Byte (TTFB)

For more information, visit: https://vercel.com/docs/speed-insights
