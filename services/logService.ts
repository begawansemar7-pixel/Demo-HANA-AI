export interface AuditorDetails {
  lph: string;
  contact: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  auditorName: string;
  timestamp: string;
  entityType?: string;
  entityId?: string;
  details?: { [key: string]: any };
  auditorDetails?: AuditorDetails;
}

const LOG_STORAGE_KEY = 'auditLogs';

/**
 * Retrieves all audit logs from localStorage.
 * @returns An array of audit log entries, sorted with the newest first.
 */
export const getAuditLogs = (): AuditLogEntry[] => {
  try {
    const savedLogs = localStorage.getItem(LOG_STORAGE_KEY);
    return savedLogs ? JSON.parse(savedLogs) : [];
  } catch (error) {
    console.error("Error reading audit logs from localStorage:", error);
    return [];
  }
};

/**
 * Adds a new audit log entry.
 * @param action A description of the action performed.
 * @param auditorName The name of the auditor who performed the action.
 * @param context Additional context about the action.
 * @param auditorDetails Detailed information about the auditor.
 */
export const addAuditLog = (
  action: string,
  auditorName: string,
  context?: {
    entityType?: string;
    entityId?: string;
    details?: { [key: string]: any };
  },
  auditorDetails?: AuditorDetails
): void => {
  if (!action || !auditorName) return;

  try {
    const logs = getAuditLogs();
    const newLog: AuditLogEntry = {
      id: Date.now().toString(),
      action,
      auditorName,
      timestamp: new Date().toISOString(),
      ...context,
      auditorDetails,
    };
    
    // Add the new log to the beginning of the array
    const updatedLogs = [newLog, ...logs];
    
    localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(updatedLogs));
  } catch (error) {
    console.error("Error saving audit log to localStorage:", error);
  }
};


/**
 * Clears all audit logs from localStorage.
 */
export const clearAuditLogs = (): void => {
  try {
    localStorage.removeItem(LOG_STORAGE_KEY);
// FIX: The catch block was malformed. Added curly braces and removed extra characters to fix the syntax error.
  } catch (error) {
    console.error("Error clearing audit logs from localStorage:", error);
  }
};