import { DayTemplateTEE } from "@/app/routines/edit-routine-screen";
import { TopLevelData } from "@/app/routines/routine-focus-screen";
import { initializeRestData } from "@/utils/workouts/routineHelpers";
import { useRouter } from "expo-router";
import { ChevronLeft, ChevronRight, RefreshCcwIcon } from "lucide-react-native";
import { SetStateAction, useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
    routineId: string;
    routineTemplate: DayTemplateTEE["routineTemplate"];
    currentSequence: number;
    setCurrentSequence: React.Dispatch<SetStateAction<number>>;
    dataId: string;
    topLevelData: TopLevelData | null;
};

export default function RestScreen({
    routineId,
    routineTemplate,
    currentSequence,
    setCurrentSequence,
    dataId,
    topLevelData,
}: Props) {
    const [isNextAvailable, setIsNextAvailable] = useState(false);
    const [restData, setRestData] = useState<
        TopLevelData["dataExercises"][0] | null
    >(null);
    const [restId, setRestId] = useState("");

    const router = useRouter();

    useEffect(() => {
        const load = async () => {
            const isNextAvailable = routineTemplate.templateExercises.find(
                (te) => te.sequence === currentSequence + 1,
            );
            if (!isNextAvailable) {
                setIsNextAvailable(false);
                return;
            }
            setIsNextAvailable(true);

            const currentRest = routineTemplate.templateExercises.find(
                (te) => te.sequence === currentSequence,
            );

            const restData = await initializeRestData(
                dataId,
                currentRest!.displayRestAmount!,
                currentSequence,
            );
            if (!restData) return;
            setRestData(restData);
            setRestId(restData.id);
        };

        load();
    }, [currentSequence]);

    const handleNextSequence = () => {
        if (!isNextAvailable) {
            router.push({
                pathname: "/routines/single-routine-screen",
                params: {
                    routineId,
                },
            });
            return;
        }

        setCurrentSequence((prev) => prev + 1);
    };

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
                    <Text>60s - 32</Text>
                </View>

                <View
                    style={{
                        marginTop: 100,
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <Text style={{ fontSize: 50, color: "white" }}>60s</Text>
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
                    onPress={handleNextSequence}
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
