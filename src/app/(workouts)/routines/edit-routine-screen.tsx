import Popup from "@/components/ui/Popup";
import ExercisesPopup from "@/components/ui/popups/ExercisesPopup";
import { getRoutineDays, insertRoutineExercise } from "@/utils/routineHelpers";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SportShoe } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

type DayTemplateTEE = {
    id: string;
    routineId: string;
    routineTemplateId: string;
    dayTitle: string;
    routineTemplate: {
        id: string;
        restDay: boolean;
        templateExercises: {
            id: string;
            exerciseId: string;
            sequence: number;
            templateId: string;
            displayAmount: number | null;
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
    } | null;
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
    const [selectedDay, setSelectedDay] = useState("Sat");
    const [fetchedDays, setFetchedDays] = useState<DayTemplateTEE[]>([]);
    const [fetchedCurrentDay, setFetchedCurrentDay] =
        useState<DayTemplateTEE | null>(null);
    const [template, setTemplate] = useState<
        {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            displayName: string;
            type: string;
            icon: string | null;
            desc: string | null;
        }[]
    >([]);
    const [showExercises, setShowExercises] = useState(false);
    const { routineId }: { routineId: string } = useLocalSearchParams();
    const router = useRouter();
    useEffect(() => {
        const load = async () => {
            if (!routineId || typeof routineId !== "string") {
                console.error("Routine id not received");
                router.navigate("/workouts-screen");
                return;
            }
            const getDays = await getRoutineDays(routineId);
            if (!getDays || !getDays.success || !getDays.data) {
                return;
            }
            setFetchedDays(getDays.data);

            const findCurrentDay = getDays.data.find(
                (day) => day.dayTitle === selectedDay.toLocaleLowerCase(),
            );
            if (!findCurrentDay) {
                return;
            }
            setFetchedCurrentDay(findCurrentDay);
        };
        load();
    }, []);

    const handleInsertExercise = async (exerciseId: string) => {
        const prevLength = fetchedCurrentDay
            ? fetchedCurrentDay.routineTemplate?.templateExercises.length
            : 0;
        const res = await insertRoutineExercise(
            routineId,
            selectedDay.toLowerCase(),
            exerciseId,
            prevLength ? prevLength + 1 : 1,
        );
        if (!res) {
            console.error("Failed to create day");
            return;
        }
        setFetchedDays(res);
        const findCurrentDay = res.find((day) => day.dayTitle === selectedDay);
        if (!findCurrentDay) {
            setFetchedCurrentDay(null);
            return;
        }
        setFetchedCurrentDay(findCurrentDay);
    };

    const handleUpdateCurrentDay = async (newDay: string) => {
        setSelectedDay(newDay);
        const getDays = await getRoutineDays(routineId);
        if (!getDays || !getDays.success || !getDays.data) {
            return;
        }
        setFetchedDays(getDays.data);

        const findCurrentDay = getDays.data.find(
            (day) => day.dayTitle === newDay.toLocaleLowerCase(),
        );
        if (!findCurrentDay) {
            setFetchedCurrentDay(null);
            return;
        }
        setFetchedCurrentDay(findCurrentDay);
        console.log("Updated current day");
    };

    return (
        <>
            <ScrollView>
                <Text>Edit Routine {routineId} </Text>
                <View
                    style={{
                        marginTop: 20,
                        paddingHorizontal: 10,
                    }}
                >
                    <View style={{ display: "flex", flexDirection: "row" }}>
                        {daysOfTheWeek.map((d) => {
                            const fetchedDay = fetchedDays.find(
                                (fd) => fd.dayTitle === d.title,
                            );

                            return (
                                <TouchableOpacity
                                    key={d.title}
                                    style={{
                                        flex: 1,
                                        borderWidth: 1,
                                        paddingVertical: 4,
                                        backgroundColor:
                                            selectedDay === d.title
                                                ? "blue"
                                                : "white",
                                    }}
                                    onPress={() =>
                                        handleUpdateCurrentDay(d.title)
                                    }
                                >
                                    <Text
                                        style={{
                                            textAlign: "center",
                                            color:
                                                fetchedDay &&
                                                fetchedDay.dayTitle ===
                                                    d.title.toLocaleLowerCase()
                                                    ? "pink"
                                                    : "purple",
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
                        <View style={{ marginTop: 20 }}>
                            {!fetchedCurrentDay ||
                            fetchedCurrentDay.dayTitle !== selectedDay ? (
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
                                fetchedCurrentDay.routineTemplate?.templateExercises.map(
                                    (t) => (
                                        <View key={t.id}>
                                            <Text>
                                                {t.exercise?.displayName}{" "}
                                                {t.sequence}
                                            </Text>
                                        </View>
                                    ),
                                )
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
                    customStyles={{ padding: 30 }}
                    setModal={setShowExercises}
                >
                    <ExercisesPopup insertHandler={handleInsertExercise} />
                </Popup>
            )}
        </>
    );
}
