import { DayTemplateTEE } from "@/app/routines/edit-routine-screen";
import {
    GripVertical,
    Minus,
    Plus,
    TimerResetIcon,
    X,
} from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import {
    NestableDraggableFlatList,
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";

export default function EditExercises({
    fetchedCurrentDay,
    handleUpdateAmount,
    handleRemove,
    handleTEReorder,
}: {
    fetchedCurrentDay: DayTemplateTEE;
    handleUpdateAmount: (
        templateExerciseId: string,
        mode: "add" | "subtract",
    ) => void;
    handleRemove: (templateExerciseId: string) => void;
    handleTEReorder: (
        data: DayTemplateTEE["routineTemplate"]["templateExercises"],
    ) => void;
}) {
    const render = ({
        item,
        drag,
        isActive,
    }: RenderItemParams<
        DayTemplateTEE["routineTemplate"]["templateExercises"][0]
    >) => {
        return (
            <ScaleDecorator>
                {item.isRestType ? (
                    <View
                        key={item.id}
                        style={{
                            paddingVertical: 10,
                            paddingHorizontal: 5,
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <TouchableOpacity
                            onLongPress={drag}
                            disabled={isActive}
                        >
                            <Text>
                                <GripVertical size={24} color="gray" />
                            </Text>
                        </TouchableOpacity>
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 3,
                            }}
                        >
                            <Text>
                                <TimerResetIcon size={15} />
                            </Text>
                            <Text>Rest {item.displayRestAmount}</Text>
                        </View>
                        <TouchableOpacity onPress={() => handleRemove(item.id)}>
                            <Text>
                                <X size={15} />
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View
                        key={item.id}
                        style={{
                            paddingLeft: 5,
                            display: "flex",
                            flexDirection: "row",
                            gap: 5,
                            zIndex: 100,
                        }}
                    >
                        <TouchableOpacity
                            onLongPress={drag}
                            disabled={isActive}
                            style={{ marginTop: 10 }}
                        >
                            <Text>
                                <GripVertical size={24} color="gray" />
                            </Text>
                        </TouchableOpacity>
                        <View
                            style={{
                                flex: 1,
                                padding: 10,
                                backgroundColor: "white",
                                borderRadius: 10,
                            }}
                        >
                            <View
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                }}
                            >
                                <View
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        gap: 10,
                                    }}
                                >
                                    <View
                                        style={{
                                            width: 40,
                                            aspectRatio: 1 / 1,
                                            backgroundColor: "purple",
                                        }}
                                    />
                                    <View>
                                        <Text
                                            style={{
                                                fontSize: 15,
                                                fontWeight: 500,
                                            }}
                                        >
                                            {item.exercise?.displayName}
                                        </Text>
                                        <Text>{item.exercise?.desc}</Text>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    onPress={() => handleRemove(item.id)}
                                >
                                    <Text>
                                        <X size={17} />
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View
                                style={{
                                    marginTop: 10,
                                    display: "flex",
                                    flexDirection: "row",
                                    gap: 20,
                                }}
                            >
                                <View
                                    style={{
                                        boxSizing: "content-box",
                                        padding: 5,
                                        height: 30,
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "stretch",
                                        backgroundColor: "#F5F3F4",
                                        borderRadius: 5,
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() =>
                                            handleUpdateAmount(
                                                item.id,
                                                "subtract",
                                            )
                                        }
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            backgroundColor: "#EFEDEE",
                                            aspectRatio: 1 / 1,
                                            borderRadius: 5,
                                        }}
                                    >
                                        <Text>
                                            <Minus size={15} />
                                        </Text>
                                    </TouchableOpacity>
                                    <Text
                                        style={{
                                            paddingHorizontal: 10,
                                            textAlignVertical: "center",
                                        }}
                                    >
                                        {item.displayAmount}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() =>
                                            handleUpdateAmount(item.id, "add")
                                        }
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            backgroundColor: "#EFEDEE",
                                            aspectRatio: 1 / 1,
                                        }}
                                    >
                                        <Text>
                                            <Plus size={15} />
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            </ScaleDecorator>
        );
    };

    return (
        <NestableDraggableFlatList
            data={fetchedCurrentDay.routineTemplate.templateExercises}
            keyExtractor={(
                item: DayTemplateTEE["routineTemplate"]["templateExercises"][0],
            ) => item.id}
            renderItem={render}
            contentContainerStyle={{ display: "flex", gap: 10, zIndex: 100 }}
            onDragEnd={({ data }) => {
                const newSeq = data.map((te, idx) => ({
                    ...te,
                    sequence: idx + 1,
                }));
                handleTEReorder(newSeq);
            }}
        />
    );
}
