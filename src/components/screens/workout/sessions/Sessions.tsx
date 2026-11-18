import { useSessionStore } from "@/stores/session-store";
import { useWorkoutsGlobalState } from "@/stores/workouts-global-store";
import { formatSeconds } from "@/utils/workouts/session-helpers";
import { useEffect } from "react";
import { Text, View } from "react-native";
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
            <Text style={{ marginTop: 20, fontSize: 20, fontWeight: 500 }}>
                Today's sessions
            </Text>
            <View style={{ marginTop: 15, display: "flex", gap: 10 }}>
                {allSessionsState.map((session, sessionIdx) => {
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
                                paddingHorizontal: 15,
                                paddingVertical: 15,
                                backgroundColor: "white",
                                borderRadius: 10,
                            }}
                        >
                            <View
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                }}
                            >
                                <View>
                                    <Text
                                        style={{
                                            fontSize: 17,
                                            fontWeight: 500,
                                        }}
                                    >
                                        Session #
                                        {allSessionsState.length - sessionIdx}
                                    </Text>
                                    <View style={{ marginTop: 2 }}>
                                        <Text
                                            style={{
                                                fontSize: 11,
                                                color: "#71796F",
                                            }}
                                        >
                                            {filterExercises?.length} Exercises
                                            · {numUnique.length} Unique
                                            {session.useTemplate &&
                                                " · Template"}
                                        </Text>
                                    </View>
                                </View>
                                <Text>Right</Text>
                            </View>
                            <View
                                style={{
                                    marginTop: 10,
                                    width: "100%",
                                    height: 1.5,
                                    backgroundColor: "#E9ECE4",
                                }}
                            />
                            <View style={{ marginTop: 10 }}>
                                <View
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                    }}
                                >
                                    <Text
                                        style={{
                                            textTransform: "uppercase",
                                            fontWeight: 500,
                                            color: "#71796F",
                                            fontSize: 9,
                                            width: "60%",
                                        }}
                                    >
                                        Exercises
                                    </Text>
                                    <Text
                                        style={{
                                            textTransform: "uppercase",
                                            fontWeight: 500,
                                            color: "#71796F",
                                            fontSize: 9,
                                            width: "20%",
                                            textAlign: "center",
                                        }}
                                    >
                                        Amount
                                    </Text>
                                    <Text
                                        style={{
                                            textTransform: "uppercase",
                                            fontWeight: 500,
                                            color: "#71796F",
                                            fontSize: 9,
                                            width: "20%",
                                            textAlign: "center",
                                        }}
                                    >
                                        Duration
                                    </Text>
                                </View>
                                {filterExercises?.map((e, idx) => (
                                    <View
                                        key={e.sequence}
                                        style={{
                                            borderTopWidth: idx === 0 ? 0 : 1,
                                            borderTopColor: "#E9ECE4",
                                            height: 35,
                                            display: "flex",
                                            flexDirection: "row",
                                        }}
                                    >
                                        <Text
                                            style={{
                                                marginVertical: "auto",
                                                fontSize: 13,
                                                fontWeight: 500,
                                                width: "60%",
                                            }}
                                        >
                                            {e.exercise?.displayName}
                                        </Text>
                                        <Text
                                            style={{
                                                marginVertical: "auto",
                                                fontSize: 13,
                                                fontWeight: 500,

                                                width: "20%",
                                                textAlign: "center",
                                            }}
                                        >
                                            {e.amount}
                                        </Text>
                                        <Text
                                            style={{
                                                marginVertical: "auto",
                                                fontSize: 13,
                                                fontWeight: 500,

                                                width: "20%",
                                                textAlign: "center",
                                            }}
                                        >
                                            {formatSeconds(
                                                Math.round(
                                                    (e.endTime!.getTime() -
                                                        e.startTime!.getTime()) /
                                                        1000,
                                                ),
                                            )}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}
