import { useWorkoutsGlobalState } from "@/stores/workouts-global-store";
import { Check, SearchIcon } from "lucide-react-native";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useShallow } from "zustand/react/shallow";

type Props = {
    mode: "session-picker";
};

export default function ExercisePicker({ mode }: Props) {
    const { allExercisesState } = useWorkoutsGlobalState(
        useShallow((state) => ({ allExercisesState: state.allExercisesState })),
    );

    const categories = ["All", "Recent", "Upper"];

    return (
        <View style={{ padding: 20 }}>
            <View
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <View
                    style={{
                        width: 5,
                        height: "60%",
                        backgroundColor: "#6D5E00",
                        borderRadius: 10,
                    }}
                />
                <Text
                    style={{
                        marginLeft: 5,
                        fontSize: 20,
                        fontWeight: 500,
                        lineHeight: 30,
                    }}
                >
                    Choose Exercise
                </Text>
            </View>
            <View
                style={{
                    paddingHorizontal: 30,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 20,
                    backgroundColor: "#F5F3F4",
                    height: 40,
                    borderRadius: 5,
                }}
            >
                <Text>
                    <SearchIcon size={15} />
                </Text>
                <TextInput
                    style={{
                        height: "100%",
                        flex: 1,
                        paddingTop: 0,
                        paddingBottom: 0,
                    }}
                    placeholder="Search exercise..."
                ></TextInput>
            </View>
            <View
                style={{
                    marginVertical: 20,
                    display: "flex",
                    flexDirection: "row",
                    gap: 5,
                }}
            >
                {categories.map((c) => (
                    <TouchableOpacity
                        key={c}
                        style={{
                            paddingHorizontal: 15,
                            paddingVertical: 3,
                            backgroundColor: "#EFEDEE",
                            borderRadius: 100,
                        }}
                    >
                        <Text>{c}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View>
                {allExercisesState.map((e) => (
                    <View
                        key={e.id}
                        style={{
                            backgroundColor: "#F5F3F4",
                            padding: 10,
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <View style={{ display: "flex", flexDirection: "row" }}>
                            <View
                                style={{
                                    width: 35,
                                    height: 35,
                                    backgroundColor: "gray",
                                }}
                            />
                            <View
                                style={{
                                    marginLeft: 10,
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Text>{e.displayName}</Text>
                                <Text>{e.desc}</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={{
                                width: 25,
                                aspectRatio: 1 / 1,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "#094CB2",
                                borderRadius: 100,
                            }}
                        >
                            <Text style={{ paddingTop: 1 }}>
                                <Check
                                    color="white"
                                    size={15}
                                    strokeWidth={3}
                                />
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </View>
    );
}
