import { execSync } from "child_process";
import fs from "fs";
import path from "path";


console.log("Building frontend...");


execSync("npm run build", {
  stdio: "inherit",
});


const packageDir =
  "public/updates/package";

const updateDir =
  "public/updates";

const zipPath =
  "public/updates/app.zip";


const versionFile =
  "public/updates/version.json";


// Read current app version

const appVersion =
  JSON.parse(
    fs.readFileSync(
      "package.json",
      "utf-8"
    )
  ).version;



// Clean old package

if (fs.existsSync(packageDir)) {

  fs.rmSync(
    packageDir,
    {
      recursive:true,
      force:true,
    }
  );

}


if (fs.existsSync(zipPath)) {

  fs.rmSync(zipPath);

}



// Create package folder

fs.mkdirSync(
  packageDir,
  {
    recursive:true,
  }
);



// Copy build

fs.cpSync(
  "dist",
  packageDir,
  {
    recursive:true,
  }
);



// Remove unwanted nested folder

const nested =
  path.join(
    packageDir,
    "updates"
  );


if (fs.existsSync(nested)) {

  fs.rmSync(
    nested,
    {
      recursive:true,
      force:true,
    }
  );

}



// Create package version

const packageVersion = {

  version: appVersion,

  buildTime:
    new Date().toISOString(),

  type:
    "frontend-update"

};


fs.writeFileSync(
  `${packageDir}/version.json`,
  JSON.stringify(
    packageVersion,
    null,
    2
  )
);



fs.writeFileSync(
  versionFile,
  JSON.stringify(
    packageVersion,
    null,
    2
  )
);



console.log(
  "Frontend package created"
);



// Create zip

console.log(
  "Creating update zip..."
);


execSync(
  "cd public/updates && zip -r app.zip package",
  {
    stdio:"inherit",
  }
);



console.log(
  "Update package ready:",
  appVersion
);
