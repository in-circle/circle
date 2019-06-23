import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { WorkloadModel } from "../workload"

/**
 * Model description here for TypeScript hints.
 */
export const ExerciseModel = types
  .model("Exercise")
  .props({
    name: types.string,
    sets: types.array(types.number),
    repetionRange: types.array(types.number),
    weeksWorkloads: types.array(types.array(WorkloadModel)),
  })
  .views(self => ({}))
  .actions(self => ({
    addWorkload(weekNumber: number, weightLifted: number, repetions: number) {
      if (weekNumber < self.weeksWorkloads.length) {
        self.weeksWorkloads[weekNumber].push(
          WorkloadModel.create({
            weight: weightLifted,
            repetitions: repetions,
          }),
        )
      }
    },
  }))

type ExerciseType = Instance<typeof ExerciseModel>
export interface Exercise extends ExerciseType {}
type ExerciseSnapshotType = SnapshotOut<typeof ExerciseModel>
export interface ExerciseSnapshot extends ExerciseSnapshotType {}
