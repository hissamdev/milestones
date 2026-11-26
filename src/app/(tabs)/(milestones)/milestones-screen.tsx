import NestedCounterHome from "@/components/screens/milestones/home-variants/nested-counter";
import { useMilestoneStore } from "@/stores/milestones-store/milestones-store";
import {
    createDummyData,
    createMilestoneDummy,
} from "@/utils/milestones/milestone-helpers";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useShallow } from "zustand/react/shallow";

export default function MilestonesScreen() {
    const { milestones, actions } = useMilestoneStore(
        useShallow((state) => ({
            milestones: state.milestones,
            actions: state.actions,
        })),
    );

    const router = useRouter();

    useEffect(() => {
        actions.loadMilestones();
    }, []);

    const components = {
        "nested-counter": NestedCounterHome,
    };

    return (
        <SafeAreaView>
            <View>
                <TouchableOpacity onPress={() => createMilestoneDummy()}>
                    <Text>Create dummy milestone</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => createDummyData()}>
                    <Text>Create dummy data</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        router.navigate(
                            "/milestone-screens/nested-counter-focus-screen",
                        );
                    }}
                >
                    <Text>Go to smt</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ paddingHorizontal: 15 }}>
                <Text style={{ fontSize: 18 }}>Milestones</Text>
                <View style={{ marginTop: 10 }}>
                    {milestones.map((m) => {
                        const Component = components[m.type];
                        return (
                            <View key={m.id}>
                                <Component id={m.id} />
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
