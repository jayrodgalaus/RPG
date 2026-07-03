import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const assetsRoot = path.join(repoRoot, "assets");
const outputFile = path.join(assetsRoot, "manifest.json");

const usableExts = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".svg",
  ".webm",
  ".mp4",
  ".mp3",
  ".wav",
  ".ogg",
  ".json",
]);

const imageExts = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);
const videoExts = new Set([".webm", ".mp4"]);
const audioExts = new Set([".mp3", ".wav", ".ogg"]);
const iconExts = new Set([".svg", ".png", ".webp"]);

function toPosix(filePath) {
  return filePath.split(path.sep).join("/");
}

function fileNameWithoutExt(filePath) {
  return path.basename(filePath, path.extname(filePath));
}

function getKind(ext) {
  if (videoExts.has(ext)) return "video";
  if (audioExts.has(ext)) return "audio";
  if (ext === ".json") return "data";
  return "image";
}

function scanFiles(relativeDir, allowedExts, options = {}) {
  const absoluteDir = path.join(repoRoot, relativeDir);

  if (!fs.existsSync(absoluteDir)) {
    return [];
  }

  const results = [];

  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const absolutePath = path.join(currentDir, entry.name);
      const relativePath = toPosix(path.relative(repoRoot, absolutePath));

      if (options.exclude?.some((excluded) => relativePath.includes(excluded))) {
        continue;
      }

      if (entry.isDirectory()) {
        walk(absolutePath);
        continue;
      }

      const ext = path.extname(entry.name).toLowerCase();

      if (!allowedExts.has(ext)) {
        continue;
      }

      results.push({
        name: fileNameWithoutExt(entry.name),
        path: relativePath,
        ext,
        kind: getKind(ext),
      });
    }
  }

  walk(absoluteDir);

  return results.sort((a, b) => a.path.localeCompare(b.path));
}

const all = scanFiles("assets", usableExts);

const manifest = {
  version: 1,
  generatedAt: new Date().toISOString(),

  all,

  portraits: scanFiles("assets/img/Souls", imageExts),

  backgrounds: scanFiles("assets/img/Backgrounds", imageExts),

  townNpcs: scanFiles("assets/img/NPCs/Town", imageExts, {
    exclude: ["/Refiners/", "\\Refiners\\"],
  }),

  refiners: scanFiles("assets/img/NPCs/Town/Refiners", imageExts),

  maidens: scanFiles("assets/img/NPCs/Maidens", imageExts),

  equipment: scanFiles("assets/img/Equipment", imageExts),

  mobs: scanFiles("assets/img/Mobs", imageExts),

  materials: scanFiles("assets/img/Materials", imageExts),

  icons: scanFiles("assets/icons", iconExts),

  videos: scanFiles("assets/vid", videoExts),

  audio: scanFiles("assets/audio", audioExts),
};

fs.writeFileSync(outputFile, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(`Asset manifest generated: ${toPosix(path.relative(repoRoot, outputFile))}`);
console.log({
  all: manifest.all.length,
  portraits: manifest.portraits.length,
  backgrounds: manifest.backgrounds.length,
  townNpcs: manifest.townNpcs.length,
  refiners: manifest.refiners.length,
  maidens: manifest.maidens.length,
  equipment: manifest.equipment.length,
  mobs: manifest.mobs.length,
  materials: manifest.materials.length,
  icons: manifest.icons.length,
  videos: manifest.videos.length,
  audio: manifest.audio.length,
});