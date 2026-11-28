import NestedCounterHome from "@/components/screens/milestones/home-variants/nested-counter";
import { useMilestoneStore } from "@/stores/milestones-store/milestones-store";
import { useRouter } from "expo-router";
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

    const router = useRouter();

    useEffect(() => {
        actions.loadMilestones();
    }, []);

    const components = {
        "nested-counter": NestedCounterHome,
    };

    return (
        <SafeAreaView>
            <ScrollView
                contentContainerStyle={{
                    paddingHorizontal: 15,
                    minHeight: "100%",
                }}
            >
                <Text style={{ fontSize: 22, fontWeight: 800 }}>
                    Milestones
                </Text>
                <Text>Track your daily activities and habits</Text>
                <View
                    style={{
                        marginTop: 30,
                    }}
                >
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
