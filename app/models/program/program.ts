import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { WorkoutModel } from "../workout"

/**
 * Model description here for TypeScript hints.
 */
export const ProgramModel = types
  .model("Program")
  .props({
    id: types.identifierNumber,
    duration: types.number,
    workouts: types.map(WorkoutModel),
  })
  .views(self => ({
    getWorkoutForDay(day: number) {
      return self.workouts.get(day.toString())
    },
  }))
  .actions(self => ({
    addWorkout(day: number) {
      self.workouts.set(
        day.toString(),
        WorkoutModel.create({
          day: day,
          numberOfWeeks: self.duration,
          exercicies: [],
        }),
      )
    },
    addExerciseToDay(
      day: number,
      exerciseName: string,
      exerciseSets: number[],
      lowestRepetion: number,
      highestRepetion: number,
    ) {
      const workoutForDay = self.getWorkoutForDay(day)
      if (workoutForDay) {
        workoutForDay.addExercise(exerciseName, exerciseSets, lowestRepetion, highestRepetion)
      }
    },
    reportWorkloadToDay(
      day: number,
      exerciseName: string,
      week: number,
      weight: number,
      repetions: number,
    ) {
      const workoutForDay = self.getWorkoutForDay(day)
      if (workoutForDay) {
        const exercise = workoutForDay.getExerciseByName(exerciseName)
        if (exercise) {
          exercise.addWorkload(week, weight, repetions)
        }
      }
    },
  }))

type ProgramType = Instance<typeof ProgramModel>
export interface Program extends ProgramType {}
type ProgramSnapshotType = SnapshotOut<typeof ProgramModel>
export interface ProgramSnapshot extends ProgramSnapshotType {}
