import { createRoutine, getRoutines } from "@/utils/routineHelpers";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Popup from "../ui/Popup";

export default function Routines() {
    const router = useRouter();
    const [routines, setRoutines] = useState<
        {
            id: string;
            name: string;
            createdAt: Date;
            creationDay: string;
            daysOtw: {
                id: string;
                routineId: string;
                routineTemplateId: string | null;
                dayTitle: string;
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
            pathname: "/(workouts)/routines/edit-routine-screen",
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
                        routines.map((routine) => (
                            <TouchableOpacity
                                key={routine.name}
                                onPress={() =>
                                    router.push({
                                        pathname:
                                            "/(workouts)/routines/edit-routine-screen",
                                        params: {
                                            routineId: routine.id,
                                        },
                                    })
                                }
                            >
                                <Text>{routine.name}</Text>
                            </TouchableOpacity>
                        ))
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
