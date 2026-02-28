const { chromium } = require('playwright');

const URLS = [
  'https://sanand0.github.io/tdsdata/js_table/?seed=64',
  'https://sanand0.github.io/tdsdata/js_table/?seed=65',
  'https://sanand0.github.io/tdsdata/js_table/?seed=66',
  'https://sanand0.github.io/tdsdata/js_table/?seed=67',
  'https://sanand0.github.io/tdsdata/js_table/?seed=68',
  'https://sanand0.github.io/tdsdata/js_table/?seed=69',
  'https://sanand0.github.io/tdsdata/js_table/?seed=70',
  'https://sanand0.github.io/tdsdata/js_table/?seed=71',
  'https://sanand0.github.io/tdsdata/js_table/?seed=72',
  'https://sanand0.github.io/tdsdata/js_table/?seed=73'
];

function extractNumbers(text) {
  const matches = text.match(/-?\d+(?:\.\d+)?/g);
  if (!matches) {
    return [];
  }
  return matches.map(Number).filter((value) => Number.isFinite(value));
}

async function sumPageTables(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('table');

  await page.waitForTimeout(300);

  const tableCellTexts = await page.$$eval('table th, table td', (cells) =>
    cells.map((cell) => cell.textContent || '')
  );

  let pageTotal = 0;
  for (const text of tableCellTexts) {
    const values = extractNumbers(text);
    for (const value of values) {
      pageTotal += value;
    }
  }

  console.log(`Page total (${url}): ${pageTotal}`);
  return pageTotal;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  let grandTotal = 0;
  try {
    for (const url of URLS) {
      const pageTotal = await sumPageTables(page, url);
      grandTotal += pageTotal;
    }
  } finally {
    await browser.close();
  }

  console.log(`Grand total across all pages: ${grandTotal}`);
}

main().catch((error) => {
  console.error('Failed to compute table totals:', error);
  process.exit(1);
});