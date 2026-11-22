import { useMilestoneStore } from "@/stores/milestones-store/milestones-store";
import { Text, View } from "react-native";
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

    const findSingleMs = () => {
        return milestones.find((m) => m.id === id)!;
    };
    return (
        <View>
            <Text>{findSingleMs().name}</Text>
        </View>
    );
}
