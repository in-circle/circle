import { WorkloadModel, Workload } from "./workload"

test("can be created", () => {
  const instance: Workload = WorkloadModel.create({})

  expect(instance).toBeTruthy()
})