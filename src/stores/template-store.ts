import { db } from "@/db/client";
import { routineTemplates } from "@/db/schema/workouts";
import { NestedTemplate } from "@/types/template-types";
import { randomUUID } from "expo-crypto";
import { create } from "zustand";

interface TemplateState {
    template: NestedTemplate | null;
    actions: {
        createTemplate: (title: string) => Promise<string>;
    };
}

export const useTemplateStore = create<TemplateState>()((set, get) => ({
    template: null,
    actions: {
        createTemplate: async (title) => {
            const [template] = await db
                .insert(routineTemplates)
                .values({
                    id: randomUUID(),
                    title,
                })
                .returning();

            set({
                template: {
                    ...template,
                    templateExercises: [],
                },
            });

            return template.id;
        },
    },
}));
