import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { Exercise, ExerciseModel } from "../exercise"

/**
 * Model description here for TypeScript hints.
 */
export const WorkoutModel = types
  .model("Workout")
  .props({
    day: types.number,
    exercicies: types.array(ExerciseModel),
  })
  .views(self => ({}))
  .actions(self => ({
    addExercicies(exerice: Exercise) {
      self.exercicies.push(exerice)
    },
  }))

type WorkoutType = Instance<typeof WorkoutModel>
export interface Workout extends WorkoutType {}
type WorkoutSnapshotType = SnapshotOut<typeof WorkoutModel>
export interface WorkoutSnapshot extends WorkoutSnapshotType {}
