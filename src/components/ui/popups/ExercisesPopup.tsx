import { exercises } from "@/db/schema/workouts";
import {
    createExercise,
    deleteExercise,
    getExercises,
} from "@/utils/exerciseHelpers";
import { CircleCheck, Clock3, Plus, Trash, Weight } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

type Exercise = typeof exercises.$inferSelect;

export default function ExercisesPopup({
    insertHandler,
    handleDeleteExercise,
}: {
    insertHandler: (exerciseId: string) => Promise<void>;
    handleDeleteExercise: (exerciseId: string) => void;
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
        handleDeleteExercise(exerciseId);
        deleteExercise(exerciseId);
    };

    return (
        <>
            {!showCreate && (
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
            )}
            <View style={{ display: "flex", gap: 10 }}>
                {showCreate ? (
                    <View>
                        <Text style={{ fontSize: 18, fontWeight: 500 }}>
                            Create Exercise
                        </Text>
                        <Text style={{ marginTop: 5, fontSize: 13 }}>
                            This exercise can be used for routines, sessions and
                            daily exercise additions
                        </Text>
                        <Text style={{ marginTop: 10, fontWeight: 500 }}>
                            Exercise name
                        </Text>
                        <TextInput
                            value={exerciseName}
                            onChangeText={(t) => setExerciseName(t)}
                            style={{
                                marginTop: 5,
                                borderWidth: 1,
                                borderRadius: 5,
                                borderColor: "#dfdfdf",
                            }}
                        />
                        <Text style={{ marginTop: 10, fontWeight: 500 }}>
                            Description
                        </Text>
                        <TextInput
                            value={exerciseDesc}
                            onChangeText={(t) => setExerciseDesc(t)}
                            style={{
                                marginTop: 5,
                                borderWidth: 1,
                                borderRadius: 5,
                                borderColor: "#dfdfdf",
                            }}
                        />
                        <Text style={{ marginTop: 10, fontWeight: 500 }}>
                            Exercise type
                        </Text>
                        <View
                            style={{
                                height: 40,
                                boxSizing: "content-box",
                                marginTop: 5,
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "stretch",
                                gap: 5,
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => setExerciseType("reps")}
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 5,
                                    paddingVertical: 6,
                                    flex: 1,
                                    borderWidth: 1,
                                    backgroundColor:
                                        exerciseType === "reps"
                                            ? "#094CB2"
                                            : "white",
                                    borderRadius: 5,
                                }}
                            >
                                <Text>
                                    <Weight
                                        size={15}
                                        color={
                                            exerciseType === "reps"
                                                ? "white"
                                                : "black"
                                        }
                                    />
                                </Text>
                                <Text
                                    style={{
                                        color:
                                            exerciseType === "reps"
                                                ? "white"
                                                : "black",
                                    }}
                                >
                                    Repetition
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setExerciseType("duration")}
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 5,
                                    paddingVertical: 6,
                                    flex: 1,
                                    borderWidth: 1,
                                    backgroundColor:
                                        exerciseType === "duration"
                                            ? "#094CB2"
                                            : "white",
                                    borderRadius: 5,
                                }}
                            >
                                <Text>
                                    <Clock3
                                        size={15}
                                        color={
                                            exerciseType === "duration"
                                                ? "white"
                                                : "black"
                                        }
                                    />
                                </Text>
                                <Text
                                    style={{
                                        color:
                                            exerciseType === "duration"
                                                ? "white"
                                                : "black",
                                    }}
                                >
                                    Duration
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                marginTop: 50,
                                height: 40,
                                boxSizing: "content-box",

                                display: "flex",
                                flexDirection: "row",
                                alignItems: "stretch",
                                gap: 5,
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => setShowCreate(false)}
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    paddingVertical: 6,
                                    flex: 1,
                                    borderWidth: 1,
                                    backgroundColor: "white",
                                    borderRadius: 5,
                                }}
                            >
                                <Text
                                    style={{
                                        textAlign: "center",
                                        color: "black",
                                    }}
                                >
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setExerciseType("duration")}
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 5,
                                    paddingVertical: 6,
                                    flex: 1,
                                    borderWidth: 1,
                                    backgroundColor: "#094CB2",
                                    borderRadius: 5,
                                }}
                            >
                                <Text>
                                    <CircleCheck size={15} color="white" />
                                </Text>
                                <Text
                                    style={{
                                        color: "white",
                                    }}
                                >
                                    Complete
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : !exercises.length ? (
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
                    <View style={{ marginTop: 10, display: "flex", gap: 10 }}>
                        {exercises.map((e) => (
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
                                    <TouchableOpacity
                                        onPress={() => insertHandler(e.id)}
                                        style={{ flex: 1 }}
                                    >
                                        <Text>{e.displayName}</Text>
                                        {e.desc && <Text>{e.desc}</Text>}
                                    </TouchableOpacity>
                                </View>
                                <View style={{ display: "flex" }}>
                                    <TouchableOpacity
                                        onPress={() => handleDelete(e.id)}
                                        style={{ marginTop: "auto" }}
                                    >
                                        <Text>
                                            <Trash size={15} />
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
                {}
            </View>
        </>
    );
}
