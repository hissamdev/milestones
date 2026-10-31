import EditExercises from "@/components/sections/routines/EditExercises";
import Popup from "@/components/ui/Popup";
import ExercisesPopup from "@/components/ui/popups/ExercisesPopup";
import {
    getRoutineDays,
    insertRoutineExercise,
    removeTemplateExercise,
    updateAmount,
} from "@/utils/workouts/routineHelpers";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SportShoe } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export type DayTemplateTEE = {
    id: string;
    routineId: string;
    routineTemplateId: string;
    dayTitle: string;
    routineTemplate: {
        id: string;
        restDay: boolean;
        templateExercises: {
            id: string;
            exerciseId: string | null;
            sequence: number;
            templateId: string;
            displayAmount: number | null;
            isRestType: boolean;
            displayRestAmount: number | null;
            exercise: {
                id: string;
                name: string;
                desc: string | null;
                type: string;
                createdAt: Date;
                updatedAt: Date;
                displayName: string;
                icon: string | null;
            } | null;
        }[];
    };
};

export default function EditRoutineScreen() {
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
    const [selectedDay, setSelectedDay] = useState("sat");
    const [fetchedDays, setFetchedDays] = useState<DayTemplateTEE[]>([]);
    // const [fetchedCurrentDay, setFetchedCurrentDay] =
    //     useState<DayTemplateTEE | null>(null);
    const [showExercises, setShowExercises] = useState(false);
    const { routineId }: { routineId: string } = useLocalSearchParams();
    const router = useRouter();
    useEffect(() => {
        const load = async () => {
            if (!routineId || typeof routineId !== "string") {
                console.error("Routine id not received");
                router.navigate("/(tabs)/(workouts)");
                return;
            }
            const getDays = await getRoutineDays(routineId);
            if (!getDays || !getDays.success || !getDays.data) {
                return;
            }
            setFetchedDays(getDays.data);
        };
        load();
    }, []);

    const handleInsertExercise = async (exerciseId?: string) => {
        console.log("Received id", exerciseId);
        if (!exerciseId) {
            const currentDay = fetchedDays.find(
                (d) => d.dayTitle === selectedDay,
            );
            const lastExercise =
                currentDay?.routineTemplate.templateExercises[
                    currentDay?.routineTemplate.templateExercises.length - 1
                ];
            if (!lastExercise || lastExercise.isRestType) {
                return;
            }
        }
        const currentDay = fetchedDays.find((d) => d.dayTitle === selectedDay);
        const prevLength = currentDay
            ? currentDay.routineTemplate?.templateExercises.length
            : 0;
        const res = await insertRoutineExercise(
            routineId,
            selectedDay.toLowerCase(),
            prevLength ? prevLength + 1 : 1,
            exerciseId,
        );
        if (!res) {
            console.error("Failed to create day");
            return;
        }
        setFetchedDays(res);
    };

    const handleUpdateCurrentDay = async (newDay: string) => {
        // const getDays = await getRoutineDays(routineId);
        // if (!getDays || !getDays.success || !getDays.data) {
        //     return;
        // }
        // setFetchedDays(getDays.data);

        setSelectedDay(newDay);
    };
    const handleUpdateAmount = async (
        templateExerciseId: string,
        mode: "add" | "subtract",
    ) => {
        const currentDay = fetchedDays.find((d) => d.dayTitle === selectedDay);
        if (!currentDay) return;

        const exactExercise = currentDay.routineTemplate.templateExercises.find(
            (te) => te.id === templateExerciseId,
        );

        if (!exactExercise) {
            return;
        }
        let newAmount: number;
        const previousAmount = exactExercise.displayAmount;

        if (
            exactExercise.exercise?.type === "duration" ||
            exactExercise.isRestType
        ) {
            if (mode === "add") {
                newAmount = previousAmount === null ? 10 : previousAmount + 10;
            } else {
                newAmount =
                    previousAmount === null || previousAmount - 10 <= 0
                        ? 0
                        : previousAmount - 10;
            }
        } else {
            // Type reps
            if (mode === "add") {
                newAmount = previousAmount === null ? 1 : previousAmount + 1;
            } else {
                newAmount =
                    previousAmount === null || previousAmount - 1 <= 0
                        ? 0
                        : previousAmount - 1;
            }
        }
        setFetchedDays((prev) =>
            prev.map((d) =>
                d.dayTitle === selectedDay
                    ? {
                          ...d,
                          routineTemplate: {
                              ...d.routineTemplate,
                              templateExercises:
                                  d.routineTemplate!.templateExercises.map(
                                      (te) =>
                                          te.id === templateExerciseId
                                              ? {
                                                    ...te,
                                                    displayAmount: newAmount,
                                                }
                                              : {
                                                    ...te,
                                                },
                                  ),
                          },
                      }
                    : {
                          ...d,
                      },
            ),
        );
        updateAmount(templateExerciseId, newAmount);
        console.log("Uh", newAmount);
    };

    const handleRemove = (templateExerciseId: string) => {
        setFetchedDays((prev) =>
            prev.map((d) =>
                d.dayTitle === selectedDay
                    ? {
                          ...d,
                          routineTemplate: {
                              ...d.routineTemplate,
                              templateExercises:
                                  d.routineTemplate.templateExercises.filter(
                                      (te) => te.id !== templateExerciseId,
                                  ),
                          },
                      }
                    : {
                          ...d,
                      },
            ),
        );
        removeTemplateExercise(templateExerciseId);
    };

    const handleDeleteExercise = (exerciseId: string) => {
        setFetchedDays((prev) => {
            const currentDay = prev.find((d) => d.dayTitle === selectedDay);
            const updated =
                currentDay?.routineTemplate.templateExercises.filter(
                    (te) => te.exerciseId !== exerciseId,
                );
            if (!updated) return prev;
            return prev.map((day) =>
                day.dayTitle === selectedDay
                    ? {
                          ...day,
                          routineTemplate: {
                              ...day.routineTemplate,
                              templateExercises: updated,
                          },
                      }
                    : {
                          ...day,
                      },
            );
        });
    };

    const handleReorder = (
        mode: "previous" | "next",
        index: number,
        prevState: DayTemplateTEE["routineTemplate"]["templateExercises"],
    ) => {
        if (mode === "previous") {
            if (index === 0) return;
            [prevState[index - 1], prevState[index]] = [
                prevState[index],
                prevState[index - 1],
            ];
        } else {
            if (index + 1 === prevState.length) return;
            [prevState[index], prevState[index + 1]] = [
                prevState[index + 1],
                prevState[index],
            ];
        }

        const newSeq = prevState.map((te, idx) => ({
            ...te,
            sequence: idx + 1,
        }));

        setFetchedDays((prev) =>
            prev.map((d) =>
                d.dayTitle === selectedDay
                    ? {
                          ...d,
                          routineTemplate: {
                              ...d.routineTemplate,
                              templateExercises: newSeq,
                          },
                      }
                    : {
                          ...d,
                      },
            ),
        );
    };

    const currentDay = fetchedDays.find((d) => d.dayTitle === selectedDay);

    return (
        <>
            <ScrollView>
                <View
                    style={{
                        marginTop: 60,
                        paddingHorizontal: 10,
                    }}
                >
                    <View
                        style={{
                            boxSizing: "content-box",
                            padding: 10,
                            display: "flex",
                            flexDirection: "row",
                            height: 40,
                            backgroundColor: "#EFEDEE",
                            borderRadius: 10,
                        }}
                    >
                        {daysOfTheWeek.map((d) => {
                            const fetchedDay = fetchedDays.find(
                                (fd) => fd.dayTitle === d.title,
                            );

                            return (
                                <TouchableOpacity
                                    activeOpacity={1}
                                    key={d.title}
                                    style={{
                                        flex: 1,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor:
                                            selectedDay === d.title
                                                ? "blue"
                                                : "transparent",
                                        borderRadius: 10,
                                    }}
                                    onPress={() =>
                                        handleUpdateCurrentDay(d.title)
                                    }
                                >
                                    <Text
                                        style={{
                                            textAlign: "center",
                                            color:
                                                selectedDay === d.title
                                                    ? "white"
                                                    : "#434653",
                                        }}
                                    >
                                        {d.render}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Text style={{ fontSize: 20, fontWeight: 500 }}>
                            Exercises for {selectedDay}
                        </Text>
                        <TouchableOpacity
                            onPress={() => handleInsertExercise()}
                        >
                            <Text>Insert Rest</Text>
                        </TouchableOpacity>
                        <View style={{ marginTop: 20 }}>
                            {!currentDay ||
                            currentDay.dayTitle !== selectedDay ? (
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
                                <EditExercises
                                    fetchedCurrentDay={currentDay}
                                    handleUpdateAmount={handleUpdateAmount}
                                    handleRemove={handleRemove}
                                    handleReorder={handleReorder}
                                />
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>

            <TouchableOpacity
                onPress={() => setShowExercises((prev) => !prev)}
                style={{
                    position: "absolute",
                    backgroundColor: "blue",
                    bottom: 50,
                    right: 20,
                    padding: 10,
                    borderRadius: 10,
                    zIndex: 10,
                }}
            >
                <Text>
                    <SportShoe color="white" />
                </Text>
            </TouchableOpacity>
            {showExercises && (
                <Popup
                    customStyles={{ padding: 15 }}
                    setModal={setShowExercises}
                >
                    <ExercisesPopup
                        handleDeleteExercise={handleDeleteExercise}
                        insertHandler={handleInsertExercise}
                    />
                </Popup>
            )}
        </>
    );
}
