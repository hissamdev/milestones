import Sessions from "@/components/screens/workout/sessions/Sessions";
import Templates from "@/components/screens/workout/sessions/ui/Templates";
import Popup from "@/components/ui/Popup";
import ExercisePicker from "@/components/ui/popups/ExercisePicker";
import { exercises } from "@/db/schema/workouts";
import { useWorkoutsGlobalState } from "@/stores/workouts-global-store";
import { Plus, SportShoe } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useShallow } from "zustand/react/shallow";
("@/components/ui/Popup");

type Exercise = typeof exercises.$inferSelect;

export default function Workouts() {
    const {
        activeModal,
        closeModal,
        allExercisesState,
        openModal,
        loadExercises,
    } = useWorkoutsGlobalState(
        useShallow((state) => ({
            allExercisesState: state.allExercisesState,
            loadExercises: state.loadExercises,
            activeModal: state.activeModal,
            openModal: state.openModal,
            closeModal: state.closeModal,
        })),
    );
    const [view, setView] = useState<"sessions" | "templates" | "routines">(
        "sessions",
    );

    useEffect(() => {
        if (!allExercisesState.length) {
            loadExercises();
            return;
        }
    }, []);

    return (
        <>
            <SafeAreaView
                style={{
                    flex: 1,
                    position: "relative",
                    padding: 10,
                }}
            >
                <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                    <Text style={{ fontSize: 22, fontWeight: 500 }}>
                        {view === "sessions" ? "Sessions" : "Templates"}
                    </Text>
                    <View
                        style={{
                            marginTop: 10,
                            display: "flex",
                            flexDirection: "row",
                            backgroundColor: "#E8ECE2",
                            borderRadius: 10,
                        }}
                    >
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => setView("sessions")}
                            style={{
                                height: 40,
                                backgroundColor:
                                    view === "sessions"
                                        ? "#244D38"
                                        : "transparent",
                                flex: 1,
                                borderRadius: 10,
                            }}
                        >
                            <Text
                                style={{
                                    margin: "auto",
                                    color:
                                        view === "sessions"
                                            ? "white"
                                            : "#71796F",
                                }}
                            >
                                Sessions
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => setView("templates")}
                            style={{
                                height: 40,
                                backgroundColor:
                                    view === "templates"
                                        ? "#244D38"
                                        : "transparent",
                                flex: 1,
                                borderRadius: 10,
                            }}
                        >
                            <Text
                                style={{
                                    margin: "auto",
                                    color:
                                        view === "templates"
                                            ? "white"
                                            : "#71796F",
                                }}
                            >
                                Tempaltes
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {view === "sessions" && <Sessions />}
                    {view === "templates" && <Templates />}
                </ScrollView>
                {view === "sessions" && (
                    <View
                        style={{
                            position: "absolute",
                            left: 0,
                            right: 0,
                            bottom: 50,
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            gap: 10,
                        }}
                    >
                        <TouchableOpacity
                            onPress={() =>
                                openModal("exercises", "session-create")
                            }
                            style={{
                                position: "relative",
                                height: 50,
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                paddingHorizontal: 20,
                                paddingVertical: 5,
                                borderRadius: 100,
                                backgroundColor: "blue",
                                gap: 5,
                            }}
                        >
                            <Text>
                                <Plus color="white" size={17} />
                            </Text>
                            <Text style={{ color: "white" }}>
                                Start Session
                            </Text>
                            <TouchableOpacity
                                style={{
                                    position: "absolute",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    aspectRatio: 1 / 1,
                                    backgroundColor: "blue",
                                    borderRadius: 100,
                                    right: -60,
                                    top: 4,
                                    bottom: 4,
                                }}
                            >
                                <Text>
                                    <SportShoe color="white" size={16} />
                                </Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </View>
                )}
                <Popup
                    onClose={closeModal}
                    visible={activeModal.modal === "exercises"}
                >
                    <ExercisePicker />
                </Popup>
            </SafeAreaView>
        </>
    );
}
