import { db } from "@/db/client";
import {
    routineTemplateExercises,
    routineTemplates,
} from "@/db/schema/workouts";
import { Exercise, TemplateExercises } from "@/types/routineTypes";
import { NestedTemplate } from "@/types/template-types";
import { and, eq, notInArray, sql } from "drizzle-orm";
import { randomUUID } from "expo-crypto";
import { create } from "zustand";

interface TemplateState {
    template: NestedTemplate | null;
    actions: {
        createTemplate: (title: string) => Promise<string>;
        loadSingleTemplate: (template: NestedTemplate) => void;
        fetchSingleTemplate: (templateId: string) => void;
        insertExercise: (templateId: string, exercise: Exercise) => void;
        complexSetters: {
            templateExercise: <K extends keyof TemplateExercises>(
                templateExerciseId: string,
                key: K,
                value: TemplateExercises[K],
            ) => void;
        };
        updateAmount: (
            templateExerciseId: string,
            type: "reps" | "duration",
            mode: "add" | "subtract",
        ) => void;
        updateOrder: (index: number, mode: "previous" | "next") => void;
        removeExercise: (templateExerciseId: string) => void;
        saveTemplate: (templateExercises: TemplateExercises[]) => void;
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
        loadSingleTemplate: (template) => {
            set({
                template: {
                    ...template,
                    templateExercises: [...template.templateExercises],
                },
            });
        },
        fetchSingleTemplate: async (templateId) => {
            const res = await db.query.routineTemplates.findFirst({
                where: {
                    id: templateId,
                },
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

            set({
                template: {
                    ...res!,
                },
            });
        },
        insertExercise: (templateId, exercise) => {
            const newTe: NestedTemplate["templateExercises"][0] = {
                id: randomUUID(),
                templateId,
                exerciseId: exercise.id,
                exercise: {
                    ...exercise,
                },
                targetSets: 1,
                autoSets: true,
                displayAmount: 0,
                displayRestAmount: 0,
                isRestType: false,
                sequence: 0,
                useStopwatch: true,
            };

            set((prev) => ({
                ...prev,
                template: {
                    ...prev.template!,
                    templateExercises: [
                        ...prev.template!.templateExercises,
                        {
                            ...newTe,
                            sequence: prev.template!.templateExercises.length
                                ? prev.template!.templateExercises.length + 1
                                : 1,
                        },
                    ],
                },
            }));
        },
        complexSetters: {
            templateExercise: (templateExerciseId, key, value) => {
                set((prev) => ({
                    ...prev,
                    template: {
                        ...prev.template!,
                        templateExercises: prev.template!.templateExercises.map(
                            (te) =>
                                te.id === templateExerciseId
                                    ? {
                                          ...te,
                                          [key]: value,
                                      }
                                    : {
                                          ...te,
                                      },
                        ),
                    },
                }));
            },
        },
        updateAmount: (templateExerciseId, type, mode) => {
            const prevValue = get().template!.templateExercises.find(
                (te) => te.id === templateExerciseId,
            )!;

            if (mode === "add") {
                if (type === "reps") {
                    get().actions.complexSetters.templateExercise(
                        templateExerciseId,
                        "displayAmount",
                        prevValue.displayAmount + 1,
                    );
                    return;
                }
                get().actions.complexSetters.templateExercise(
                    templateExerciseId,
                    "displayAmount",
                    prevValue.displayAmount + 10,
                );
                return;
            }
            if (type === "reps") {
                const repSubtract =
                    prevValue.displayAmount - 1 <= 0
                        ? 0
                        : prevValue.displayAmount - 1;
                get().actions.complexSetters.templateExercise(
                    templateExerciseId,
                    "displayAmount",
                    repSubtract,
                );
                return;
            }
            const durSubtract =
                prevValue.displayAmount - 10 <= 0
                    ? 0
                    : prevValue.displayAmount - 10;
            get().actions.complexSetters.templateExercise(
                templateExerciseId,
                "displayAmount",
                durSubtract,
            );
        },
        updateOrder: (index, mode) => {
            const prevArray = [...get().template!.templateExercises];
            if (mode === "previous") {
                if (index <= 0) return;
                set((prev) => {
                    [prevArray[index - 1], prevArray[index]] = [
                        prevArray[index],
                        prevArray[index - 1],
                    ];
                    return {
                        ...prev,
                        template: {
                            ...prev.template!,
                            templateExercises: prevArray.map((te, idx) => ({
                                ...te,
                                sequence: idx + 1,
                            })),
                        },
                    };
                });
                return;
            }

            if (mode === "next") {
                if (index === prevArray.length - 1) return;
                set((prev) => {
                    [prevArray[index], prevArray[index + 1]] = [
                        prevArray[index + 1],
                        prevArray[index],
                    ];
                    return {
                        ...prev,
                        template: {
                            ...prev.template!,
                            templateExercises: prevArray.map((te, idx) => ({
                                ...te,
                                sequence: idx + 1,
                            })),
                        },
                    };
                });
            }
        },
        removeExercise: (templateExerciseId) => {
            set((prev) => ({
                ...prev,
                template: {
                    ...prev.template!,
                    templateExercises: prev
                        .template!.templateExercises.filter(
                            (te) => !(te.id === templateExerciseId),
                        )
                        .map((te, idx) => ({
                            ...te,
                            sequence: idx + 1,
                        })),
                },
            }));
        },
        saveTemplate: (templateExercises) => {
            try {
                db.transaction((tx) => {
                    tx.insert(routineTemplateExercises)
                        .values(templateExercises)
                        .onConflictDoUpdate({
                            target: routineTemplateExercises.id,
                            set: {
                                sequence: sql.raw(`excluded.sequence`),
                                displayAmount: sql.raw(
                                    `excluded.display_amount`,
                                ),
                            },
                        })
                        .run();
                    const matchIds = templateExercises.map((te) => te.id);
                    tx.delete(routineTemplateExercises)
                        .where(
                            and(
                                eq(
                                    routineTemplateExercises.templateId,
                                    templateExercises[0].templateId,
                                ),
                                notInArray(
                                    routineTemplateExercises.id,
                                    matchIds,
                                ),
                            ),
                        )
                        .run();
                });
                console.log("Success transaction");
            } catch (err) {
                console.error(err);
            }
        },
    },
}));
