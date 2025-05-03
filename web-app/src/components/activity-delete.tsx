import { type Activity, deleteActivity } from "@/service/Activity";
import { Alert } from "@nextui-org/alert";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    useDisclosure,
} from "@nextui-org/modal";
import { useState } from "react";
import { BootstrapIcon } from "./icons";

export const ActivityDeleteControl = (params: {
    tgId: string;
    actId: string;
    onSuccess: (travelGuide: Activity[]) => void;
}) => {
    const deleteActivityModal = useDisclosure();
    const [secret, setSecret] = useState("");
    const [deleteError, setDeleteError] = useState(false);

    const deleteAct = async () => {
        try {
            setDeleteError(false);
            const result = await deleteActivity(
                params.tgId,
                params.actId,
                secret,
            );
            params.onSuccess(result);
        } catch (e) {
            setDeleteError(true);
        }
    };
    return (
        <>
            <Button
                className="ml-2"
                color="danger"
                onPress={deleteActivityModal.onOpen}
            >
                <BootstrapIcon name="trash-fill" />
            </Button>

            {/* Delete Activity Modal */}
            <Modal
                isOpen={deleteActivityModal.isOpen}
                onOpenChange={deleteActivityModal.onOpenChange}
                backdrop="blur"
                size="4xl"
                scrollBehavior="inside"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Delete Activity
                            </ModalHeader>
                            <ModalBody>
                                <p>
                                    Are you sure that you want to delete this
                                    Activity?
                                </p>
                                <p>
                                    To delete the Activity, the Travel Guide
                                    password is required.
                                </p>
                                {deleteError ? (
                                    <>
                                        <Alert
                                            description="Error while deleting the Activity"
                                            color="danger"
                                        >
                                            Check the password and try again.
                                        </Alert>
                                    </>
                                ) : (
                                    <></>
                                )}
                                <div>
                                    <Input
                                        name="password"
                                        className="mt-3"
                                        label="Password"
                                        placeholder="Travel Guide Password"
                                        type="password"
                                        isRequired
                                        value={secret}
                                        onValueChange={setSecret}
                                    />
                                </div>
                                <div className="flex justify-end mb-4 mt-3">
                                    <div className="grow-1" />
                                    <Button
                                        color="default"
                                        onPress={onClose}
                                        className="mr-2"
                                    >
                                        <BootstrapIcon name="x-circle-fill" />
                                        Cancel
                                    </Button>
                                    <Button
                                        color="danger"
                                        isDisabled={secret.length < 1}
                                        onPress={deleteAct}
                                    >
                                        <BootstrapIcon name="trash-fill" />
                                        Delete
                                    </Button>
                                </div>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};
