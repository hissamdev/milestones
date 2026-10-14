import CreateMS from "@/components/ui/CreateMS";
import { db } from "@/db/client";
import { milestoneData, milestones } from "@/db/schema";
import { getMilestones } from "@/utils/milestoneHelpers";
import { useRouter } from "expo-router";
import { Clock, Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

type Milestone = typeof milestones.$inferSelect;
type MilestoneData = typeof milestoneData.$inferSelect;

export type MilestoneWithData = Milestone & {
    data: MilestoneData[];
};

export default function Index() {
    const [showCreation, setShowCreation] = useState(false);
    const [milestones, setMilestones] = useState<MilestoneWithData[]>([]);

    useEffect(() => {
        const load = async () => {
            const res = await getMilestones();
            if (!res.success || !res.data) {
                console.error(res.message);
                return;
            }
            setMilestones(res.data);
        };
        load();
    }, []);

    const router = useRouter();
    const handleLog = async (
        id: string,
        type: string,
        // | "duration-counter"
        // | "normal-counter"
        // | "switch"
        // | "select",
    ) => {
        if (type === "duration-counter") {
            const res = await db
                .insert(milestoneData)
                .values({
                    milestoneId: id,
                })
                .returning();
            setMilestones((prev) =>
                prev.map((milestone) =>
                    milestone.id === id
                        ? {
                              ...milestone,
                              data: [res[0], ...milestone.data],
                          }
                        : {
                              ...milestone,
                          },
                ),
            );
            router.push({
                pathname: "/duration-controls",
                params: { id, dataId: res[0].id },
            });
            return;
        }
    };

    return (
        <ScrollView
            style={{
                position: "relative",
                paddingHorizontal: 15,
                flex: 1,
                backgroundColor: "#FBF2EE",
            }}
        >
            <View>
                <Text>Header</Text>
            </View>
            <TouchableOpacity
                onPress={() => setShowCreation((prev) => !prev)}
                style={{
                    alignSelf: "flex-start",
                    marginTop: 100,
                    paddingVertical: 12,
                    paddingHorizontal: 24,
                    borderColor: "black",
                    borderWidth: 1,
                }}
            >
                <Text>Create Property</Text>
            </TouchableOpacity>

            {showCreation && (
                <CreateMS
                    setShow={setShowCreation}
                    setMilestones={setMilestones}
                />
            )}
            <View style={{ marginTop: 35 }}>
                {milestones.map((m, idx) => (
                    <View
                        key={idx}
                        style={{
                            marginTop: 10,
                            paddingVertical: 12,
                            paddingHorizontal: 18,
                            backgroundColor: "white",
                            borderRadius: 12,
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                            }}
                        >
                            <View>
                                <Text style={{ fontSize: 22, fontWeight: 500 }}>
                                    {m.name}
                                </Text>
                                <View
                                    style={{
                                        marginTop: 10,
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: 10,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            paddingHorizontal: 12,
                                            paddingVertical: 2,
                                            color: "white",
                                            backgroundColor: true
                                                ? "#456778"
                                                : "red",
                                            borderRadius: 100,
                                        }}
                                    >
                                        No Entries
                                    </Text>
                                    <View
                                        style={{
                                            width: 8,
                                            height: 8,
                                            backgroundColor: "#56423C",
                                            borderRadius: 100,
                                        }}
                                    />
                                    <Text>40 min</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={() => handleLog(m.id, m.type)}
                                style={{
                                    paddingLeft: 4,
                                    paddingRight: 8,
                                    paddingVertical: 2,
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 5,
                                    backgroundColor: "#F5ECE8",
                                    borderRadius: 100,
                                }}
                            >
                                <Plus size={16} />
                                <Text style={{ fontSize: 12, fontWeight: 500 }}>
                                    Log
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                marginTop: 10,
                                paddingLeft: 20,
                                paddingRight: 10,
                                paddingHorizontal: 10,
                            }}
                        >
                            {m.data.map((d, idx) => (
                                <View
                                    key={idx}
                                    style={{
                                        marginTop: 5,
                                        padding: 10,
                                        backgroundColor: "#FBF2EE",
                                        borderRadius: 4,
                                    }}
                                >
                                    <View
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                        }}
                                    >
                                        <View
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                alignItems: "center",
                                                gap: 10,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 12,
                                                    fontWeight: 500,
                                                    color: "#56423C",
                                                    paddingHorizontal: 10,
                                                    backgroundColor: "#EAE1DD",
                                                    borderRadius: 6,
                                                }}
                                            >
                                                {d.createdAt.toLocaleTimeString(
                                                    "en-US",
                                                    {
                                                        hour: "numeric",
                                                        minute: "2-digit",
                                                        hour12: true,
                                                    },
                                                )}
                                            </Text>
                                            <View
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Text>
                                                    <Clock size={14} />
                                                </Text>
                                                <Text style={{ marginLeft: 2 }}>
                                                    {!d.duration && "??"}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                    <Text style={{ marginTop: 4 }}>
                                        {d.note}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}
