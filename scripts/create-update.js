import { execSync } from "child_process";
import fs from "fs";
import path from "path";

console.log("Building frontend...");

execSync("npm run build", {
  stdio: "inherit",
});

const packageDir = "public/updates/package";
const updateDir = "public/updates";
const zipPath = "public/updates/app.zip";
const versionFile = "public/updates/version.json";

const appVersion = JSON.parse(
  fs.readFileSync("package.json", "utf-8")
).version;

if (fs.existsSync(packageDir)) {
  fs.rmSync(packageDir, { recursive: true, force: true });
}

if (fs.existsSync(zipPath)) {
  fs.rmSync(zipPath);
}

fs.mkdirSync(packageDir, { recursive: true });

fs.cpSync("dist", packageDir, { recursive: true });

const nested = path.join(packageDir, "updates");
if (fs.existsSync(nested)) {
  fs.rmSync(nested, { recursive: true, force: true });
}

// The APK(s) under public/downloads exist only for the direct-download
// link on the live site - the OTA-served web content never needs to
// serve them itself. Without this, every APK sitting in public/ gets
// copied into package/ AND zipped into app.zip on top of that, so a
// 19MB APK turned into ~57MB of dead weight duplicated three times
// across the OTA package alone.
const downloads = path.join(packageDir, "downloads");
if (fs.existsSync(downloads)) {
  fs.rmSync(downloads, { recursive: true, force: true });
}

const packageVersion = {
  version: appVersion,
  buildTime: new Date().toISOString(),
  type: "frontend-update",
};

fs.writeFileSync(
  `${packageDir}/version.json`,
  JSON.stringify(packageVersion, null, 2)
);

fs.writeFileSync(
  versionFile,
  JSON.stringify(packageVersion, null, 2)
);

console.log("Frontend package created");

// Zip the CONTENTS of package/ (not the folder itself) so entries
// don't get a "package/" prefix - Android's UpdateLoaderPlugin
// extracts straight into updates/package/, so a prefix caused files
// to land one level too deep and broke every OTA update.
console.log("Creating update zip...");

execSync(
  "cd public/updates/package && zip -r ../app.zip . -x '.*'",
  { stdio: "inherit" }
);

// package/ was only ever needed as the source to zip from - nothing
// live fetches this unzipped folder (the app only ever downloads
// app.zip), so shipping it too just doubles the size of every deploy
// for no reason. Delete it now that app.zip has been built.
fs.rmSync(packageDir, { recursive: true, force: true });

console.log("Update package ready:", appVersion);
