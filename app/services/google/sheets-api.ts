import { ApisauceInstance, create } from "apisauce"
import { get } from "lodash"
import {
  WriteExerciseWorkloadRequestWorkload,
  WriteExerciseWorkloadsRequest,
  WriteProgramHeaderRequest,
  WriteProgramHeaderRequestWorkout,
} from "./sheets-models"

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

  public async writeProgramHeader(request: WriteProgramHeaderRequest) {
    this.api.setBaseURL(GoogleApisBaseUrls.sheetsApi)
    const path = `/v4/spreadsheets/${request.spreadSheetId}/values/program${
      request.programId
    }!A1:append`
    const queryPath = `${path}?valueInputOption=RAW&insertDataOption=OVERWRITE&includeValuesInResponse=false`

    //list for weeks placeholder
    const weeksValues = new Array(request.durationInWeeks).map((_, index) => {
      return [`w${index + 1}`]
    })

    const daysHeaderContent = request.workouts.reduce((acc, workout) => {
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

  private buildDayHeader(
    workout: WriteProgramHeaderRequestWorkout,
    weekValues: string[][],
  ): string[][] {
    const exercises = workout.exercises

    //list with exercise names
    const exerciseNames = exercises.map(exercise => exercise.name)

    //list with exercise sets
    const exerciseSets = exercises.map(exercise => exercise.sets.join(","))

    // list with exercise repetions
    const exerciseReps = exercises.map(
      exercise => `${exercise.lowestRepetionRange}-${exercise.highestRepetionRange}`,
    )

    return [
      [`Day ${workout.day}`, ...exerciseNames],
      ["Sets", ...exerciseSets],
      ["Reps", ...exerciseReps],
      ...weekValues,
    ]
  }

  public async writeExerciseWorkloads(request: WriteExerciseWorkloadsRequest): Promise<void> {
    this.api.setBaseURL(GoogleApisBaseUrls.sheetsApi)
    const exerciseColumn = String.fromCharCode("B".charCodeAt(0) + request.exerciseNumber)
    const weekRow = 7 * request.day - 4 + request.weeek
    const path = `/v4/spreadsheets/${request.spreadsheetId}/values/program${
      request.programId
    }!${exerciseColumn}${weekRow}:append`
    const queryPath = `${path}?valueInputOption=RAW&insertDataOption=OVERWRITE&includeValuesInResponse=false`

    // This promises always fulfills
    const response = await this.api.post(queryPath, {
      majorDimension: "ROWS",
      values: [[this.buildWorkloadData(request.workloads)]],
    })
    if (!response.ok) {
      throw new Error(response.problem)
    }
  }

  private buildWorkloadData(workloads: WriteExerciseWorkloadRequestWorkload[]): string {
    const weightOrder: Array<number> = []
    const liftAggregations: Map<number, Array<number>> = new Map()
    workloads.forEach(workloads => {
      const { weight, repetions } = workloads
      const currentIndex = weightOrder.length - 1
      if (currentIndex === -1 || weightOrder[weightOrder.length - 1] !== weight) {
        weightOrder.push(weight)
        liftAggregations.set(currentIndex + 1, [repetions])
      } else {
        const cur = liftAggregations.get(currentIndex)
        liftAggregations.set(currentIndex, [...cur, repetions])
      }
    })
    return weightOrder
      .reduce((acc, weight, index) => {
        const liftsFormatted = liftAggregations
          .get(index)
          .map(value => value.toString())
          .join(",")
        acc.push(`${weight}x${liftsFormatted}`)
        return acc
      }, new Array<string>())
      .join(" / ")
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
