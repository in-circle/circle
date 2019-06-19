import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const ExerciseModel = types
  .model("Exercise")
  .props({
    name: types.string,
    sets: types.array(types.number),
    repetionRange: types.array(types.number),
  })
  .views(self => ({}))
  .actions(self => ({}))

type ExerciseType = Instance<typeof ExerciseModel>
export interface Exercise extends ExerciseType {}
type ExerciseSnapshotType = SnapshotOut<typeof ExerciseModel>
export interface ExerciseSnapshot extends ExerciseSnapshotType {}
