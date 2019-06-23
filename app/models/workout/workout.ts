import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { ExerciseModel } from "../exercise"
import { Workload } from "../workload"

/**
 * Model description here for TypeScript hints.
 */
export const WorkoutModel = types
  .model("Workout")
  .props({
    day: types.number,
    numberOfWeeks: types.number,
    exercicies: types.array(ExerciseModel),
  })
  .views(self => ({
    getExerciseByName(name: string) {
      return self.exercicies.find(exercise => {
        return exercise.name === name
      })
    },
  }))
  .actions(self => ({
    addExercise(
      exerciseName: string,
      exerciseSets: number[],
      lowestRepetion: number,
      highestRepetion: number,
    ) {
      self.exercicies.push(
        ExerciseModel.create({
          name: exerciseName,
          sets: exerciseSets,
          repetionRange: [lowestRepetion, highestRepetion],
          weeksWorkloads: new Array<Array<Workload>>(self.numberOfWeeks),
        }),
      )
    },
  }))

type WorkoutType = Instance<typeof WorkoutModel>
export interface Workout extends WorkoutType {}
type WorkoutSnapshotType = SnapshotOut<typeof WorkoutModel>
export interface WorkoutSnapshot extends WorkoutSnapshotType {}
