import express from "express";
import { createServer as createViteServer } from "vite";
import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

// Load Firebase Config
const firebaseConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), "firebase-applet-config.json"), "utf8"));
const fbApp = initializeApp(firebaseConfig);
const db = getFirestore(fbApp, firebaseConfig.firestoreDatabaseId);

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper to execute bash commands
const runCmd = (cmd: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) resolve(stdout || ""); // Don't crash if command fails, just return empty
      else resolve(stdout);
    });
  });
};

// API: Fetch OS Metrics
app.get("/api/metrics", async (req, res) => {
  try {
    // Basic fallbacks for container environments
    const diskUsage = await runCmd("df -h / --output=pcent | tail -1 | tr -dc '0-9'");
    const cpuUsage = await runCmd("top -bn1 | grep 'Cpu(s)' | awk '{print $2}'");
    const memUsage = await runCmd("free | grep Mem | awk '{print $3/$2 * 100.0}'");

    const metricsData = {
      disk: parseFloat(diskUsage) || 0,
      cpu: parseFloat(cpuUsage) || 0,
      memory: parseFloat(memUsage) || 0,
      timestamp: new Date().toISOString()
    };

    // Persist to Firestore
    try {
      await addDoc(collection(db, "metrics"), {
        ...metricsData,
        createdAt: serverTimestamp()
      });
    } catch (dbErr) {
      console.error("Failed to persist to Firestore", dbErr);
    }

    res.json(metricsData);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// API: Run Algorithm (C Bridge)
app.post("/api/algo/sort", async (req, res) => {
  const { data } = req.body; // Expecting array of {value, timestamp}
  if (!Array.isArray(data)) return res.status(400).send("Invalid data");

  const input = `${data.length}\n${data.map(d => `${d.value} ${d.timestamp}`).join("\n")}`;
  const cPath = path.join(process.cwd(), "src/algorithms/sort.c");
  const binPath = "/tmp/sort_bin";

  try {
    await runCmd(`gcc ${cPath} -o ${binPath}`);
    const output = await new Promise((resolve, reject) => {
      const child = exec(binPath, (err, stdout, stderr) => {
        if (err) reject(stderr);
        else resolve(stdout);
      });
      child.stdin?.write(input);
      child.stdin?.end();
    });

    // Parse back from C output
    const lines = (output as string).split("\n").filter(l => l.trim() !== "");
    const count = parseInt(lines[0]);
    const sorted = lines.slice(1).map(l => {
      const [value, timestamp] = l.split(" ");
      return { value: parseFloat(value), timestamp };
    });

    res.json(sorted);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// Vite middleware for development
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
