"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function PopulateDBPage() {
  const [collectionName, setCollectionName] = useState("");
  const [status, setStatus] = useState("");

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !collectionName) {
      alert("Provide collection name and Excel file");
      return;
    }

    const reader = new FileReader();

    reader.onload = async (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);

      setStatus(`Processing ${rows.length} rows...`);

      for (const row of rows) {
        const { id, ...fields } = row;

        if (id) {
          // 🔁 UPSERT with known ID
          await setDoc(
            doc(db, collectionName, String(id)),
            {
              ...fields,
              updatedAt: new Date(),
            },
            { merge: true } // 👈 KEY LINE (append / update only)
          );
        } else {
          // ➕ Append new doc (auto ID)
          await setDoc(
            doc(collection(db, collectionName)),
            {
              ...fields,
              createdAt: new Date(),
            },
            { merge: true }
          );
        }
      }

      setStatus("Upload complete ✅");
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow space-y-6">
      <h1 className="text-2xl font-bold">Populate Firestore (Dev Tool)</h1>

      <div className="space-y-2">
        <label className="text-sm font-medium">Collection Name</label>
        <input
          value={collectionName}
          onChange={(e) => setCollectionName(e.target.value)}
          placeholder="excess_energy / contracts / users"
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Excel File (.xlsx)</label>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          className="w-full"
        />
      </div>

      {status && (
        <p className="text-sm text-gray-600">
          {status}
        </p>
      )}

      <p className="text-xs text-gray-500">
        • Uses Excel headers as Firestore fields  
        • If document exists → updates fields  
        • If not → creates new  
        • Never deletes data
      </p>
    </div>
  );
}
