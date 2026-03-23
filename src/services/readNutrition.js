import {
  readRecords,
  getGrantedPermissions,
  requestPermission
} from 'react-native-health-connect';
import { initHealth } from './readSteps';

/**
 * Request nutrition permission
 */
export const requestNutritionPermission = async () => {
  try {
    const result = await requestPermission([
      { recordType: 'Nutrition', accessType: 'read' },
    ]);
    console.log("✅ Nutrition Permission result:", result);
    return true;
  } catch (e) {
    console.error("❌ Nutrition Permission request error:", e);
    return false;
  }
};

/**
 * Get nutrition records for today
 */
export const getTodayNutrition = async () => {
  try {
    // 1. Ensure Health Connect is initialized
    const initialized = await initHealth();
    if (!initialized) return null;

    // 2. Check if we have nutrition permission
    const granted = await getGrantedPermissions();
    const hasPermission = granted.some(
      (p) => p.recordType === 'Nutrition' && p.accessType === 'read'
    );

    if (!hasPermission) {
      console.log("❌ Nutrition permission NOT granted");
      return null;
    }

    // 3. Define time range (start of today to now)
    const startTime = new Date();
    startTime.setHours(0, 0, 0, 0);
    const endTime = new Date();

    // 4. Read Nutrition records
    const response = await readRecords('Nutrition', {
      timeRangeFilter: {
        operator: 'between',
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      },
    });

    if (!response || !response.records) {
      return { carbs: 0, protein: 0, fiber: 0, calories: 0, fat: 0 };
    }

    // 5. Aggregate logic
    let carbs = 0;
    let protein = 0;
    let fiber = 0;
    let fat = 0;
    let calories = 0;

    response.records.forEach((record) => {
      // Some versions nest under .nutrients, others are at top level
      const nutrients = record.nutrients || record;
      carbs += nutrients.totalCarbohydrate?.inGrams || 0;
      protein += nutrients.protein?.inGrams || 0;
      fiber += nutrients.dietaryFiber?.inGrams || 0;
      fat += nutrients.totalFat?.inGrams || 0;
      calories += record.energy?.inKilocalories || 0;
    });


    console.log("📊 Aggregated Nutrition:", { carbs, protein, fiber, fat, calories });

    return { carbs, protein, fiber, fat, calories };

  } catch (e) {
    console.error("❌ Fetch nutrition error:", e);
    return { carbs: 0, protein: 0, fiber: 0, calories: 0, fat: 0 };
  }
};
