import { useMilestoneStore } from "@/stores/milestones-store/milestones-store";
import {
    createDummyCategory,
    insertNCData,
} from "@/utils/milestones/milestone-helpers";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useShallow } from "zustand/react/shallow";

type Props = {
    id: string;
};

export default function NestedCounterHome({ id }: Props) {
    const { milestone, actions } = useMilestoneStore(
        useShallow((state) => ({
            milestone: state.milestones.find((m) => m.id === id)!,
            actions: state.actions,
        })),
    );
    const router = useRouter();

    return (
        <View
            style={{
                paddingVertical: 10,
                paddingHorizontal: 15,
                backgroundColor: "white",
            }}
        >
            <Text style={{ fontSize: 22, fontWeight: 500 }}>
                {milestone.name}
            </Text>
            <View style={{}}>
                <TouchableOpacity onPress={() => createDummyCategory(id)}>
                    <Text style={{ fontSize: 16 }}>Create</Text>
                </TouchableOpacity>
                <View>
                    {milestone.categories.map((c) => (
                        <TouchableOpacity
                            key={c.id}
                            onPress={() => insertNCData(milestone.id, c)}
                        >
                            <Text>{c.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            <View
                style={{
                    marginTop: 5,
                    paddingHorizontal: 5,
                    borderWidth: 1,
                    borderRadius: 5,
                    display: "flex",
                }}
            >
                {milestone["nestedCounters"]?.map((nc, idx) => (
                    <TouchableOpacity
                        onPress={() => {
                            router.push({
                                pathname:
                                    "/milestone-screens/nested-counter-focus-screen",
                                params: {
                                    milestoneId: milestone.id,
                                    dataId: nc.id,
                                    activityId: nc.activity!.id,
                                },
                            });
                        }}
                        key={nc.id}
                        style={{
                            height: 30,
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderTopWidth: idx ? 1 : 0,
                        }}
                    >
                        <Text style={{}}>{nc.activity?.name}</Text>
                        <Text>
                            {nc.timestamp.toLocaleTimeString("en-US", {
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
