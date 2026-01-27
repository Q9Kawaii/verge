"use client";

import { useState } from "react";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function PopulateDBPage() {
  const [collectionName, setCollectionName] = useState("");
  const [status, setStatus] = useState("");

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    if (!file || !collectionName) {
      alert("Provide collection name and JSON file");
      return;
    }

    if (!file.name.endsWith(".json")) {
      alert("Please upload a .json file");
      return;
    }

    const reader = new FileReader();

    reader.onload = async (evt) => {
      try {
        const jsonData = JSON.parse(evt.target.result);

        if (!Array.isArray(jsonData)) {
          alert("JSON must be an array of snapshots");
          return;
        }

        // ✅ LIMIT TO FIRST 250 SNAPSHOTS
        const limitedData = jsonData.slice(0, 250);

        setStatus(`Uploading ${limitedData.length} snapshots...`);

        for (let i = 0; i < limitedData.length; i++) {
          const snapshot = limitedData[i];

          // Use timestamp if available, else fallback ID
          const docId =
            snapshot.timestamp ||
            snapshot.meta?.timestamp ||
            `snap_${String(i).padStart(4, "0")}`;

          await setDoc(
            doc(db, collectionName, docId),
            {
              ...snapshot,
              createdAt: new Date(),
            },
            { merge: true }
          );
        }

        setStatus("Upload complete ✅");
      } catch (err) {
        console.error(err);
        alert("Invalid JSON file");
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow space-y-6">
      <h1 className="text-2xl font-bold">
        Populate Grid Intelligence (Dev Tool)
      </h1>

      <div className="space-y-2">
        <label className="text-sm font-medium">Collection Name</label>
        <input
          value={collectionName}
          onChange={(e) => setCollectionName(e.target.value)}
          placeholder="grid_intelligence"
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">JSON File</label>
        <input
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="w-full"
        />
      </div>

      {status && (
        <p className="text-sm text-gray-600">{status}</p>
      )}

      <p className="text-xs text-gray-500">
        • Uploads first 250 snapshots only  
        • Stores JSON as-is  
        • No deletions  
        • Safe for prototype
      </p>
    </div>
  );
}
