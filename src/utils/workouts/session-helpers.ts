import { useSessionStore } from "@/stores/session-store";

export function initSessionActivity() {
    const singleSession = useSessionStore.getState().singleSession;
    const useStopwatch = true;
    const currentActivity = singleSession.nestedSession!.sessionData!.find(
        (sd) => sd.sequence === singleSession.currentSequence,
    )!;

    const timestamp = new Date();
    if (!currentActivity.startTime) {
        singleSession.complexSetters.sessionData({ startTime: timestamp });
        return timestamp;
    }
    if (currentActivity.isComplete) {
        singleSession.complexSetters.sessionData({ startTime: timestamp });
        return;
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
