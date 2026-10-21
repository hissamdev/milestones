import { SetStateAction, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Routines({
    showModal,
}: {
    showModal: React.Dispatch<SetStateAction<boolean>>;
}) {
    const [routines, setRoutines] = useState([]);

    return (
        <View style={{ marginTop: 10, paddingBottom: 30 }}>
            <Text style={{ fontSize: 24, fontWeight: 500 }}>Routines</Text>
            <View style={{ marginTop: 10 }}>
                {routines.length ? (
                    routines.map((routine) => (
                        <View>
                            <Text>routine here</Text>
                        </View>
                    ))
                ) : (
                    <TouchableOpacity
                        onPress={() => showModal(true)}
                        style={{ paddingVertical: 4, borderWidth: 1 }}
                    >
                        <Text style={{ textAlign: "center" }}>
                            Create your first routine
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}
