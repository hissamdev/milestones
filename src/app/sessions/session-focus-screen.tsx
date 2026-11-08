import SessionExercise from "@/components/sections/sessions/SessionExerciseScreen";
import SessionRest from "@/components/sections/sessions/SessionRest";
import { useRouter } from "expo-router";

export default function SessionFocusScreen() {
    const router = useRouter();

    return !true ? <SessionExercise /> : <SessionRest />;
}
