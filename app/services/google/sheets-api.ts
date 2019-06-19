import { ApisauceInstance, create } from "apisauce"
import { get } from "lodash"
import { Program } from "../../models/program"
import { Workload } from "../../models/workload"
import { Workout } from "../../models/workout"

enum GoogleApisBaseUrls {
  googleApi = "https://www.googleapis.com",
  sheetsApi = "https://sheets.googleapis.com",
}

export const ScopesNeeded = ["https://www.googleapis.com/auth/drive.file"]

export class SheetsApi {
  private api: ApisauceInstance

  constructor(accessToken: string) {
    this.api = create({
      baseURL: "",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
  }

  public async writeProgramHeader(program: Program, spreadsheetId: string) {
    this.api.setBaseURL(GoogleApisBaseUrls.sheetsApi)
    const path = `/v4/spreadsheets/${spreadsheetId}/values/program${program.id}!A1:append`
    const queryPath = `${path}?valueInputOption=RAW&insertDataOption=OVERWRITE&includeValuesInResponse=false`

    //list for weeks placeholder
    const weeksValues = new Array(program.duration) // +1 is for the day
    for (let i = 0; i < program.duration; i++) {
      weeksValues[i] = [`w${i + 1}`]
    }

    const daysHeaderContent = Array.from(program.workouts.values()).reduce((acc, workout) => {
      const dayHeader = this.buildDayHeader(workout, weeksValues)
      acc.push(...dayHeader)
      return acc
    }, Array<Array<string>>())

    // This promises always fulfills
    const response = await this.api.post(queryPath, {
      majorDimension: "ROWS",
      values: daysHeaderContent,
    })
    if (!response.ok) {
      throw new Error(response.problem)
    }
  }

  private buildDayHeader(workout: Workout, weekValues: string[][]): string[][] {
    const exercices = workout.exercicies

    //list with exercise names
    const exerciseNames = exercices.map(exercise => exercise.name)

    //list with exercise sets
    const exerciseSets = exercices.map(exercise => exercise.sets.join(","))

    // list with exercise repetions
    const exerciseReps = exercices.map(exercice => exercice.repetionRange.join("-"))

    return [
      [`Day ${workout.day}`, ...exerciseNames],
      ["Sets", ...exerciseSets],
      ["Reps", ...exerciseReps],
      ...weekValues,
    ]
  }

  public async writeWorkload(workload: Workload, spreadsheetId: string): Promise<void> {
    this.api.setBaseURL(GoogleApisBaseUrls.sheetsApi)
    const exerciseColumn = String.fromCharCode("B".charCodeAt(0) + workload.exerciseIndex)
    const weekRow = 7 * workload.day - 4 + workload.week
    const path = `/v4/spreadsheets/${spreadsheetId}/values/program${
      workload.programId
    }!${exerciseColumn}${weekRow}:append`
    const queryPath = `${path}?valueInputOption=RAW&insertDataOption=OVERWRITE&includeValuesInResponse=false`

    // This promises always fulfills
    const response = await this.api.post(queryPath, {
      majorDimension: "ROWS",
      values: [[workload.compressWorkloads()]],
    })
    if (!response.ok) {
      throw new Error(response.problem)
    }
  }

  public async getOrCreateSpreadSheet(): Promise<string> {
    this.api.setBaseURL(GoogleApisBaseUrls.googleApi)
    const path = "/drive/v3/files"
    // This promises always fulfills
    const response = await this.api.get<string>(path, {
      pageSize: 1,
      fields: "files(id)",
      spaces: "drive",
    })
    if (response.ok) {
      const spreadsheetId = get(response.data, "files[0].id")
      if (!spreadsheetId) {
        try {
          return await this.createSpreadSheet()
        } catch (error) {
          throw error
        }
      }
      return spreadsheetId
    } else throw new Error(response.problem)
  }

  private async createSpreadSheet(): Promise<string> {
    this.api.setBaseURL(GoogleApisBaseUrls.sheetsApi)
    const path = "/v4/spreadsheets"
    // This promises always fulfills
    const response = await this.api.post(path, {
      properties: {
        title: "Circle Program",
      },
    })
    if (response.ok) {
      return response.data["spreadsheetId"]
    }
    throw Error(response.data as string)
  }
}
