import { useMilestoneStore } from "@/stores/milestones-store/milestones-store";
import { useEffect } from "react";
import { ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useShallow } from "zustand/react/shallow";

export default function MilestonesScreen() {
    const { milestones, actions } = useMilestoneStore(
        useShallow((state) => ({
            milestones: state.milestones,
            actions: state.actions,
        })),
    );

    useEffect(() => {
        actions.loadMilestones();
    }, []);

    return (
        <SafeAreaView>
            <ScrollView>
                {milestones.map((m) => (
                    <Text>{m.name}</Text>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
