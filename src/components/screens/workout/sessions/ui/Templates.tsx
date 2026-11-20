import { db } from "@/db/client";
import { useSessionStore } from "@/stores/session-store";
import { useTemplateStore } from "@/stores/template-store";
import { NestedTemplate } from "@/types/template-types";
import { useRouter } from "expo-router";
import { Play, Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useShallow } from "zustand/react/shallow";

export default function Templates() {
    const { createSession } = useSessionStore(
        useShallow((state) => ({ createSession: state.createSession })),
    );
    const { templateState, actions } = useTemplateStore(
        useShallow((state) => ({
            templateState: state.template,
            actions: state.actions,
        })),
    );

    const [templates, setTemplates] = useState<NestedTemplate[]>([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");

    const router = useRouter();

    useEffect(() => {
        const load = async () => {
            const res = await db.query.routineTemplates.findMany({
                with: {
                    templateExercises: {
                        orderBy: {
                            sequence: "asc",
                        },
                        with: {
                            exercise: true,
                        },
                    },
                },
            });
            setTemplates(res);
        };

        load();
    }, [templates]);

    return (
        <View>
            <View
                style={{
                    marginTop: 20,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                }}
            >
                <View>
                    <Text>Predefined set of exercises</Text>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        actions.createTemplate("New template");
                        if (!templateState?.id) return;
                        router.push({
                            pathname: "/sessions/template-edit-screen",
                            params: {
                                templateId: templateState?.id,
                            },
                        });
                    }}
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <Text>
                        <Plus size={18} />
                    </Text>
                    <Text>New</Text>
                </TouchableOpacity>
            </View>
            <View style={{ marginTop: 30 }}>
                <Text>Select a template</Text>
                <View
                    style={{
                        marginTop: 10,
                        display: "flex",
                        gap: 10,
                        borderRadius: 5,
                    }}
                >
                    {templates.map((t) => (
                        <View
                            key={t.id}
                            style={{
                                backgroundColor: "white",
                                padding: 15,
                            }}
                        >
                            <View
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                }}
                            >
                                <View>
                                    <Text style={{ fontSize: 18 }}>
                                        {t.title}
                                    </Text>
                                    <Text>
                                        {t.templateExercises.length} activities
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => {
                                        actions.loadSingleTemplate(t);
                                        router.push({
                                            pathname:
                                                "/sessions/template-edit-screen",
                                            params: {
                                                templateId: t.id,
                                            },
                                        });
                                    }}
                                >
                                    <Text>Edit</Text>
                                </TouchableOpacity>
                            </View>
                            <View
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    gap: 6,
                                }}
                            >
                                {t.templateExercises.map((te) => (
                                    <Text key={te.sequence}>
                                        {te.exercise!.displayName}
                                    </Text>
                                ))}
                            </View>
                            <TouchableOpacity
                                onPress={async () => {
                                    actions.loadSingleTemplate(t);
                                    await createSession({
                                        mode: "template",
                                        templateId: t.id,
                                    });
                                    router.push({
                                        pathname:
                                            "/sessions/session-focus-screen",
                                    });
                                }}
                                style={{
                                    marginTop: 10,
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: 10,
                                    height: 40,
                                    backgroundColor: "#E8ECE2",
                                }}
                            >
                                <Text>
                                    <Play size={18} />
                                </Text>
                                <Text>Start Session</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}
