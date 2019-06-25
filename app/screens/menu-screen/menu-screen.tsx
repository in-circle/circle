import { inject, observer } from "mobx-react"
import * as React from "react"
import { View, ViewStyle } from "react-native"
import { Button } from "react-native-elements"
import { NavigationScreenProps } from "react-navigation"
import { ExerciseForm } from "../../components/exercise-form"
import { ProgramForm } from "../../components/program-form"
import { Screen } from "../../components/screen"
import { CircleUser } from "../../models/circle-user"
import { RootStore } from "../../models/root-store"
import { color } from "../../theme"

export interface MenuScreenProps extends NavigationScreenProps<{}> {
  rootStore?: RootStore
}

interface ProgramState {
  programId: number
  weeksInDuration: number
  numberOfWorkouts: number
}

interface ExerciseState {
  exerciseName: string
  sets: number[]
  lowestRepetion: number
  highestRepetion: number
  workoutDay: number
}

interface MenuScreenState {
  showProgramForm: boolean
  showExerciseForm: boolean
  programState: ProgramState
  exerciseState: ExerciseState
}

const ROOT: ViewStyle = {
  backgroundColor: color.primary,
}

@inject("rootStore")
@observer
export class MenuScreen extends React.Component<MenuScreenProps, MenuScreenState> {
  state = {
    showProgramForm: false,
    showExerciseForm: false,
    hasProgram: false,
    programState: {
      programId: 0,
      weeksInDuration: 0,
      numberOfWorkouts: 0,
    },
    exerciseState: {
      exerciseName: "",
      sets: [],
      lowestRepetion: 0,
      highestRepetion: 0,
      workoutDay: 0,
    },
  }

  private get circleUser(): CircleUser {
    return this.props.rootStore!.circleUser
  }

  private get userHasProgram(): boolean {
    return this.circleUser.program !== undefined
  }

  render() {
    const noFormIsShowing = !(this.state.showProgramForm || this.state.showExerciseForm)

    return (
      <Screen style={ROOT} preset="fixedCenter">
        <View style={{ display: "flex", justifyContent: "space-between", height: "20%" }}>
          {noFormIsShowing &&
            !this.userHasProgram && (
              <Button title="Add Program" onPress={this.onAddProgramButtonClick} />
            )}
          {noFormIsShowing &&
            this.userHasProgram && (
              <Button title="Add Exercise" onPress={this.onAddExerciseButtonClick} />
            )}
        </View>
        {this.state.showProgramForm && (
          <ProgramForm
            onButtonPress={this.onProgramFormButtonPress}
            onProgramIdTextChange={this.onProgramFormProgramIdTextChange}
            onDurationInWeeksTextChange={this.onProgramFormWeeksInDurationTextChange}
            onNumberOfWorkoutsTextChange={this.onProgramFormNumberOfWorkoutsTextChange}
            confirmationButtonText="Create"
            style={{ width: "100%" }}
          />
        )}
        {this.state.showExerciseForm && (
          <ExerciseForm
            style={{ width: "100%" }}
            numberOfWorkouts={this.state.programState.numberOfWorkouts}
            confirmationButtonText={"Create"}
            onButtonPress={this.onExerciseFormButtonPress}
            onExerciseNameTextChange={this.onExerciseFormExerciseNameTextChange}
            onLowestRepetionTextChange={this.onExerciseFormLowestRepetionTextChange}
            onHighestRepetionTextChange={this.onExerciseFormHighestRepetionTextChange}
            onSetsTextChange={this.onExerciseFormSetsTextChange}
            selectedIndex={this.state.exerciseState.workoutDay}
            onWorkoutDayButtonPress={this.onExerciseFormWorkoutDayButtonPress}
          />
        )}
      </Screen>
    )
  }

  private changeShowProgramFormVisibility = (visibility: boolean) => {
    this.setState({ showProgramForm: visibility })
  }

  private changeShowExerciseFormVisibility = (visibility: boolean) => {
    this.setState({ showExerciseForm: visibility })
  }

  private onAddProgramButtonClick = () => {
    this.changeShowExerciseFormVisibility(false)
    this.changeShowProgramFormVisibility(true)
  }

  private onAddExerciseButtonClick = () => {
    this.changeShowExerciseFormVisibility(true)
    this.changeShowProgramFormVisibility(false)
  }

  private onProgramFormButtonPress = () => {
    const { programId, weeksInDuration } = this.state.programState
    this.circleUser.addProgram(programId, weeksInDuration)
    this.changeShowProgramFormVisibility(false)
  }

  private onProgramFormProgramIdTextChange = (text: string) => {
    const currentProgram = this.state.programState
    this.setState({ programState: { ...currentProgram, programId: parseInt(text) } })
  }

  private onProgramFormWeeksInDurationTextChange = (text: string) => {
    const currentProgram = this.state.programState
    this.setState({ programState: { ...currentProgram, weeksInDuration: parseInt(text) } })
  }

  private onProgramFormNumberOfWorkoutsTextChange = (text: string) => {
    const currentProgram = this.state.programState
    this.setState({ programState: { ...currentProgram, numberOfWorkouts: parseInt(text) } })
  }

  private onExerciseFormButtonPress = () => {
    const {
      exerciseName,
      workoutDay,
      sets,
      lowestRepetion,
      highestRepetion,
    } = this.state.exerciseState
    this.circleUser.program.addExerciseToDay(
      workoutDay,
      exerciseName,
      sets,
      lowestRepetion,
      highestRepetion,
    )
    this.changeShowExerciseFormVisibility(false)
  }

  private onExerciseFormExerciseNameTextChange = (text: string) => {
    const currentExercise = this.state.exerciseState
    this.setState({ exerciseState: { ...currentExercise, exerciseName: text } })
  }

  private onExerciseFormSetsTextChange = (text: string) => {
    const currentExercise = this.state.exerciseState
    const sets = text.split(",").map(value => parseInt(value))
    this.setState({ exerciseState: { ...currentExercise, sets } })
  }

  private onExerciseFormLowestRepetionTextChange = (text: string) => {
    const currentExercise = this.state.exerciseState
    this.setState({ exerciseState: { ...currentExercise, lowestRepetion: parseInt(text) } })
  }

  private onExerciseFormHighestRepetionTextChange = (text: string) => {
    const currentExercise = this.state.exerciseState
    this.setState({ exerciseState: { ...currentExercise, highestRepetion: parseInt(text) } })
  }

  private onExerciseFormWorkoutDayButtonPress = (selectedIndex: number) => {
    const currentExercise = this.state.exerciseState
    this.setState({ exerciseState: { ...currentExercise, workoutDay: selectedIndex } })
  }
}
