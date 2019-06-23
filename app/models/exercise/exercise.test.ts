import { ExerciseModel, Exercise } from "./exercise"

test("can be created", () => {
  const instance: Exercise = ExerciseModel.create({})

  expect(instance).toBeTruthy()
})