import { createMilestone } from "@/utils/milestoneHelpers";
import { SetStateAction, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function CreateMS({
    setShow,
}: {
    setShow: React.Dispatch<SetStateAction<boolean>>;
}) {
    const [emoji, setEmoji] = useState("");
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [type, setType] = useState<
        "duration-counter" | "normal-counter" | "switch" | "select"
    >("select");
    const [error, setError] = useState("");

    const handleCreateMilestone = async () => {
        const res = await createMilestone(emoji, name, desc, type);
        if (!res.success) {
            setError(res.message);
        }
        setError(res.message);
    };

    return (
        <TouchableOpacity
            onPress={() => setShow(false)}
            style={{
                position: "absolute",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderColor: "black",
                borderWidth: 1,
                borderRadius: 5,
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                top: 0,
                bottom: 0,
                right: 0,
                left: 0,
            }}
        >
            <TouchableOpacity
                onPress={(e) => e.stopPropagation()}
                activeOpacity={1}
                style={{
                    width: "90%",
                    height: 400,
                    // borderColor: "black",
                    // borderWidth: 1,
                    borderRadius: 15,
                    backgroundColor: "white",
                    paddingVertical: 30,
                    paddingHorizontal: 15,
                }}
            >
                <Text style={{ fontSize: 18 }}>Create Milestone</Text>
                <View
                    style={{
                        marginTop: 20,
                        display: "flex",
                        flexDirection: "row",
                        gap: 10,
                    }}
                >
                    <View
                        style={{
                            width: 30,
                            height: 30,
                            borderColor: "black",
                            borderWidth: 1,
                            borderRadius: 4,
                        }}
                    ></View>
                    <TextInput
                        value={name}
                        onChangeText={(e) => setName(e)}
                        style={{
                            paddingVertical: 0,
                            paddingTop: 0,
                            paddingBottom: 0,
                            borderColor: "black",
                            borderWidth: 1,
                            borderRadius: 4,
                            flex: 1,
                        }}
                        placeholder="Milestone name"
                    ></TextInput>
                </View>
                <TextInput
                    value={desc}
                    onChangeText={(e) => setDesc(e)}
                    style={{
                        height: 55,
                        textAlignVertical: "top",
                        marginTop: 20,
                        paddingTop: 5,
                        paddingBottom: 0,
                        borderColor: "black",
                        borderWidth: 1,
                        borderRadius: 4,
                    }}
                    placeholder="Enter milestone description"
                ></TextInput>

                <View
                    style={{
                        marginTop: 20,
                        display: "flex",
                        flexDirection: "row",
                        gap: 10,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => setType("duration-counter")}
                        style={{
                            paddingHorizontal: 12,
                            paddingVertical: 4,
                            borderColor: "black",
                            borderWidth: 1,
                            borderRadius: 4,
                            backgroundColor:
                                type === "duration-counter"
                                    ? "lightblue"
                                    : "white",
                        }}
                    >
                        <Text>Duration</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setType("normal-counter")}
                        style={{
                            paddingHorizontal: 12,
                            paddingVertical: 4,
                            borderColor: "black",
                            borderWidth: 1,
                            borderRadius: 4,
                            backgroundColor:
                                type === "normal-counter"
                                    ? "lightblue"
                                    : "white",
                        }}
                    >
                        <Text>Counter</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setType("switch")}
                        style={{
                            paddingHorizontal: 12,
                            paddingVertical: 4,
                            borderColor: "black",
                            borderWidth: 1,
                            borderRadius: 4,
                            backgroundColor:
                                type === "switch" ? "lightblue" : "white",
                        }}
                    >
                        <Text>Switch</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={handleCreateMilestone}
                    style={{
                        marginTop: 20,
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderColor: "black",
                        borderWidth: 1,
                        borderRadius: 4,
                    }}
                >
                    <Text style={{ textAlign: "center" }}>
                        Create Milestone
                    </Text>
                </TouchableOpacity>
                <Text>{error}</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );
}
