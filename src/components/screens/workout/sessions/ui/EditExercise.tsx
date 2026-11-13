import { useTemplateStore } from "@/stores/template-store";
import { useLocalSearchParams } from "expo-router";
import { ChevronDown, ChevronUp, Minus, X } from "lucide-react-native";
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useShallow } from "zustand/react/shallow";

export default function EditExercises() {
    const { template, actions } = useTemplateStore(
        useShallow((state) => ({
            template: state.template,
            actions: state.actions,
        })),
    );

    const { templateId }: { templateId: string } = useLocalSearchParams();

    useEffect(() => {
        if (!template) {
            actions.fetchSingleTemplate(templateId);
            return;
        }
    }, []);

    return (
        <View style={{ display: "flex", gap: 10 }}>
            {template!.templateExercises.map((te) => (
                <View
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
                                boxSizing: "content-box",
                                padding: 5,
                                height: 30,
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
                                <Text>{te.exercise?.displayName}</Text>
                                <Text>{te.exercise?.desc}</Text>
                            </View>
                        </View>
                        <TouchableOpacity>
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
                                {te.displayAmount}
                            </Text>
                            <TouchableOpacity
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: "#EFEDEE",
                                    aspectRatio: 1 / 1,
                                }}
                            >
                                <Text>
                                    <Minus size={15} />
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                boxSizing: "content-box",
                                padding: 5,
                                height: 30,
                                display: "flex",
                                flexDirection: "row",
                                gap: 5,
                                alignItems: "stretch",
                                backgroundColor: "#F5F3F4",
                                borderRadius: 5,
                            }}
                        >
                            <TouchableOpacity
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
                                    <ChevronDown size={15} />
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: "#EFEDEE",
                                    aspectRatio: 1 / 1,
                                }}
                            >
                                <Text>
                                    <ChevronUp size={15} />
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );
}
