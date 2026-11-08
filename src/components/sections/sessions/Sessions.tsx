import { useSessionStore } from "@/stores/session-store";
import { useRouter } from "expo-router";
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
    const router = useRouter();

    useEffect(() => {
        if (!allSessionsState.length) {
            loadSessions();
            return;
        }
    }, []);

    return (
        <View>
            <Text style={{ fontSize: 24, fontWeight: 500 }}>Sessions</Text>
            <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
                <TouchableOpacity
                    onPress={() => {
                        createSession();
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
            <View style={{ marginTop: 20, display: "flex", gap: 10 }}>
                {allSessionsState.map((session) => (
                    <TouchableOpacity
                        onPress={() => {
                            router.push({
                                pathname: "/sessions/session-focus-screen",
                            });
                        }}
                        key={session.id}
                        style={{
                            paddingVertical: 8,
                            paddingHorizontal: 10,
                            backgroundColor: "gray",
                            borderRadius: 4,
                        }}
                    >
                        <Text>
                            {session.createdAt.toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}
