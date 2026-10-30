import { exercises } from "@/db/schema/workouts";
import { createExercise, getExercises } from "@/utils/exerciseHelpers";
import { Plus, Trash } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

type Exercise = typeof exercises.$inferSelect;

export default function ExercisesPopup({
    insertHandler,
}: {
    insertHandler: (exerciseId: string) => Promise<void>;
}) {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [showCreate, setShowCreate] = useState(false);
    const [exerciseName, setExerciseName] = useState("");
    const [exerciseDesc, setExerciseDesc] = useState("");
    const [exerciseType, setExerciseType] = useState<"reps" | "duration">(
        "reps",
    );
    useEffect(() => {
        const load = async () => {
            const res = await getExercises();
            if (res) {
                setExercises(res);
            }
        };
        load();
    }, []);

    const handleCreate = async () => {
        const res = await createExercise(
            exerciseName,
            exerciseDesc,
            exerciseType,
        );
        if (!res) {
            console.error("Something went wrong");
            return;
        }
        setExercises((prev) => [
            {
                ...res,
            },
            ...prev,
        ]);
        setShowCreate(false);
    };

    const handleDelete = (exerciseId: string) => {
        setExercises((prev) => prev.filter((e) => e.id !== exerciseId));
    };

    return (
        <>
            <View
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                }}
            >
                <Text style={{ fontSize: 18, fontWeight: 500 }}>
                    List of Exercises{" "}
                </Text>
                <TouchableOpacity
                    onPress={() => setShowCreate((prev) => !prev)}
                    style={{
                        backgroundColor: "blue",
                        borderRadius: 4,
                        padding: 3,
                    }}
                >
                    <Text>
                        <Plus size={15} color="white" />
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={{ marginTop: 10, display: "flex", gap: 10 }}>
                {showCreate && (
                    <View>
                        <Text>Exercise name</Text>
                        <TextInput
                            value={exerciseName}
                            onChangeText={(t) => setExerciseName(t)}
                            style={{ borderWidth: 1 }}
                        />
                        <Text>Short description</Text>
                        <TextInput
                            value={exerciseDesc}
                            onChangeText={(t) => setExerciseDesc(t)}
                            style={{ borderWidth: 1 }}
                        />
                        <Text style={{ marginTop: 20 }}>Exercise type</Text>
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 5,
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => setExerciseType("reps")}
                                style={{
                                    paddingVertical: 6,
                                    flex: 1,
                                    borderWidth: 1,
                                    backgroundColor:
                                        exerciseType === "reps"
                                            ? "gray"
                                            : "white",
                                }}
                            >
                                <Text style={{ textAlign: "center" }}>
                                    Repetition
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setExerciseType("duration")}
                                style={{
                                    paddingVertical: 6,
                                    flex: 1,
                                    borderWidth: 1,
                                    backgroundColor:
                                        exerciseType === "duration"
                                            ? "gray"
                                            : "white",
                                }}
                            >
                                <Text style={{ textAlign: "center" }}>
                                    Duration
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                marginTop: 20,
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 30,
                            }}
                        >
                            <TouchableOpacity
                                onPress={handleCreate}
                                style={{
                                    paddingVertical: 12,
                                    flex: 1,
                                    borderWidth: 1,
                                }}
                            >
                                <Text style={{ textAlign: "center" }}>
                                    Done
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setShowCreate(false)}
                                style={{
                                    paddingVertical: 12,
                                    flex: 1,
                                    borderWidth: 1,
                                }}
                            >
                                <Text style={{ textAlign: "center" }}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                {!exercises.length && !showCreate ? (
                    <Text
                        style={{
                            color: "gray",
                            textAlign: "center",
                            paddingVertical: 8,
                            backgroundColor: "rgba(0,0,0,0.1)",
                            borderWidth: 1,
                            borderColor: "rgba(0,0,0,0.2)",
                        }}
                    >
                        No exercises yet
                    </Text>
                ) : (
                    exercises.map((e) => (
                        <View
                            // onPress={() => insertHandler(e.id)}
                            key={e.name}
                            style={{
                                padding: 8,
                                display: "flex",
                                flexDirection: "row",
                                gap: 50,
                                backgroundColor: "#eceaea",
                                borderRadius: 5,
                            }}
                        >
                            <View
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "stretch",
                                    gap: 10,
                                    flex: 1,
                                }}
                            >
                                <View
                                    style={{
                                        width: 40,
                                        aspectRatio: 1 / 1,
                                        backgroundColor: "gray",
                                        borderRadius: 5,
                                    }}
                                />
                                <TouchableOpacity style={{ flex: 1 }}>
                                    <Text>{e.displayName}</Text>
                                    {e.desc && <Text>{e.desc}</Text>}
                                </TouchableOpacity>
                            </View>
                            <View style={{ display: "flex" }}>
                                <TouchableOpacity style={{ marginTop: "auto" }}>
                                    <Text>
                                        <Trash size={15} />
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </View>
        </>
    );
}
