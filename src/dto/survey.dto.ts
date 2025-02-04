export const createSurveyDTO = (body: any) => {
  return {
    userId: body.userId,
    goal: body.goal,
    meals: body.meals.join(","),
    allergy: body.allergy,
    allergyDetails: body.allergyDetails,
    healthCondition: body.healthCondition,
    gender: body.gender,
    birthYear: body.birthYear,
    height: body.height,
    currentWeight: body.currentWeight,
    targetWeight: body.targetWeight,
    exerciseFrequency: body.exerciseFrequency,
    job: body.job,
  };
};
