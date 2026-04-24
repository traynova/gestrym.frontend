export const PROGRESS_ENDPOINTS = {
  // 1. Metrics
  CREATE_METRIC: '/private/metrics',
  GET_USER_METRICS: (userId: number | string) => `/private/metrics/user/${userId}`,
  GET_USER_CHART: (userId: number | string) => `/private/metrics/user/${userId}/chart`,

  // 2. Photos
  UPLOAD_PHOTO: '/private/photos',
  GET_USER_PHOTOS: (userId: number | string) => `/private/photos/user/${userId}`,

  // 3. Comparison
  GET_USER_COMPARISON: (userId: number | string) => `/private/comparison/user/${userId}`,

  // 4. Workout Progress
  CREATE_WORKOUT_PROGRESS: '/private/workout-progress',
  GET_USER_WORKOUT_PROGRESS: (userId: number | string) => `/private/workout-progress/user/${userId}`,

  // 5. Trainer Notes
  CREATE_NOTE: '/private/notes',
  GET_USER_NOTES: (userId: number | string) => `/private/notes/user/${userId}`,
};
