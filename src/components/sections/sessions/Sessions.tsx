import { useSessionStore } from "@/stores/session-store";
import { useRouter } from "expo-router";
import { Plus } from "lucide-react-native";
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
            <TouchableOpacity
                onPress={() => {
                    createSession();
                }}
                style={{
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
            <View></View>
        </View>
    );
}
