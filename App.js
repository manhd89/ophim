import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./HomeScreen";
import DetailScreen from "./DetailScreen";
import SearchScreen from "./SearchScreen";
import MenuScreen from "./MenuScreen";
import CategoryScreen from "./CategoryScreen";
import CountryScreen from "./CountryScreen";
import ListScreen from "./ListScreen"; // thêm mới
import { TouchableOpacity, Text, View } from "react-native";

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
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={{ marginRight: 15 }}
                  onPress={() => navigation.navigate("Search")}
                >
                  <Text style={{ color: "#2196F3", fontWeight: "bold" }}>🔍</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ marginRight: 15 }}
                  onPress={() => navigation.navigate("Menu")}
                >
                  <Text style={{ color: "#2196F3", fontWeight: "bold" }}>☰ Menu</Text>
                </TouchableOpacity>
              </View>
            ),
          })}
        />
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen name="Category" component={CategoryScreen} />
        <Stack.Screen name="Country" component={CountryScreen} />
        <Stack.Screen name="ListScreen" component={ListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
