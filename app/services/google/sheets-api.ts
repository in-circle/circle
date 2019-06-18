import { ApisauceInstance, create } from "apisauce"
import { get } from "lodash"

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

  public async writeDayWorkHeader(
    day: number,
    weeks: number,
    programNumber: number,
    exercices: string[],
    spreadsheetId: string,
  ): Promise<void> {
    this.api.setBaseURL(GoogleApisBaseUrls.sheetsApi)
    const path = `/v4/spreadsheets/${spreadsheetId}/values/program${programNumber}!A1:append`
    const queryPath = `${path}?valueInputOption=RAW&insertDataOption=OVERWRITE&includeValuesInResponse=false`
    const weeksValues = new Array(weeks) // +1 is for the day
    for (let i = 0; i < weeks; i++) {
      weeksValues[i] = [`w${i + 1}`]
    }
    // This promises always fulfills
    const response = await this.api.post(queryPath, {
      majorDimension: "ROWS",
      values: [[`Day ${day}`, ...exercices], ["Sets"], ["Reps"], ...weeksValues],
    })
    if (!response.ok) {
      throw new Error(response.problem)
    }
  }

  public async writeWorkout(
    day: number,
    week: number,
    programNumber: number,
    workloads: string[],
    spreadsheetId: string,
  ): Promise<void> {
    this.api.setBaseURL(GoogleApisBaseUrls.sheetsApi)
    const weekRow = 7 * day - 4 + week
    const path = `/v4/spreadsheets/${spreadsheetId}/values/program${programNumber}!B${weekRow}:append`
    const queryPath = `${path}?valueInputOption=RAW&insertDataOption=OVERWRITE&includeValuesInResponse=false`
    // This promises always fulfills
    const response = await this.api.post(queryPath, {
      majorDimension: "ROWS",
      values: [workloads],
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
