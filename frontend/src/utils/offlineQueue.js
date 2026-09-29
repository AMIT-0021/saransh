/**
 * IndexedDB & LocalStorage Hybrid Offline Queue Buffer for Saransh (सारांश)
 * Ensures robust offline intake resilience with zero unhandled promise crashes.
 */

const STORAGE_KEY = "saransh_offline_queue_records";
const TOKEN_KEY = "saransh_offline_token_counter";
const DB_NAME = "saransh_offline_db";
const DB_VERSION = 1;
const STORE_NAME = "intakes";

// Helper to safely open IndexedDB
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      return reject(new Error("IndexedDB not supported"));
    }
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "token_number" });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("Failed to open IndexedDB"));
    } catch (err) {
      reject(err);
    }
  });
}

// Write to IndexedDB safely without crashing
async function writeToIndexedDB(record) {
  try {
    const db = await openIndexedDB();
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        store.put(record);
        tx.oncomplete = () => {
          db.close();
          resolve(true);
        };
        tx.onerror = () => {
          db.close();
          resolve(false);
        };
      } catch (_) {
        resolve(false);
      }
    });
  } catch (err) {
    // Graceful fallback to localStorage
    return false;
  }
}

export function getOfflineQueue() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("Error reading offline queue from localStorage:", e);
    return [];
  }
}

export function saveOfflineRecord(record) {
  try {
    const current = getOfflineQueue();
    // Get next offline token
    let counter = parseInt(localStorage.getItem(TOKEN_KEY) || "1", 10);
    const offlineToken = `OFF-T-${String(counter).padStart(3, "0")}`;
    localStorage.setItem(TOKEN_KEY, String(counter + 1));

    record.token_number = offlineToken;
    if (record.patient_basic_info) {
      record.patient_basic_info.token_number = offlineToken;
    }
    record.is_offline_cached = true;
    record.cached_at = new Date().toISOString();

    // 1. Synchronously persist to LocalStorage
    current.unshift(record);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));

    // 2. Asynchronously mirror into IndexedDB (fire-and-forget safe)
    writeToIndexedDB(record).catch(() => {});

    return record;
  } catch (e) {
    console.warn("Error saving offline record:", e);
    return record;
  }
}

export async function saveOfflineRecordAsync(record) {
  const saved = saveOfflineRecord(record);
  await writeToIndexedDB(saved).catch(() => {});
  return saved;
}

export function getOfflinePendingCount() {
  return getOfflineQueue().length;
}

export function clearOfflineQueue() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    openIndexedDB().then((db) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).clear();
      tx.oncomplete = () => db.close();
    }).catch(() => {});
  } catch (e) {
    console.warn("Error clearing offline queue:", e);
  }
}

export async function syncOfflineQueueWithBackend(backendUrl = ((typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_BACKEND_URL) ? import.meta.env.VITE_BACKEND_URL : (import.meta.env.DEV ? "http://localhost:8000" : ""))) {
  const queue = getOfflineQueue();
  if (queue.length === 0) return { synced: 0, failed: 0 };

  let synced = 0;
  let failed = 0;
  const remaining = [];

  for (const item of queue) {
    try {
      const payload = {
        patient_basic_info: item.patient_basic_info,
        symptoms_and_complaints: item.symptoms_and_complaints,
        vital_signs: item.vital_signs,
        medical_history: item.medical_history,
        uploaded_reports: item.uploaded_reports || [],
        visual_inputs: item.visual_inputs || [],
        red_flag_checklist: item.red_flag_checklist || {}
      };

      const res = await fetch(`${backendUrl}/api/v1/triage/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        synced++;
      } else {
        remaining.push(item);
        failed++;
      }
    } catch (err) {
      remaining.push(item);
      failed++;
    }
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
  } catch (e) {
    console.warn("Error updating offline queue after sync:", e);
  }
  return { synced, failed, remainingCount: remaining.length };
}
