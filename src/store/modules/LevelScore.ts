import store from "../"
import { Module, VuexModule, Mutation, Action, getModule } from "vuex-module-decorators"

@Module({ dynamic: true, store, name: "levelscore" })
class LevelScore extends VuexModule {
  private deletedLinesSum: number = 0
  private level: number = 0
  private score: number = 0

  @Mutation
  private INCREMENT_DELETED_LINES(linesNum: number): void {
    this.deletedLinesSum += linesNum
  }

  @Mutation
  private SET_CALCULATED_LEVEL(): void {
    this.level = Math.floor(this.deletedLinesSum / 10)
  }

  @Mutation
  private ADD_SCORE(linesNum: number): void {
    const basePointTable: { [n: number]: number } = {
      1: 40,
      2: 100,
      3: 300,
      4: 1200
    }
    this.score += basePointTable[linesNum] * (this.level + 1)
  }

  @Action
  public deleteLines(linesNum: number): void {
    this.ADD_SCORE(linesNum)
    this.INCREMENT_DELETED_LINES(linesNum)
    this.SET_CALCULATED_LEVEL()
  }

  public get currentLevel(): number {
    return this.level
  }

  public get currentScore(): number {
    return this.score
  }

  public get dropIntervalMs(): number {
    const frame: number = 1000 / 60

    return Math.max(
      1000 - 5 * this.level * frame,
      (5 - Math.floor((this.level - 11) / 2)) * frame,
      frame
    )
  }
}

export const levelScoreModule = getModule(LevelScore)
