import { createStackNavigator } from "react-navigation"
import { MenuScreen } from "../screens/menu-screen/menu-screen"
import { SplashScreen } from "../screens/splash-screen/splash-screen"
import { ExampleNavigator } from "./example-navigator"

export const RootNavigator = createStackNavigator(
  {
    menuScreen: { screen: MenuScreen },
    splashScreen: { screen: SplashScreen },
    exampleStack: { screen: ExampleNavigator },
  },
  {
    headerMode: "none",
    navigationOptions: { gesturesEnabled: false },
    initialRouteName: "splashScreen",
  },
)
