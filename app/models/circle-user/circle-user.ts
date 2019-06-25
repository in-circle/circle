import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { omit } from "ramda"
import { ProgramModel } from "../program"

/**
 * Model description here for TypeScript hints.
 */
export const CircleUserModel = types
  .model("CircleUser")
  .props({
    name: types.string,
    photo: types.maybe(types.string),
    accessToken: types.string,
    program: types.maybe(ProgramModel),
  })
  .views(self => ({}))
  .actions(self => ({
    addProgram(id: number, durationInWeeks: number) {
      self.program = ProgramModel.create({
        id: id,
        duration: durationInWeeks,
        workouts: {},
      })
    },
  }))
  .postProcessSnapshot(omit(["accessToken"]))

type CircleUserType = Instance<typeof CircleUserModel>
export interface CircleUser extends CircleUserType {}
type CircleUserSnapshotType = SnapshotOut<typeof CircleUserModel>
export interface CircleUserSnapshot extends CircleUserSnapshotType {}
