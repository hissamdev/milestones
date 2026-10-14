import { SetStateAction, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function CreateMS({
    setShow,
}: {
    setShow: React.Dispatch<SetStateAction<boolean>>;
}) {
    const [name, setName] = useState("");

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
                    placeholder="Milestone name"
                ></TextInput>
            </TouchableOpacity>
        </TouchableOpacity>
    );
}
