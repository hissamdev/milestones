import { Plus } from "lucide-react-native";
import { useState } from "react";
import { Text, TouchableOpacity } from "react-native";

export default function CreateExercise() {
    const [showCreateExercise, setShowCreateExercise] = useState(false);

    return (
        <>
            <TouchableOpacity
                onPress={() => setShowCreateExercise((prev) => !prev)}
                style={{
                    position: "absolute",
                    width: 50,
                    height: 50,
                    backgroundColor: "blue",
                    bottom: 60,
                    right: 20,
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Plus color="white" />
            </TouchableOpacity>
            {showCreateExercise && <CreateExerciseModal />}
        </>
    );
}

const CreateExerciseModal = () => {
    return (
        <TouchableOpacity
            style={{
                position: "absolute",
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
            activeOpacity={1}
        >
            <TouchableOpacity
                activeOpacity={1}
                style={{
                    paddingVertical: 30,
                    paddingHorizontal: 30,
                    width: "90%",
                    height: 500,
                    backgroundColor: "white",
                    borderRadius: 10,
                }}
            >
                <Text>Create Exercise</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );
};
