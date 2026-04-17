/**
 * ═══════════════════════════════════════════════════════════════
 * API ROUTE: /api/render-pdf
 * ═══════════════════════════════════════════════════════════════
 *
 * Called by n8n to render the /report/[profileId] page as a
 * high-quality vector PDF using Puppeteer + Chrome on the VM.
 * Returns the PDF as binary (application/pdf).
 */

import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';

export async function POST(request: NextRequest) {
  let browser = null;

  try {
    const { renderTargetUrl, profileId } = await request.json();

    if (!renderTargetUrl && !profileId) {
      return NextResponse.json(
        { error: 'Missing renderTargetUrl or profileId' },
        { status: 400 }
      );
    }

    // Build the URL to render — use internal localhost for speed
    const targetUrl =
      renderTargetUrl ||
      `http://localhost:3000/report/${profileId}`;

    console.log(`[PDF] 🖨️ Rendering PDF for: ${targetUrl}`);

    // Launch Chrome (already installed on the Azure VM)
    browser = await puppeteer.launch({
      executablePath:
        process.env.CHROME_PATH ||
        '/usr/bin/google-chrome',
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--font-render-hinting=none',
      ],
    });

    const page = await browser.newPage();

    // Set a large viewport for high-quality rendering
    await page.setViewport({ width: 1200, height: 1600 });

    // Navigate and wait for the React app to fully render
    await page.goto(targetUrl, {
      waitUntil: 'networkidle0',
      timeout: 60000,
    });

    // Wait an extra 2s for any animations/lazy content
    await new Promise((r) => setTimeout(r, 2000));

    // Generate a professional A4 PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm',
      },
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="font-size:8px; color:#666; width:100%; text-align:center; padding:5px 0;">
          PSYPROFILER — CLASSIFIED INTELLIGENCE REPORT
        </div>
      `,
      footerTemplate: `
        <div style="font-size:7px; color:#999; width:100%; text-align:center; padding:5px 0;">
          Page <span class="pageNumber"></span> of <span class="totalPages"></span> — psyprofiler.io
        </div>
      `,
    });

    console.log(`[PDF] ✅ PDF generated: ${pdfBuffer.length} bytes`);

    // Return the PDF as binary
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="psyprofiler-report-${profileId || 'unknown'}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('[PDF] Rendering error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'PDF render failed' },
      { status: 500 }
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
