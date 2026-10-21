import { useLocalSearchParams, useRouter } from "expo-router";
import { SportShoe } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function EditRoutineScreen() {
    const [day, setDay] = useState("Sat");
    const daysOfTheWeek = [
        {
            title: "sat",
            render: "Sat",
        },
        {
            title: "sun",
            render: "Sun",
        },
        {
            title: "mon",
            render: "Mon",
        },
        {
            title: "tue",
            render: "Tue",
        },
        {
            title: "wed",
            render: "Wed",
        },
        {
            title: "thu",
            render: "Thu",
        },
        {
            title: "fri",
            render: "Fri",
        },
    ];
    const [template, setTemplate] = useState([]);

    const { routineId } = useLocalSearchParams();
    const router = useRouter();
    useEffect(() => {}, []);

    // if (!routineId) {
    //     console.error("Routine id not received");
    //     router.navigate("/workouts-screen");
    //     return;
    // }

    return (
        <>
            <ScrollView>
                <Text>Edit Routine</Text>
                <View
                    style={{
                        marginTop: 20,
                        paddingHorizontal: 10,
                    }}
                >
                    <View style={{ display: "flex", flexDirection: "row" }}>
                        {daysOfTheWeek.map((d) => (
                            <TouchableOpacity
                                key={d.title}
                                style={{
                                    flex: 1,
                                    borderWidth: 1,
                                    paddingVertical: 4,
                                    backgroundColor:
                                        day === d.render ? "blue" : "white",
                                }}
                                onPress={() => setDay(d.render)}
                            >
                                <Text style={{ textAlign: "center" }}>
                                    {d.render}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Text style={{ fontSize: 20, fontWeight: 500 }}>
                            Exercises for {day}
                        </Text>
                        <View style={{ marginTop: 20 }}>
                            {!template.length ? (
                                <Text
                                    style={{
                                        color: "gray",
                                        textAlign: "center",
                                        paddingVertical: 12,
                                        backgroundColor: "rgba(0,0,0,0.1)",
                                        borderWidth: 1,
                                        borderColor: "rgba(0,0,0,0.2)",
                                    }}
                                >
                                    Add your first exercise
                                </Text>
                            ) : (
                                template.map((t) => (
                                    <View>
                                        <Text>Exercise</Text>
                                    </View>
                                ))
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>
            <TouchableOpacity
                style={{
                    position: "absolute",
                    backgroundColor: "blue",
                    bottom: 50,
                    right: 20,
                    padding: 10,
                    borderRadius: 10,
                }}
            >
                <Text>
                    <SportShoe color="white" />
                </Text>
            </TouchableOpacity>
        </>
    );
}
