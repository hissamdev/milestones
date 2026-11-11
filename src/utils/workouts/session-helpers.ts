import { useSessionStore } from "@/stores/session-store";

export function initSessionActivity() {
    const singleSession = useSessionStore.getState().singleSession;
    const useStopwatch = true;
    console.log("Function body", !!singleSession.nestedSession);
    const currentActivity = singleSession.nestedSession!.sessionData!.find(
        (sd) => sd.sequence === singleSession.currentSequence,
    )!;

    if (!currentActivity.startTime) {
        const timestamp = new Date();
        singleSession.complexSetters.sessionData({ startTime: timestamp });
        return timestamp;
    }
}

export function updateDisplay() {
    const singleSession = useSessionStore.getState().singleSession;
    const currentActivity = singleSession.nestedSession!.sessionData!.find(
        (sd) => sd.sequence === singleSession.currentSequence,
    )!;
    const seconds = Math.round(
        (new Date().getTime() - currentActivity.startTime!.getTime()) / 1000,
    );
    return seconds;
}
