import { Check } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";

export default function StandaloneExercises() {
    const [standaloneExercises, setStandaloneExercises] = useState([
        {
            id: "id-1",
            name: "Plank",
            type: "Duration",
        },
    ]);
    const [expandExercise, setExpandExercise] = useState<{
        id: string;
    } | null>({
        id: "id-1",
    });

    const handleAddStandaloneExercise = () => {
        setStandaloneExercises((prev) => [
            {
                id: "id-" + new Date(),
                name: "Random kid",
                type: "typeshi",
            },
            ...prev,
        ]);
    };
    const handleExpand = (id: string) => {
        if (!id) return;
        setExpandExercise(
            expandExercise?.id === id
                ? null
                : {
                      id,
                  },
        );
    };

    return (
        <View style={{ marginTop: 20 }}>
            <View>
                <Text>Standalone Exercises</Text>
                <Pressable
                    onPress={handleAddStandaloneExercise}
                    style={{
                        paddingHorizontal: 20,
                        paddingVertical: 6,
                        backgroundColor: "#65B8FB",
                    }}
                >
                    <Text style={{ textAlign: "center" }}>Add Exercise</Text>
                </Pressable>
            </View>
            <View style={{ marginTop: 10 }}>
                {standaloneExercises.map((e) => (
                    <TouchableOpacity
                        // onPress={() => handleExpand(e.id)}
                        key={e.id}
                        style={{
                            padding: 15,
                            backgroundColor: "white",
                            borderRadius: 10,
                            marginBottom: 20,
                        }}
                        activeOpacity={1}
                    >
                        <View
                            style={{
                                paddingVertical: 5,
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}
                        >
                            <View>
                                <Text>{e.name}</Text>
                            </View>
                            <View>
                                <Text>Avg: {e.name}</Text>
                            </View>
                        </View>
                        {expandExercise?.id === e.id && (
                            <View
                                style={{
                                    marginTop: 15,
                                    padding: 15,
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    backgroundColor: "#FBF2EE",
                                    borderRadius: 6,
                                }}
                            >
                                <View
                                    style={{
                                        padding: 15,
                                        flex: 1,
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        backgroundColor: "white",
                                        borderRadius: 6,
                                    }}
                                >
                                    <View
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            gap: 3,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 24,
                                            }}
                                        >
                                            57
                                        </Text>
                                        <Text
                                            style={{
                                                textAlignVertical: "bottom",
                                            }}
                                        >
                                            Seconds
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        style={{
                                            padding: 3,
                                            backgroundColor: "#9D3E1A",
                                            borderRadius: 5,
                                        }}
                                    >
                                        <Check color="white" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}
