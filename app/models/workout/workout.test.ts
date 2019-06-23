import { WorkoutModel, Workout } from "./workout"

test("can be created", () => {
  const instance: Workout = WorkoutModel.create({})

  expect(instance).toBeTruthy()
})