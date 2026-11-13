import EditExercises from "@/components/screens/workout/sessions/ui/EditExercise";
import ExercisePicker from "@/components/ui/popups/ExercisePicker";
import Popup from "@/components/ui/popups/Popup";
import { useTemplateStore } from "@/stores/template-store";
import { useWorkoutsGlobalState } from "@/stores/workouts-global-store";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useShallow } from "zustand/react/shallow";

export default function TemplateEditScreen() {
    const { activeModal, openModal, closeModal } = useWorkoutsGlobalState(
        useShallow((state) => ({
            activeModal: state.activeModal,
            openModal: state.openModal,
            closeModal: state.closeModal,
        })),
    );

    const { templateId }: { templateId: string } = useLocalSearchParams();

    const { template, actions } = useTemplateStore(
        useShallow((state) => ({
            template: state.template,
            actions: state.actions,
        })),
    );

    useEffect(() => {
        actions.fetchSingleTemplate(templateId);
        console.log("Refetched");
    }, []);

    return (
        <>
            <SafeAreaView>
                <View style={{ padding: 20 }}>
                    <Text>Template Edit screen</Text>
                    <View
                        style={{
                            marginTop: 10,
                            display: "flex",
                            flexDirection: "row",
                            height: 40,
                            gap: 10,
                        }}
                    >
                        <TouchableOpacity
                            onPress={() =>
                                openModal("exercises", "template-picker")
                            }
                            style={{ flex: 1, backgroundColor: "lightblue" }}
                        >
                            <Text style={{ margin: "auto" }}>
                                Insert Exercise
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <EditExercises />
                    </View>
                </View>
            </SafeAreaView>
            <Popup
                visible={activeModal.modal === "exercises"}
                setModal={closeModal}
            >
                <ExercisePicker />
            </Popup>
        </>
    );
}
