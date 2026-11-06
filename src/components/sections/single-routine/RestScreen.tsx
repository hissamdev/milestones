import { TopLevelData } from "@/app/routines/routine-focus-screen";
import { useRoutineStore } from "@/stores/routine-stores/routineStore";
import { DayTemplateTEE } from "@/types/routineTypes";
import { ChevronLeft, ChevronRight, RefreshCcwIcon } from "lucide-react-native";
import { SetStateAction, useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useShallow } from "zustand/react/shallow";

type Props = {
    routineId: string;
    routineTemplate: DayTemplateTEE["routineTemplate"];
    currentSequence: number;
    setCurrentSequence: React.Dispatch<SetStateAction<number>>;
    dataId: string;
    topLevelData: TopLevelData | null;
};

export default function RestScreen() {
    // const [displayTimer, setDisplayTimer] = useState(0);
    // const [useStopwatch, setUseStopwatch] = useState(true);

    // const router = useRouter();

    // useEffect(() => {
    //     const load = async () => {
    //         const isNextAvailable = routineTemplate.templateExercises.find(
    //             (te) => te.sequence === currentSequence + 1,
    //         );
    //         if (!isNextAvailable) {
    //             setIsNextAvailable(false);
    //             return;
    //         }
    //         setIsNextAvailable(true);
    //         handleInitialization();
    //     };

    //     load();
    // }, [currentSequence]);

    // useEffect(() => {
    //     console.log("Effect ran", useStopwatch);
    //     if (!restData || !restData.startTime || !restData.endTime) {
    //         return;
    //     }

    //     const customEnd = new Date().getTime() + 5 * 1000;
    //     const calculateDisplayTime = () => {
    //         const countdown = Math.floor(
    //             (customEnd - new Date().getTime()) / 1000,
    //         );
    //         if (countdown < 0) {
    //             handleNextSequence("auto");
    //             return;
    //         }

    //         setDisplayTimer(() => {
    //             if (!useStopwatch) {
    //                 return countdown;
    //             } else {
    //                 return Math.floor(
    //                     (new Date().getTime() - restData.startTime!.getTime()) /
    //                         1000,
    //                 );
    //             }
    //         });
    //     };

    //     calculateDisplayTime();

    //     const timer = setInterval(() => {
    //         calculateDisplayTime();
    //     }, 100);
    //     return () => clearInterval(timer);
    // }, [restData, useStopwatch]);

    // const handleInitialization = async () => {
    //     const currentRest = routineTemplate.templateExercises.find(
    //         (te) => te.sequence === currentSequence,
    //     );

    //     if (!displayTimer) {
    //         setDisplayTimer(currentRest?.displayRestAmount!);
    //     }

    //     const restData = await initializeRestData(
    //         dataId,
    //         currentRest!.displayRestAmount!,
    //         currentSequence,
    //     );
    //     if (!restData) return;
    //     setRestData(restData);
    //     setRestId(restData.id);
    // };

    // const handleNextSequence = (mode: "auto" | "manual") => {
    //     console.log("Next seq ran");
    //     if (!isNextAvailable) {
    //         router.push({
    //             pathname: "/routines/single-routine-screen",
    //             params: {
    //                 routineId,
    //             },
    //         });
    //         return;
    //     }
    //     completeRest(restId, mode === "auto" ? restData!.endTime! : new Date());
    //     setCurrentSequence((prev) => prev + 1);
    // };

    // const formatSeconds = () => {
    //     if (displayTimer < 60) {
    //         return displayTimer.toString();
    //     }
    //     const seconds = (displayTimer % 60).toString().padStart(2, "0");
    //     const minutes = Math.floor(displayTimer / 60)
    //         .toString()
    //         .padStart(2, "0");
    //     return `${minutes}:${seconds}`;
    // };

    const { singleRoutine } = useRoutineStore(
        useShallow((state) => ({ singleRoutine: state.singleRoutine })),
    );

    const current = singleRoutine.findSingleActivity();

    useEffect(() => {
        const load = async () => {
            if (!current.startTime) {
                const newTimestamp = new Date();
                singleRoutine.markStart(newTimestamp).catch((error) => {
                    console.error(error);
                    return;
                });
                return;
            }
        };
        load();
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: "#1950CE" }}>
            <View
                style={{
                    marginTop: 50,
                    marginHorizontal: 20,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        singleRoutine.updateSequence.decrement();
                    }}
                    style={{
                        padding: 10,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: 100,
                    }}
                >
                    <Text>
                        <ChevronLeft color="white" size={16} />
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        padding: 10,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: 100,
                    }}
                >
                    <Text>
                        <ChevronRight color="white" size={16} />
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={{ marginTop: 50 }}>
                <View
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                    }}
                >
                    <Text>Up Next</Text>
                    <View
                        style={{
                            width: 100,
                            height: 100,
                            backgroundColor: "gray",
                        }}
                    />
                    <Text>Plank</Text>
                    <Text></Text>
                </View>

                <View
                    style={{
                        marginTop: 100,
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <Text style={{ fontSize: 50, color: "white" }}>text</Text>
                    <Text style={{ fontSize: 30, color: "white" }}>
                        Remaining
                    </Text>
                </View>
            </View>
            <View
                style={{
                    marginTop: "auto",
                    marginBottom: 50,
                    height: 40,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "stretch",
                    justifyContent: "center",
                    gap: 30,
                }}
            >
                <TouchableOpacity
                    style={{
                        backgroundColor: "gray",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        aspectRatio: 1 / 1,
                        borderRadius: 100,
                    }}
                >
                    <RefreshCcwIcon color="white" size={17} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        backgroundColor: "gray",
                        display: "flex",
                        justifyContent: "center",
                        paddingHorizontal: 20,
                        borderRadius: 100,
                    }}
                >
                    <Text style={{ color: "white" }}>Switch to Stopwatch</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        backgroundColor: "gray",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        aspectRatio: 1 / 1,
                        borderRadius: 100,
                    }}
                >
                    <ChevronRight color="white" size={17} />
                </TouchableOpacity>
            </View>
        </View>
    );
}
