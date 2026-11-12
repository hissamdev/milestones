import { useSessionStore } from "@/stores/session-store";
import { useWorkoutsGlobalState } from "@/stores/workouts-global-store";
import { Plus, SportShoe } from "lucide-react-native";
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useShallow } from "zustand/react/shallow";

export default function Sessions() {
    const { allSessionsState, loadSessions, createSession } = useSessionStore(
        useShallow((state) => ({
            allSessionsState: state.allSessionsState,
            loadSessions: state.loadSessions,
            createSession: state.createSession,
        })),
    );
    const { openModal } = useWorkoutsGlobalState(
        useShallow((state) => ({ openModal: state.openModal })),
    );

    useEffect(() => {
        loadSessions();
    }, []);

    return (
        <View>
            <Text style={{ fontSize: 24, fontWeight: 500 }}>Sessions</Text>
            <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
                <TouchableOpacity
                    onPress={() => {
                        openModal("exercises", "session-create");
                    }}
                    style={{
                        flex: 1,
                        marginTop: 10,
                        backgroundColor: "gray",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        paddingVertical: 10,
                        borderRadius: 5,
                    }}
                >
                    <Text>
                        <Plus size={18} />
                    </Text>
                    <Text>Session</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        paddingHorizontal: 20,
                        marginTop: 10,
                        backgroundColor: "gray",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        paddingVertical: 10,
                        borderRadius: 5,
                    }}
                >
                    <Text>
                        <SportShoe size={18} />
                    </Text>
                </TouchableOpacity>
            </View>
            <Text style={{ marginTop: 20 }}>Completed sessions</Text>
            <View style={{ marginTop: 15, display: "flex", gap: 10 }}>
                {allSessionsState.map((session) => {
                    const filterExercises = session.sessionData?.filter(
                        (sd) => !sd.isRest,
                    );
                    const numUnique = Array.from(
                        new Set(filterExercises?.map((sd) => sd.exercise!.id)),
                    );

                    return (
                        <View
                            key={session.id}
                            style={{
                                borderLeftWidth: 1,
                                paddingHorizontal: 10,
                            }}
                        >
                            <View
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    paddingBottom: 5,
                                    borderBottomWidth: 1,
                                }}
                            >
                                <View>
                                    <Text>
                                        {session.createdAt.toLocaleTimeString(
                                            "en-US",
                                            {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            },
                                        )}
                                    </Text>
                                    <View
                                        style={{
                                            marginTop: 10,
                                            display: "flex",
                                            flexDirection: "row",
                                            gap: 10,
                                        }}
                                    >
                                        <Text>
                                            {filterExercises?.length} Exercises
                                        </Text>
                                        <Text>{numUnique.length} Unique</Text>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    style={{
                                        paddingHorizontal: 15,
                                        paddingVertical: 5,
                                        backgroundColor: "gray",
                                        borderRadius: 100,
                                    }}
                                >
                                    <Text>Open</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginTop: 10 }}>
                                {session.sessionData?.map(
                                    (sd) =>
                                        !sd.isRest && (
                                            <View
                                                key={sd.id}
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    justifyContent:
                                                        "space-between",
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        gap: 8,
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            width: 8,
                                                            aspectRatio: 1 / 1,
                                                            backgroundColor:
                                                                "green",
                                                            borderRadius: 100,
                                                        }}
                                                    />
                                                    <Text>
                                                        {
                                                            sd.exercise
                                                                ?.displayName
                                                        }
                                                    </Text>
                                                </View>
                                                <View>
                                                    <Text>{sd.amount}</Text>
                                                </View>
                                            </View>
                                        ),
                                )}
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}
