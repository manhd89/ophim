import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./HomeScreen";
import DetailScreen from "./DetailScreen";
import SearchScreen from "./SearchScreen";
import { TouchableOpacity, Text } from "react-native";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            title: "Home",
            headerRight: () => (
              <TouchableOpacity
                style={{ marginRight: 15 }}
                onPress={() => navigation.navigate("Search")}
              >
                <Text style={{ color: "#2196F3", fontWeight: "bold" }}>
                  🔍 Tìm kiếm
                </Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
