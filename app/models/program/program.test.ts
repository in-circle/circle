import { ProgramModel, Program } from "./program"

test("can be created", () => {
  const instance: Program = ProgramModel.create({})

  expect(instance).toBeTruthy()
})