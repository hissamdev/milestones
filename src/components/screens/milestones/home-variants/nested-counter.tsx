import { useMilestoneStore } from "@/stores/milestones-store/milestones-store";
import { useRouter } from "expo-router";
import { Plus, X } from "lucide-react-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useShallow } from "zustand/react/shallow";

type Props = {
    id: string;
};

export default function NestedCounterHome({ id }: Props) {
    const { milestone, actions } = useMilestoneStore(
        useShallow((state) => ({
            milestone: state.milestones.find((m) => m.id === id)!,
            actions: state.actions,
        })),
    );
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState<
        (typeof milestone.categories)[0] | null
    >(null);
    const [showCategories, setShowCategories] = useState(false);

    return (
        <View
            style={{
                paddingHorizontal: 15,
                paddingTop: 10,
                paddingBottom: 20,
                backgroundColor: "white",
                position: "relative",
            }}
        >
            <View style={{ display: "flex", flexDirection: "row" }}>
                <Text style={{ fontSize: 20, fontWeight: 500 }}>
                    {milestone.name}
                </Text>
                <Text>{milestone.type}</Text>
            </View>
            <View
                style={{
                    marginTop: 10,
                    display: "flex",
                    flexDirection: "row",
                    gap: 10,
                }}
            >
                <View style={{ flex: 1, position: "relative" }}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPressIn={() => setShowCategories((prev) => !prev)}
                        style={{
                            paddingHorizontal: 15,
                            paddingVertical: 5,
                            borderWidth: 1,
                            borderRadius: 5,
                        }}
                    >
                        <Text>{selectedCategory?.name || "Select"}</Text>
                    </TouchableOpacity>
                    {showCategories && (
                        <View
                            style={{
                                position: "absolute",
                                top: "100%",
                                marginTop: 10,
                                width: "100%",
                                backgroundColor: "white",
                                borderRadius: 10,
                                zIndex: 100,
                            }}
                        >
                            <View
                                style={{
                                    padding: 20,
                                }}
                            >
                                <View
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <Text style={{ fontSize: 16 }}>
                                        Select an activity
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => setShowCategories(false)}
                                    >
                                        <Text>
                                            <X size={17} />
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ marginTop: 10 }}>
                                    {milestone.categories.map((c) => (
                                        <TouchableOpacity
                                            onPress={() => {
                                                setSelectedCategory(c);
                                                setShowCategories(false);
                                            }}
                                            key={c.id}
                                            style={{
                                                paddingHorizontal: 10,
                                                height: 30,
                                                display: "flex",
                                                flexDirection: "row",
                                                alignItems: "center",
                                                borderWidth: 1,
                                                borderRadius: 5,
                                            }}
                                        >
                                            <Text>{c.name}</Text>
                                        </TouchableOpacity>
                                    ))}
                                    <TouchableOpacity
                                        style={{
                                            marginTop: 100,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            height: 50,
                                            borderWidth: 1,
                                            borderRadius: 5,
                                        }}
                                    >
                                        <Text>Create Category</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}
                </View>
                <TouchableOpacity
                    style={{
                        paddingHorizontal: 15,
                        paddingVertical: 5,
                        borderWidth: 1,
                        borderRadius: 5,
                    }}
                >
                    <Text>Log</Text>
                </TouchableOpacity>
            </View>

            <View
                style={{
                    marginTop: 15,
                    paddingHorizontal: 5,
                    borderRadius: 5,
                    display: "flex",
                }}
            >
                <Text style={{ fontSize: 15, fontWeight: 500 }}>Entries</Text>
                <View style={{ display: "flex", gap: 15 }}>
                    {milestone["nestedCounterData"]?.map((nc, idx) => (
                        <View
                            key={nc.id}
                            style={{
                                paddingBottom: 15,
                                borderBottomWidth: 1,
                                borderBottomColor: "gray",
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    router.push({
                                        pathname:
                                            "/milestone-screens/nested-counter-focus-screen",
                                        params: {
                                            milestoneId: milestone.id,
                                            dataId: nc.id,
                                            activityId: nc.activity!.id,
                                        },
                                    });
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
                                        <Text
                                            style={{
                                                fontSize: 18,
                                                fontWeight: 500,
                                            }}
                                        >
                                            {nc.activity?.name}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                fontWeight: 500,
                                                textTransform: "uppercase",
                                            }}
                                        >
                                            {nc.timestamp.toLocaleTimeString(
                                                "en-US",
                                                {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                },
                                            )}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        style={{
                                            marginTop: 3,
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: 5,
                                        }}
                                    >
                                        <Plus color="#3BAC88" size={16} />
                                        <Text
                                            style={{
                                                color: "#3BAC88",
                                                fontWeight: 500,
                                            }}
                                        >
                                            Open
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                            {/* Sub entries */}
                            <View style={{ marginTop: 10 }}>
                                <Text
                                    style={{
                                        marginBottom: 5,
                                        fontSize: 11,
                                        fontWeight: 500,
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Sub entries
                                </Text>
                                <View
                                    style={{
                                        marginTop: 2,
                                        borderLeftWidth: 1,
                                        display: "flex",
                                        gap: 3,
                                    }}
                                >
                                    {nc.subEntriesData.map((se) => (
                                        <View
                                            style={{
                                                paddingLeft: 10,
                                                display: "flex",
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <Text>{se.template.name}</Text>
                                            <Text>
                                                {se.timestamp.toLocaleTimeString(
                                                    "en-US",
                                                    {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    },
                                                )}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}
