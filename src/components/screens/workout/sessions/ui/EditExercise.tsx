import { useSessionStore } from "@/stores/session-store";
import { useTemplateStore } from "@/stores/template-store";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronDown, ChevronUp, Minus, Plus, X } from "lucide-react-native";
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useShallow } from "zustand/react/shallow";

export default function EditExercises() {
    const { createSession } = useSessionStore(
        useShallow((state) => ({ createSession: state.createSession })),
    );
    const { template, actions } = useTemplateStore(
        useShallow((state) => ({
            template: state.template,
            actions: state.actions,
        })),
    );

    const { templateId }: { templateId: string } = useLocalSearchParams();

    const router = useRouter();

    useEffect(() => {
        if (!template) {
            actions.fetchSingleTemplate(templateId);
            console.log("Refetched");
            return;
        }
    }, []);

    if (!template) {
        return;
    }

    return (
        <View style={{ display: "flex", gap: 10 }}>
            <TouchableOpacity
                onPress={() => {
                    createSession({ mode: "template", templateId });
                    router.push({
                        pathname: "/sessions/session-focus-screen",
                    });
                }}
                style={{
                    height: 40,
                    backgroundColor: "lightblue",
                }}
            >
                <Text style={{ margin: "auto" }}>Start Session</Text>
            </TouchableOpacity>

            {template!.templateExercises.map((te, idx) => (
                <View
                    key={te.id}
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
                                <Text>
                                    {te.exercise?.displayName} {te.sequence}
                                </Text>
                                <Text>{te.exercise?.desc}</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => actions.removeExercise(te.id)}
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
                                onPressIn={() =>
                                    actions.updateAmount(
                                        te.id,
                                        te.exercise!.type as
                                            | "reps"
                                            | "duration",
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
                                {te.displayAmount}
                            </Text>
                            <TouchableOpacity
                                onPressIn={() =>
                                    actions.updateAmount(
                                        te.id,
                                        te.exercise!.type as
                                            | "reps"
                                            | "duration",
                                        "add",
                                    )
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
                                onPressIn={() =>
                                    actions.updateSetCount(te.id, "subtract")
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
                                {te.targetSets}
                            </Text>
                            <TouchableOpacity
                                onPressIn={() =>
                                    actions.updateSetCount(te.id, "add")
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
                                onPress={() => actions.updateOrder(idx, "next")}
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
                                onPress={() =>
                                    actions.updateOrder(idx, "previous")
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
                                    <ChevronUp size={15} />
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ))}
            <TouchableOpacity
                onPress={() =>
                    actions.saveTemplate(
                        template.id,
                        template.templateExercises,
                    )
                }
                style={{
                    width: 100,
                    height: 40,
                    backgroundColor: "lightblue",
                }}
            >
                <Text style={{ margin: "auto" }}>Save</Text>
            </TouchableOpacity>
        </View>
    );
}
