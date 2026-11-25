import NestedCounterHome from "@/components/screens/milestones/home-variants/nested-counter";
import { useMilestoneStore } from "@/stores/milestones-store/milestones-store";
import { useEffect } from "react";
import { ScrollView, Text, View } from "react-native";
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

    const components = {
        "nested-counter": NestedCounterHome,
    };

    return (
        <SafeAreaView>
            <ScrollView>
                {milestones.map((m) => {
                    const Component = components[m.type];
                    return (
                        <View>
                            <Text>hi</Text>
                            <Component id={m.id} />
                        </View>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
}
