import { useMilestoneStore } from "@/stores/milestones-store/milestones-store";
import {
    createDummyTemplate,
    insertSubEntryData,
} from "@/utils/milestones/milestone-helpers";
import { useLocalSearchParams } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useShallow } from "zustand/react/shallow";

export default function NestedCounterFocusScreen() {
    const {
        milestoneId,
        dataId,
        activityId,
    }: { milestoneId: string; dataId: string; activityId: string } =
        useLocalSearchParams();
    const { milestones, category, data } = useMilestoneStore(
        useShallow((state) => ({
            milestones: state.milestones,
            category: state.milestones
                .find((m) => m.id === milestoneId)!
                .categories.find((a) => a.id === activityId)!,
            data: state.milestones
                .find((m) => m.id === milestoneId)!
                .nestedCounterData.find((nc) => nc.id === dataId)!,
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
                <TouchableOpacity
                    onPress={() =>
                        createDummyTemplate(milestoneId, category.id)
                    }
                >
                    <Text>Debug</Text>
                </TouchableOpacity>
                <View>
                    {category.templates.map((t) => (
                        <TouchableOpacity
                            onPress={() =>
                                insertSubEntryData(
                                    milestoneId,
                                    dataId,
                                    t,
                                    "nestedCounterData",
                                )
                            }
                            key={t.id}
                        >
                            <Text>{t.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View>
                    {data.subEntriesData.map((se) => (
                        <Text key={se.id}>
                            {se.template.name}{" "}
                            {se.timestamp.toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </Text>
                    ))}
                </View>
            </View>
        </SafeAreaView>
    );
}
