import {
  readRecords,
  getGrantedPermissions,
  requestPermission
} from 'react-native-health-connect';
import { initHealth } from './readSteps';

export const requestNutritionPermission = async () => {
  try {
    await requestPermission([
      { recordType: 'Nutrition', accessType: 'read' },
      { recordType: 'TotalCaloriesBurned', accessType: 'read' }, // ✅ ADD THIS
    ]);
    return true;
  } catch (e) {
    console.error("❌ Permission error:", e);
    return false;
  }
};

export const getTodayNutrition = async () => {
  try {
    const initialized = await initHealth();
    if (!initialized) return null;

    const startTime = new Date();
    startTime.setHours(0, 0, 0, 0);
    const endTime = new Date();

    // ✅ 1. GET CALORIES (MAIN FIX)
    const caloriesRes = await readRecords('TotalCaloriesBurned', {
      timeRangeFilter: {
        operator: 'between',
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      },
    });

    const totalCalories = caloriesRes.records.reduce(
      (sum, item) => sum + (item.energy?.inKilocalories || 0),
      0
    );

    // ✅ 2. GET NUTRITION (optional - may be empty)
    const nutritionRes = await readRecords('Nutrition', {
      timeRangeFilter: {
        operator: 'between',
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      },
    });

    let carbs = 0;
    let protein = 0;
    let fiber = 0;
    let fat = 0;

    nutritionRes.records.forEach((record) => {
      const nutrients = record.nutrients || record;
      carbs += nutrients.totalCarbohydrate?.inGrams || 0;
      protein += nutrients.protein?.inGrams || 0;
      fiber += nutrients.dietaryFiber?.inGrams || 0;
      fat += nutrients.totalFat?.inGrams || 0;
    });

    console.log("🔥 FINAL DATA:", {
      calories: totalCalories,
      carbs,
      protein,
      fiber,
      fat
    });

    return {
      calories: totalCalories,
      carbs,
      protein,
      fiber,
      fat
    };

  } catch (e) {
    console.error("❌ Fetch error:", e);
    return { carbs: 0, protein: 0, fiber: 0, calories: 0, fat: 0 };
  }
};