import { useSessionStore } from "@/stores/session-store";

export function formatSeconds(s: number) {
    if (s < 60) {
        return `${String(s).padStart(2, "0")}s`;
    }
    const mins = Math.floor(s / 60);
    const seconds = s % 60;

    return `${String(mins).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

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

export function updateDisplay(useStopwatch: boolean) {
    const singleSession = useSessionStore.getState().singleSession;
    const currentActivity = singleSession.nestedSession!.sessionData!.find(
        (sd) => sd.sequence === singleSession.currentSequence,
    )!;
    if (!useStopwatch) {
        const seconds = Math.round(
            (currentActivity.endTime!.getTime() - new Date().getTime()) / 1000,
        );
        return seconds;
    }

    const seconds = Math.round(
        (new Date().getTime() - currentActivity.startTime!.getTime()) / 1000,
    );
    return seconds;
}

export function resetCountdownTimers() {
    const singleSession = useSessionStore.getState().singleSession;
    const timestamp = new Date();
    const amount = singleSession.nestedSession!.sessionData!.find(
        (sd) => sd.sequence === singleSession.currentSequence,
    )!.amount;
    const projectedEnd = new Date(timestamp.getTime() + amount * 1000);
    singleSession.complexSetters.sessionData({
        startTime: timestamp,
        endTime: projectedEnd,
    });
}
