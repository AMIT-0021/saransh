/**
 * LocalStorage Offline Queue Buffer for Saransh
 * Allows offline intake and automatic synchronization with the backend when connection is restored.
 */

const STORAGE_KEY = "saransh_offline_queue_records";
const TOKEN_KEY = "saransh_offline_token_counter";

export function getOfflineQueue() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Error reading offline queue from localStorage", e);
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
    record.patient_basic_info.token_number = offlineToken;
    record.is_offline_cached = true;

    current.unshift(record);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    return record;
  } catch (e) {
    console.error("Error saving offline record", e);
    return record;
  }
}

export function getOfflinePendingCount() {
  return getOfflineQueue().length;
}

export function clearOfflineQueue() {
  localStorage.removeItem(STORAGE_KEY);
}

export async function syncOfflineQueueWithBackend(backendUrl = "http://localhost:8000") {
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

  localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
  return { synced, failed, remainingCount: remaining.length };
}
