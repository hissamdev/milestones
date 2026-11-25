import { useMilestoneStore } from "@/stores/milestones-store/milestones-store";
import { singleMilestone } from "@/utils/milestones/milestone-helpers";
import { Text, TouchableOpacity, View } from "react-native";
import { useShallow } from "zustand/react/shallow";

type Props = {
    id: string;
};

export default function NestedCounterHome({ id }: Props) {
    const { milestones, actions } = useMilestoneStore(
        useShallow((state) => ({
            milestones: state.milestones,
            actions: state.actions,
        })),
    );

    return (
        <View>
            <Text>{singleMilestone(id).name}</Text>
            <View
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                <TouchableOpacity>
                    <Text>Create</Text>
                </TouchableOpacity>
            </View>
            <View>
                {singleMilestone(id)["nestedCounters"]?.map((nc) => (
                    <TouchableOpacity
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <Text>{nc.activity?.name}</Text>
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
