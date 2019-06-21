export interface WriteProgramHeaderRequestExercise {
  name: string
  sets: number[]
  lowestRepetionRange: number
  highestRepetionRange: number
}

export interface WriteProgramHeaderRequestWorkout {
  day: number
  exercises: WriteProgramHeaderRequestExercise[]
}

export interface WriteProgramHeaderRequest {
  programId: string
  durationInWeeks: number
  workouts: WriteProgramHeaderRequestWorkout[]
  spreadSheetId: string
}

export interface WriteExerciseWorkloadRequestWorkload {
  weight: number
  repetions: number
}

export interface WriteExerciseWorkloadsRequest {
  day: number
  weeek: number
  programId: string
  exerciseNumber: number
  workloads: WriteExerciseWorkloadRequestWorkload[]
  spreadsheetId: string
}
