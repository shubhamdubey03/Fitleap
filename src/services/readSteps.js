import {
  initialize,
  requestPermission,
  aggregateRecord,
  getGrantedPermissions
} from 'react-native-health-connect';

let isInitialized = false;

/**
 * Initialize Health Connect
 */
export const initHealth = async () => {
  if (isInitialized) return true;

  try {
    const success = await initialize();

    if (success) {
      isInitialized = true;
      console.log("✅ Health Connect initialized");
    } else {
      console.log("❌ Health Connect not available");
    }

    return success;
  } catch (e) {
    console.error("❌ Health Connect init error:", e);
    return false;
  }
};

/**
 * Request permission safely
 */
export const requestStepsPermission = async () => {
  try {
    const result = await requestPermission([
      { recordType: 'Steps', accessType: 'read' },
    ]);

    console.log("✅ Permission result:", result);
    return true;

  } catch (e) {
    console.error("❌ Permission request error:", e);
    return false;
  }
};

/**
 * Get today's steps safely
 */
export const getTodaySteps = async () => {
  try {
    // ✅ Step 1: Init
    if (!isInitialized) {
      const success = await initHealth();
      if (!success) return 0;
    }

    // ✅ Step 2: Check permission
    const granted = await getGrantedPermissions();

    if (!Array.isArray(granted)) {
      console.log("❌ Invalid permission response:", granted);
      return 0;
    }

    const hasPermission = granted.some(
      (p) => p.recordType === 'Steps' && p.accessType === 'read'
    );

    if (!hasPermission) {
      console.log("❌ Steps permission not granted");
      return 0;
    }

    // ✅ Step 3: Time range
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const now = new Date();

    // ✅ Step 4: Fetch steps
    const result = await aggregateRecord({
      recordType: 'Steps',
      timeRangeFilter: {
        operator: 'between',
        startTime: startOfDay.toISOString(),
        endTime: now.toISOString(),
      },
    });

    console.log("📊 Raw Steps Result:", result);

    // ✅ Step 5: Safe return
    if (!result) return 0;

    // Different versions return different keys
    return result?.COUNT_TOTAL ?? result?.STEPS_TOTAL ?? 0;

  } catch (e) {
    console.error("❌ Fetch steps error:", e);
    return 0;
  }
};