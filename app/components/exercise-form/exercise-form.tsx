import { fill } from "lodash"
import * as React from "react"
import { GestureResponderEvent, StyleProp, View, ViewStyle } from "react-native"
import { Button, ButtonGroup, Input } from "react-native-elements"

export interface ExerciseFormProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle

  numberOfWorkouts: number

  selectedIndex: number

  onButtonPress: (event: GestureResponderEvent) => void

  onExerciseNameTextChange: (text: string) => void

  onSetsTextChange: (text: string) => void

  onLowestRepetionTextChange: (text: string) => void

  onHighestRepetionTextChange: (text: string) => void

  onWorkoutDayButtonPress: (selectedIndex: number) => void

  confirmationButtonText: string
}

/**
 * Stateless functional component for your needs
 *
 * Component description here for TypeScript tips.
 */
export function ExerciseForm(props: ExerciseFormProps) {
  const {
    style,
    confirmationButtonText,
    onButtonPress,
    onExerciseNameTextChange,
    onSetsTextChange,
    onLowestRepetionTextChange,
    onHighestRepetionTextChange,
    numberOfWorkouts,
    selectedIndex,
    onWorkoutDayButtonPress,
  } = props
  const viewStyle: StyleProp<ViewStyle> = {
    ...style,
    display: "flex",
    justifyContent: "space-evenly",
    height: 500,
  }
  const dayButtons = fill(new Array<string>(numberOfWorkouts), "").map((value, index: number) => {
    return (index + 1).toString()
  })

  return (
    <View style={viewStyle}>
      <ButtonGroup
        buttons={dayButtons}
        selectedIndex={selectedIndex}
        onPress={onWorkoutDayButtonPress}
      />
      <Input placeholder={"Exercise's name"} onChangeText={onExerciseNameTextChange} />
      <Input placeholder={"Sets"} keyboardType="decimal-pad" onChangeText={onSetsTextChange} />
      <Input
        placeholder={"Lowest repetion"}
        keyboardType="number-pad"
        onChangeText={onLowestRepetionTextChange}
      />
      <Input
        placeholder={"Highest repetion"}
        keyboardType="number-pad"
        onChangeText={onHighestRepetionTextChange}
      />
      <Button
        buttonStyle={{ width: "50%", alignSelf: "center" }}
        title={confirmationButtonText}
        onPress={onButtonPress}
      />
    </View>
  )
}
