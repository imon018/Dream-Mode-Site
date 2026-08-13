import fs from "fs";

console.log("== Fixing unescaped-entity errors ==");

const fixes = [
  { file: "src/components/CartPage.jsx", from: "Looks like you haven't added anything yet.", to: "Looks like you haven&apos;t added anything yet." },
  { file: "src/components/NoInternet.jsx", from: "You're Offline 😔", to: "You&apos;re Offline 😔" },
  { file: "src/components/NoInternet.jsx", from: "Some features are unavailable while you're offline.", to: "Some features are unavailable while you&apos;re offline." },
  { file: "src/components/Testimonials.jsx", from: '"{item.review}"', to: "&quot;{item.review}&quot;" },
  { file: "src/pages/Login.jsx", from: "Don't have an account?", to: "Don&apos;t have an account?" },
  { file: "src/pages/admin/components/MobileDashboard.jsx", from: "Here's what's happening with your store today.", to: "Here&apos;s what&apos;s happening with your store today." },
  { file: "src/pages/common/Notifications.jsx", from: "You're all caught up.", to: "You&apos;re all caught up." },
];

for (const { file, from, to } of fixes) {
  if (!fs.existsSync(file)) { console.log(`!! MISSING FILE: ${file}`); continue; }
  const content = fs.readFileSync(file, "utf8");
  if (!content.includes(from)) {
    console.log(`!! SKIPPED (not found): ${file}`);
    continue;
  }
  const count = content.split(from).length - 1;
  fs.writeFileSync(file, content.split(from).join(to), "utf8");
  console.log(`   ${file}: replaced ${count} occurrence(s)`);
}

const addOrderFile = "src/pages/admin/AddOrder.jsx";
if (fs.existsSync(addOrderFile)) {
  let c = fs.readFileSync(addOrderFile, "utf8");
  const n = (c.match(/Customer's/g) || []).length;
  if (n > 0) {
    c = c.replaceAll("Customer's", "Customer&apos;s");
    fs.writeFileSync(addOrderFile, c, "utf8");
    console.log(`   ${addOrderFile}: replaced ${n} occurrence(s)`);
  } else {
    console.log(`!! SKIPPED: ${addOrderFile}`);
  }
}

console.log("\n== Fixing no-useless-catch in settingsService.js ==");
const settingsFile = "src/services/settingsService.js";
if (fs.existsSync(settingsFile)) {
  let content = fs.readFileSync(settingsFile, "utf8");
  const pattern = /catch\(error\)\{\s*\n\s*\n\s*throw error;\s*\n\s*\}/g;
  const count = (content.match(pattern) || []).length;
  content = content.replace(pattern, "catch (error) {\n    console.error(error);\n    throw error;\n  }");
  fs.writeFileSync(settingsFile, content, "utf8");
  console.log(`   ${settingsFile}: fixed ${count} block(s)`);
} else {
  console.log("!! MISSING FILE: src/services/settingsService.js");
}

console.log("\nDone.");
