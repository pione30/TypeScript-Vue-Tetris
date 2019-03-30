import store from "store"
import { Module, VuexModule, Mutation, Action, getModule } from "vuex-module-decorators"

@Module({ dynamic: true, store, name: "interval" })
class Interval extends VuexModule {
  private intervalID: number = 0

  public get getIntervalID(): number {
    return this.intervalID
  }

  @Mutation
  private SET_INTERVAL_ID(intervalID: number): void {
    this.intervalID = intervalID
  }

  @Mutation
  private CLEAR_INTERVAL_ID(): void {
    clearInterval(this.intervalID)
  }

  @Action
  public setIntervalID(intervalID: number): void {
    this.SET_INTERVAL_ID(intervalID)
  }

  @Action
  public clearIntervalID(): void {
    this.CLEAR_INTERVAL_ID()
  }
}

export const intervalModule = getModule(Interval)
