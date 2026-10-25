import { createRoutine, getRoutines } from "@/utils/routineHelpers";
import { useRouter } from "expo-router";
import { Play } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Popup from "../../ui/Popup";

export default function Routines() {
    const router = useRouter();
    const [routines, setRoutines] = useState<
        {
            id: string;
            createdAt: Date;
            creationDay: string;
            name: string;
            daysOtw: {
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
                        displayAmount: number;
                        displayRestAmount: number | null;
                    }[];
                };
            }[];
        }[]
    >([]);
    const [routineName, setRoutineName] = useState("");
    const [showCreate, setShowCreate] = useState(false);

    useEffect(() => {
        const load = async () => {
            const res = await getRoutines();
            if (!res || !res.data) {
                return;
            }
            setRoutines(res.data);
        };
        load();
    }, []);

    const handleCreateRoutine = async () => {
        const res = await createRoutine(routineName);
        if (!res?.data) {
            return;
        }
        router.push({
            pathname: "/routines/edit-routine-screen",
            params: {
                routineId: res.data.id,
            },
        });
    };

    return (
        <>
            <View style={{ marginTop: 10, paddingBottom: 30 }}>
                <Text style={{ fontSize: 24, fontWeight: 500 }}>Routines</Text>
                <View style={{ marginTop: 10 }}>
                    {routines.length ? (
                        routines.map((routine) => {
                            const activeDays = routine.daysOtw.filter(
                                (day) => day.routineTemplate.restDay === false,
                            );

                            return (
                                <View
                                    key={routine.name}
                                    // onPress={() =>
                                    //     router.push({
                                    //         pathname:
                                    //             "/(workouts)/routines/single-routine-screen",
                                    //         params: {
                                    //             routineId: routine.id,
                                    //         },
                                    //     })
                                    // }
                                    style={{
                                        backgroundColor: "white",
                                        borderRadius: 15,
                                        overflow: "hidden",
                                    }}
                                >
                                    <View>
                                        <View
                                            style={{
                                                paddingHorizontal: 15,
                                                paddingVertical: 20,
                                                display: "flex",
                                                flexDirection: "row",
                                                alignItems: "center",
                                                gap: 10,
                                            }}
                                        >
                                            <View
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    backgroundColor: "gray",
                                                }}
                                            ></View>
                                            <View>
                                                <Text style={{ fontSize: 18 }}>
                                                    {routine.name}
                                                </Text>
                                                <Text style={{ fontSize: 14 }}>
                                                    {activeDays.length} days/wk
                                                    {(
                                                        activeDays.length - 7
                                                    ).toString()}{" "}
                                                    rest days
                                                </Text>
                                            </View>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    router.push({
                                                        pathname:
                                                            "/routines/single-routine-screen",
                                                        params: {
                                                            routineId:
                                                                routine.id,
                                                        },
                                                    })
                                                }
                                                style={{
                                                    marginLeft: "auto",
                                                    backgroundColor: "#EFEDEE",
                                                    padding: 13,
                                                    borderRadius: 100,
                                                }}
                                            >
                                                <Text>
                                                    <Play
                                                        size={15}
                                                        strokeWidth={3}
                                                        color="#434653"
                                                    />
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                justifyContent: "flex-end",
                                                gap: 2,
                                                backgroundColor: "#F9F8F8",
                                                paddingHorizontal: 10,
                                                paddingVertical: 10,
                                            }}
                                        >
                                            {activeDays.map((d) => (
                                                <Text
                                                    key={d.dayTitle}
                                                    style={{
                                                        fontSize: 14,
                                                        paddingHorizontal: 8,
                                                        paddingVertical: 3,
                                                        color: "#094CB2",
                                                        backgroundColor:
                                                            "#094db215",
                                                        borderRadius: 4,
                                                    }}
                                                >
                                                    {d.dayTitle}
                                                </Text>
                                            ))}
                                        </View>
                                    </View>
                                </View>
                            );
                        })
                    ) : (
                        <TouchableOpacity
                            onPress={() => setShowCreate(true)}
                            style={{ paddingVertical: 4, borderWidth: 1 }}
                        >
                            <Text style={{ textAlign: "center" }}>
                                Create your first routine
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            {showCreate && (
                <Popup setModal={setShowCreate} customStyles={{ padding: 30 }}>
                    <Text style={{ fontSize: 18, fontWeight: 500 }}>
                        Create Routine
                    </Text>
                    <Text style={{ marginTop: 10, fontSize: 16 }}>
                        Routine name
                    </Text>
                    <TextInput
                        value={routineName}
                        onChangeText={(t) => setRoutineName(t)}
                        placeholder="e.g. Full body, Calisthenics, GYM"
                        style={{ marginTop: 10, borderWidth: 1 }}
                    />
                    <TouchableOpacity
                        onPress={handleCreateRoutine}
                        style={{ marginTop: "auto" }}
                    >
                        <Text style={{ textAlign: "center" }}>
                            Create Routine
                        </Text>
                    </TouchableOpacity>
                </Popup>
            )}
        </>
    );
}
