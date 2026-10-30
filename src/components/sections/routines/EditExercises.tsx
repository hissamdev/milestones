import { DayTemplateTEE } from "@/app/routines/edit-routine-screen";
import { Minus, Plus, TimerResetIcon, X } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

export default function EditExercises({
    fetchedCurrentDay,
    handleUpdateAmount,
    handleRemove,
}: {
    fetchedCurrentDay: DayTemplateTEE;
    handleUpdateAmount: (
        templateExerciseId: string,
        mode: "add" | "subtract",
    ) => void;
    handleRemove: (templateExerciseId: string) => void;
}) {
    return (
        <View style={{ display: "flex", gap: 10 }}>
            {fetchedCurrentDay.routineTemplate?.templateExercises.map((e) =>
                e.isRestType ? (
                    <View
                        key={e.id}
                        style={{
                            paddingVertical: 10,
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
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
                            <Text>Rest</Text>
                        </View>
                        <TouchableOpacity onPress={() => handleRemove(e.id)}>
                            <Text>
                                <X size={15} />
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View
                        key={e.id}
                        style={{
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
                                        backgroundColor: "gray",
                                    }}
                                />
                                <View>
                                    <Text>{e.exercise?.displayName}</Text>
                                    <Text>{e.exercise?.desc}</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={() => handleRemove(e.id)}
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
                                        handleUpdateAmount(e.id, "subtract")
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
                                    {e.displayAmount}
                                </Text>
                                <TouchableOpacity
                                    onPress={() =>
                                        handleUpdateAmount(e.id, "add")
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
                            {/* <View
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
                                        handleUpdateAmount(e.id, "subtract")
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
                                    {e.displayAmount}
                                </Text>
                                <TouchableOpacity
                                    onPress={() =>
                                        handleUpdateAmount(e.id, "add")
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
                            </View> */}
                        </View>
                    </View>
                ),
            )}
        </View>
    );
}
