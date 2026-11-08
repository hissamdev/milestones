import { useRoutineStore } from "@/stores/routine-stores/routineStore";
const singleRoutine = useRoutineStore.getState().singleRoutine;
export function calculateEnd(startTime: Date, seconds: number) {
    return new Date(startTime.getTime() + seconds * 1000);
}

export function resetCountdownTimers() {
    const time = new Date();
    singleRoutine.markStart(time);
    singleRoutine.complexSetters.activity(
        "endTime",
        calculateEnd(time, singleRoutine.findSingleActivity().workAmount),
    );
}

export function shouldResetCountdown(endTime: Date) {
    const check = endTime < new Date();
    if (check) {
        resetCountdownTimers();
        return;
    }
}

type InitParms =
    | {
          isRest: true;
          useStopwatch: boolean;
          startTime: Date | null;
          endTime: Date | null;
          type?: "reps" | "duration";
      }
    | {
          isRest: false;
          useStopwatch?: boolean;
          startTime: Date | null;
          endTime: Date | null;
          type: "reps" | "duration";
      };

export function initCountdown(options: InitParms) {
    const timestamp = new Date();
    if (!options.startTime && !options.isRest) {
        if (!(options.type === "duration")) {
            singleRoutine.markStart(timestamp);
            return;
        }
        resetCountdownTimers();
        return;
    }

    if (options.startTime && !options.isRest && options.type === "duration") {
        shouldResetCountdown(options.endTime!);
        return;
    }

    if (!options.startTime && options.isRest) {
        if (!options.useStopwatch) {
            // Countdown rest
            resetCountdownTimers();
            return;
        }
        singleRoutine.markStart(timestamp);
        return;
    }

    if (options.startTime && options.isRest) {
        if (!options.useStopwatch) {
            shouldResetCountdown(options.endTime!);
        }
    }
}
