import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const WorkloadModel = types
  .model("Workload")
  .props({
    day: types.number,
    week: types.number,
    exerciseIndex: types.number,
    programId: types.number,
    workloads: types.map(types.array(types.integer)), // Know issues is repetions must linear function
  })
  .views(self => ({
    compressWorkloads(): string {
      return Array.from(self.workloads.entries())
        .map(entry => `${entry[0]}x${entry[1].join(",")}`)
        .join(" / ")
    },
  }))
  .actions(self => ({
    addWorkload(weight: number, repetion: number) {
      const currentWorkloadForWeight = self.workloads.get(weight.toString()) || []
      self.workloads.set(weight.toString(), [...currentWorkloadForWeight, repetion])
    },
  }))

type WorkloadType = Instance<typeof WorkloadModel>
export interface Workload extends WorkloadType {}
type WorkloadSnapshotType = SnapshotOut<typeof WorkloadModel>
export interface WorkloadSnapshot extends WorkloadSnapshotType {}
