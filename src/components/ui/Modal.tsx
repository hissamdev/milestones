import { SetStateAction } from "react";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";

export default function Modal({
    customStyles,
    setModal,
    children,
}: {
    customStyles?: StyleProp<ViewStyle>;
    setModal: React.Dispatch<SetStateAction<boolean>>;
    children: React.ReactNode;
}) {
    const defaults = {
        height: 500,
        width: "90%",
        backgroundColor: "white",
        borderRadius: 8,
    } as StyleProp<ViewStyle>;

    return (
        <TouchableOpacity
            onPress={() => setModal(false)}
            style={{
                position: "absolute",
                backgroundColor: "rgba(0,0,0,0.5)",
                inset: 0,
                zIndex: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <TouchableOpacity
                onPress={(e) => e.stopPropagation()}
                activeOpacity={1}
                style={[defaults, customStyles]}
            >
                {children}
            </TouchableOpacity>
        </TouchableOpacity>
    );
}
