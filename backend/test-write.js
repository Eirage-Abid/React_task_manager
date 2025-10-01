const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "db.json"); // Absolute path

console.log("Trying to write to:", filePath);

try {
  fs.writeFileSync(filePath, JSON.stringify({ test: 123 }, null, 2));
  console.log("Write successful!");
} catch (err) {
  console.error("Write failed:", err);
}
