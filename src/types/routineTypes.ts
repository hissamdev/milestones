import {
    daysOtw,
    exercises,
    routineDataTopLevel,
    routineExerciseData,
    routines,
    routineTemplateExercises,
    routineTemplates,
} from "@/db/schema/workouts";

export type Routine = typeof routines.$inferSelect;
export type TLD = typeof routineDataTopLevel.$inferSelect;
export type ExerciseData = typeof routineExerciseData.$inferSelect;
export type DaysOtw = typeof daysOtw.$inferSelect;
export type RoutineTemplate = typeof routineTemplates.$inferSelect;
export type TemplateExercises = typeof routineTemplateExercises.$inferSelect;
export type Exercise = typeof exercises.$inferSelect;

export type ShallowRoutine = Routine & {
    daysOtw: (DaysOtw & {
        routineTemplate: RoutineTemplate;
    })[];
    routineData: TLD[];
};

export type NestedRoutine = Routine & {
    daysOtw: (DaysOtw & {
        routineTemplate: RoutineTemplate & {
            templateExercises: (TemplateExercises & {
                exercise: Exercise;
            })[];
        };
    })[];
    routineData: (TLD & {
        dataExercises: ExerciseData[];
    })[];
};

export type DayTemplateTEE = {
    id: string;
    routineId: string;
    routineTemplateId: string;
    dayTitle: string;
    routineTemplate: {
        id: string;
        restDay: boolean;
        templateExercises: {
            id: string;
            exerciseId: string | null;
            sequence: number;
            templateId: string;
            displayAmount: number | null;
            isRestType: boolean;
            displayRestAmount: number | null;
            exercise: {
                id: string;
                name: string;
                desc: string | null;
                type: string;
                createdAt: Date;
                updatedAt: Date;
                displayName: string;
                icon: string | null;
            } | null;
        }[];
    };
};
