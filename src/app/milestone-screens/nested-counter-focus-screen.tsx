import { useMilestoneStore } from "@/stores/milestones-store/milestones-store";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useShallow } from "zustand/react/shallow";

export default function NestedCounterFocusScreen() {
    const {
        milestoneId,
        dataId,
        activityId,
    }: { milestoneId: string; dataId: string; activityId: string } =
        useLocalSearchParams();
    const { data } = useMilestoneStore(
        useShallow((state) => ({
            data: state.milestones
                .find((m) => m.id === milestoneId)!
                .nestedCounters.find((nc) => nc.id === dataId)!,
        })),
    );

    return (
        <SafeAreaView>
            <View>
                <Text>
                    {data.activity!.name}
                    {data.timestamp.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </Text>
                <View>
                    {data.subEntriesData.map((se) => (
                        <Text>{se.template.name}</Text>
                    ))}
                </View>
            </View>
        </SafeAreaView>
    );
}
