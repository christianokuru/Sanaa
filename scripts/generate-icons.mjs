// Renders the PWA icons from the logo. Run with: npm run icons (needs Playwright installed globally).
import { chromium } from "playwright";
import { readFileSync } from "node:fs";

const svg = readFileSync("public/icons/icon.svg", "utf8");
const plain = (size) => `<body style="margin:0;background:transparent">${svg.replace("<svg ", `<svg width="${size}" height="${size}" `)}</body>`;
// Maskable icons need the art inside the central safe zone on a full-bleed background.
const maskable = (size) =>
  `<body style="margin:0;width:${size}px;height:${size}px;background:#F0532B;display:flex;align-items:center;justify-content:center">${svg
    .replace('rx="9"', 'rx="0"')
    .replace("<svg ", `<svg width="${size * 0.7}" height="${size * 0.7}" `)}</body>`;

const jobs = [
  ["icon-192.png", 192, plain],
  ["icon-512.png", 512, plain],
  ["maskable-512.png", 512, maskable],
  ["apple-touch-icon.png", 180, maskable],
];

const browser = await chromium.launch();
const page = await browser.newPage();
for (const [name, size, html] of jobs) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(html(size));
  await page.screenshot({ path: `public/icons/${name}`, omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
}
await browser.close();
console.log("icons written");
