import { db } from "@/db/client";
import { useTemplateStore } from "@/stores/template-store";
import { NestedTemplate } from "@/types/template-types";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useShallow } from "zustand/react/shallow";

export default function Templates() {
    const { templateState, actions } = useTemplateStore(
        useShallow((state) => ({
            templateState: state.template,
            actions: state.actions,
        })),
    );

    const [templates, setTemplates] = useState<NestedTemplate[]>([]);

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
    }, []);

    return (
        <View>
            <Text>Templates</Text>
            <TouchableOpacity
                onPress={() => actions.createTemplate("New template")}
            >
                <Text>Create Template</Text>
            </TouchableOpacity>
            <View style={{ marginTop: 30 }}>
                {templates.map((t) => (
                    <TouchableOpacity
                        key={t.id}
                        onPress={() => {
                            actions.loadSingleTemplate(t);
                            router.push({
                                pathname: "/sessions/template-edit-screen",
                                params: {
                                    templateId: t.id,
                                },
                            });
                        }}
                    >
                        <Text>
                            {t.title} {t.id}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}
