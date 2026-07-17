import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = process.cwd();
const mediaRoot = path.join(root, "public", "exercise-media");
const required = {
  hammer: "Alternate_Hammer_Curl",
  ezbar: "EZ-Bar_Curl",
  cableHammer: "Cable_Hammer_Curls_-_Rope_Attachment",
  chestPress: "Machine_Bench_Press",
  shoulderPress: "Machine_Shoulder_Military_Press",
  rearLunge: "Dumbbell_Rear_Lunge",
  birdDogFallback: "Superman",
};

function hash(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

for (const [name, folder] of Object.entries(required)) {
  for (const frame of [0, 1]) {
    const file = path.join(mediaRoot, folder, `${frame}.jpg`);
    if (!fs.existsSync(file)) throw new Error(`${name}: missing ${file}`);
    if (fs.statSync(file).size < 10000) throw new Error(`${name}: invalid small image ${file}`);
  }
}

const hammerHash = hash(path.join(mediaRoot, required.hammer, "0.jpg"));
const ezbarHash = hash(path.join(mediaRoot, required.ezbar, "0.jpg"));
const cableHash = hash(path.join(mediaRoot, required.cableHammer, "0.jpg"));

if (hammerHash === ezbarHash) throw new Error("Hammer Curl and EZ-Bar Curl still use the same image.");
if (hammerHash === cableHash) throw new Error("Hammer Curl and Cable Hammer Curl still use the same image.");
if (ezbarHash === cableHash) throw new Error("EZ-Bar Curl and Cable Hammer Curl still use the same image.");

console.log("Media verification passed: replacement curl exercises use distinct offline images.");
