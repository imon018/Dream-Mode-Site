import { execSync } from "child_process";
import fs from "fs";


console.log("Building frontend...");

execSync("npm run build", {
  stdio: "inherit",
});


const packageDir = "public/updates/package";
const zipPath = "public/updates/app.zip";


// Remove old package
if (fs.existsSync(packageDir)) {
  fs.rmSync(packageDir, {
    recursive: true,
    force: true,
  });
}


// Remove old zip
if (fs.existsSync(zipPath)) {
  fs.rmSync(zipPath);
}


// Create package folder
fs.mkdirSync(packageDir, {
  recursive: true,
});


// Copy only dist files
fs.cpSync(
  "dist",
  packageDir,
  {
    recursive: true,
  }
);


// Remove unnecessary nested update folder if exists
const nestedUpdates = `${packageDir}/updates`;

if (fs.existsSync(nestedUpdates)) {
  fs.rmSync(nestedUpdates, {
    recursive: true,
    force: true,
  });
}


console.log("Frontend package created");


// Create zip
console.log("Creating update zip...");

execSync(
  "cd public/updates && zip -r app.zip package",
  {
    stdio: "inherit",
  }
);


console.log("Update zip created successfully");
