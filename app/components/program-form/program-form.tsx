import * as React from "react"
import { GestureResponderEvent, StyleProp, View, ViewStyle } from "react-native"
import { Button, Input } from "react-native-elements"

export interface ProgramFormProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle

  onButtonPress: (event: GestureResponderEvent) => void

  onProgramIdTextChange: (text: string) => void

  onDurationInWeeksTextChange: (text: string) => void

  onNumberOfWorkoutsTextChange: (text: string) => void

  confirmationButtonText: string
}

/**
 * Stateless functional component for your needs
 *
 * Component description here for TypeScript tips.
 */
export function ProgramForm(props: ProgramFormProps) {
  // grab the props
  const {
    style,
    onButtonPress,
    confirmationButtonText,
    onProgramIdTextChange,
    onDurationInWeeksTextChange,
    onNumberOfWorkoutsTextChange,
  } = props
  const viewStyle: StyleProp<ViewStyle> = {
    ...style,
    display: "flex",
    justifyContent: "space-evenly",
    height: 300,
  }

  return (
    <View style={viewStyle}>
      <Input
        placeholder={"Program ID"}
        keyboardType="number-pad"
        onChangeText={onProgramIdTextChange}
      />
      <Input
        placeholder={"Duration in Weeks"}
        keyboardType="number-pad"
        onChangeText={onDurationInWeeksTextChange}
      />
      <Input
        placeholder={"Number of workouts"}
        keyboardType="number-pad"
        onChangeText={onNumberOfWorkoutsTextChange}
      />
      <Button
        buttonStyle={{ width: "50%", alignSelf: "center" }}
        title={confirmationButtonText}
        onPress={onButtonPress}
      />
    </View>
  )
}
