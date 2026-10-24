import ExerciseScreen from "@/components/sections/single-routine/ExerciseScreen";
import RestScreen from "@/components/sections/single-routine/RestScreen";
import { useState } from "react";
import { View } from "react-native";

export default function RoutineFocusScreen() {
    const [isRest, setIsRest] = useState(false);

    return <View>{isRest ? <RestScreen /> : <ExerciseScreen />}</View>;
}
