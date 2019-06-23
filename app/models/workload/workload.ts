import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const WorkloadModel = types
  .model("Workload")
  .props({
    weight: types.number,
    repetitions: types.number,
  })
  .views(self => ({}))
  .actions(self => ({}))

type WorkloadType = Instance<typeof WorkloadModel>
export interface Workload extends WorkloadType {}
type WorkloadSnapshotType = SnapshotOut<typeof WorkloadModel>
export interface WorkloadSnapshot extends WorkloadSnapshotType {}
