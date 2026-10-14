import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { Minus, Plus } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function DurationControlls() {
    const [notes, setNotes] = useState("");
    const [durationSeconds, setDurationSeconds] = useState<number>(0);
    const [unit, setUnit] = useState<"seconds" | "minutes">("seconds");
    const inputRef = useRef<TextInput>(null);

    const { id, dataId } = useLocalSearchParams();

    useEffect(() => {
        const keyboardSub = Keyboard.addListener("keyboardDidHide", () => {
            inputRef.current?.blur();
        });

        return () => {
            keyboardSub.remove();
        };
    });

    const renderSeconds = () => {
        if (unit === "seconds") {
            return durationSeconds.toString();
        }
        if (unit === "minutes") {
            if (!(Math.round(durationSeconds / 60) > 0)) {
                setDurationSeconds(0);
                return "0";
            }
            const converted = Math.round(durationSeconds / 60);
            setDurationSeconds(converted * 60);
            return converted.toString();
        }
    };

    const handleInputText = (e: string) => {
        // Validation
        const trimmed = e.trim();
        if (trimmed === "") {
            return;
        }

        const num = Number(trimmed);
        if ((trimmed.length > 0 && !Number.isInteger(num)) || num < 0) {
            return;
        }
        if (unit === "seconds") {
            setDurationSeconds(num);
            return;
        }
        if (unit === "minutes") {
            const secFromMins = num * 60;
            setDurationSeconds(secFromMins);
        }
    };

    const adjustSingle = (mode: "add" | "remove") => {
        if (mode === "add") {
            setDurationSeconds((prev) =>
                unit === "seconds" ? prev + 1 : prev + 60,
            );
        }
        if (mode === "remove") {
            setDurationSeconds((prev) => {
                if (!(prev - 1 > 0)) {
                    return 0;
                }
                return unit === "seconds" ? prev - 1 : prev - 60;
            });
        }
    };

    const adjustDuration = (mode: "add" | "remove", amount: number) => {
        if (mode === "add") {
            if (unit === "seconds") {
                setDurationSeconds((prev) => prev + amount);
            }
            if (unit === "minutes") {
                setDurationSeconds((prev) => prev + amount * 60);
            }
        }
        if (mode === "remove") {
            if (unit === "seconds") {
                setDurationSeconds((prev) => {
                    if (!(prev - amount > 0)) {
                        return 0;
                    }
                    return prev - amount;
                });
            }
            if (unit === "minutes") {
                setDurationSeconds((prev) => {
                    if (!(prev - amount > 0)) {
                        return 0;
                    }
                    return prev - amount * 60;
                });
            }
        }
    };

    const handleConversion = () => {
        if (unit === "seconds") {
            setUnit("minutes");
            return;
        }

        if (unit === "minutes") {
            setUnit("seconds");
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={{ padding: 15, backgroundColor: "#FBF2EE", flex: 1 }}>
                <Text>{id}</Text>
                <View
                    style={{
                        marginTop: 100,
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        backgroundColor: "white",
                        borderRadius: 8,
                    }}
                >
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <Text>Entry Description & Notes</Text>
                        <Text>Optional</Text>
                    </View>
                    <TextInput
                        value={notes}
                        onChangeText={(e) => setNotes(e)}
                        style={{
                            paddingLeft: 10,
                            paddingRight: 10,
                            marginTop: 20,
                            backgroundColor: "#FBF2EE",
                            borderRadius: 4,
                        }}
                        placeholder="Add notes"
                    />
                </View>
                <View
                    style={{
                        marginTop: 40,
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        backgroundColor: "white",
                        borderRadius: 8,
                    }}
                >
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <Text>Images</Text>
                        <Text>3 added</Text>
                    </View>
                    <View
                        style={{
                            marginTop: 20,
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            gap: 20,
                        }}
                    >
                        <Image
                            source={require("../../assets/images/bottle.png")}
                            style={{ width: 80, height: 80, borderRadius: 10 }}
                        />
                        <Image
                            source={require("../../assets/images/bottle.png")}
                            style={{ width: 80, height: 80, borderRadius: 10 }}
                        />
                        <TouchableOpacity
                            style={{ width: 80, height: 80, borderRadius: 10 }}
                        >
                            <Text>Add</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View
                    style={{
                        marginTop: 40,
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        backgroundColor: "white",
                        borderRadius: 8,
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
                        <Text>Log Duration</Text>
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                padding: 4,
                                backgroundColor: "#F5ECE8",
                                borderRadius: 100,
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    paddingHorizontal: 12,
                                    paddingVertical: 3,
                                    backgroundColor: "white",
                                    borderRadius: 100,
                                }}
                            >
                                <Text>Manual</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    paddingHorizontal: 12,
                                    paddingVertical: 3,
                                }}
                            >
                                <Text>Live Timer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View
                        style={{
                            marginTop: 20,
                            paddingHorizontal: 8,
                            paddingVertical: 10,
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            backgroundColor: "#F5ECE8",
                            borderRadius: 4,
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => adjustSingle("remove")}
                            style={{
                                padding: 10,
                                backgroundColor: "white",
                                borderRadius: 100,
                            }}
                        >
                            <Text>
                                <Minus />
                            </Text>
                        </TouchableOpacity>
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <TextInput
                                ref={inputRef}
                                keyboardType="number-pad"
                                value={renderSeconds()}
                                onChangeText={(e) => {
                                    handleInputText(e);
                                }}
                                cursorColor="tomato"
                                placeholder="00"
                                style={{
                                    fontSize: 20,
                                    borderColor: "black",
                                    alignSelf: "center",
                                }}
                            />
                            <TouchableOpacity onPress={handleConversion}>
                                <Text>
                                    {unit === "seconds" ? "Seconds" : "Minutes"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={{
                                padding: 10,
                                backgroundColor: "white",
                                borderRadius: 100,
                            }}
                            onPress={() => adjustSingle("add")}
                        >
                            <Text>
                                <Plus />
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            marginTop: 20,
                            paddingHorizontal: 8,
                            paddingVertical: 10,
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 10,
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => adjustDuration("remove", 10)}
                            style={{
                                paddingVertical: 4,
                                backgroundColor: "#F5ECE8",
                                flexGrow: 1,
                                borderRadius: 6,
                            }}
                        >
                            <Text style={{ textAlign: "center" }}>
                                -10{unit === "seconds" ? "s" : "m"}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => adjustDuration("remove", 5)}
                            style={{
                                paddingVertical: 4,
                                backgroundColor: "#F5ECE8",
                                flexGrow: 1,
                                borderRadius: 6,
                            }}
                        >
                            <Text style={{ textAlign: "center" }}>
                                -5{unit === "seconds" ? "s" : "m"}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => adjustDuration("add", 5)}
                            style={{
                                paddingVertical: 4,
                                backgroundColor: "#F5ECE8",
                                flexGrow: 1,
                                borderRadius: 6,
                            }}
                        >
                            <Text style={{ textAlign: "center" }}>
                                +5{unit === "seconds" ? "s" : "m"}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => adjustDuration("add", 10)}
                            style={{
                                paddingVertical: 4,
                                backgroundColor: "#F5ECE8",
                                flexGrow: 1,
                                borderRadius: 6,
                            }}
                        >
                            <Text style={{ textAlign: "center" }}>
                                +10{unit === "seconds" ? "s" : "m"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}
