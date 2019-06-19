import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { Workout, WorkoutModel } from "../workout"

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
  .views(self => ({}))
  .actions(self => ({
    addWorkout(workout: Workout) {
      self.workouts.set(workout.day.toString(), workout)
    },
  }))

type ProgramType = Instance<typeof ProgramModel>
export interface Program extends ProgramType {}
type ProgramSnapshotType = SnapshotOut<typeof ProgramModel>
export interface ProgramSnapshot extends ProgramSnapshotType {}
