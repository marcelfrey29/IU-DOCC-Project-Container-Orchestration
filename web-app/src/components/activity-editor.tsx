import { categoryConfig } from "@/config/category";
import {
    type Activity,
    createActivity,
    type CreateActivityRequest,
    updateActivity,
} from "@/service/Activity";
import { Category } from "@/service/Shared";
import { Alert } from "@nextui-org/alert";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { Form } from "@nextui-org/form";
import { Input } from "@nextui-org/input";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    useDisclosure,
} from "@nextui-org/modal";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { Select, SelectItem } from "@nextui-org/select";
import { useState } from "react";
import { BootstrapIcon } from "./icons";

export const ActivityEditor = (params: {
    type: "create" | "update";
    travelGuideId: string;
    data?: Activity;
    onSuccess: (travelGuide: Activity[]) => void;
}) => {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [showUpdateError, setUpdateError] = useState(false);

    // biome-ignore lint/suspicious/noExplicitAny:
    const onSubmit = async (e: any) => {
        e.preventDefault();
        const data = Object.fromEntries(
            new FormData(e.currentTarget),
        ) as Record<string, string>;

        const createActivityRequest: CreateActivityRequest = {
            activity: {
                name: data.name,
                description: data.description,
                location: {
                    street: data.street,
                    zip: data.zip,
                    city: data.city,
                    state: data.state,
                    country: data.country,
                },
                category: Number.parseInt(
                    data.category ?? Category.MIX,
                ) as unknown as Category,
                costsInCent: Number.parseFloat(data.costs) * 100,
                timeInMin: Number.parseInt(data.time),
            },
        };
        const secret = data.password;

        try {
            let activity: Activity[] = [];
            if (params.type === "create") {
                activity = await createActivity(
                    params.travelGuideId,
                    createActivityRequest,
                    secret,
                );
            } else {
                activity = await updateActivity(
                    params.travelGuideId,
                    params.data?.id ?? "unknown",
                    createActivityRequest,
                    secret,
                );
            }
            params.onSuccess(activity);
            onClose();
        } catch (e) {
            setUpdateError(true);
        }
    };

    return (
        <>
            <Button className="mt-3" color="primary" onPress={onOpen}>
                {params.type === "create" ? (
                    <>
                        <BootstrapIcon name="plus-circle-fill" />
                        Add Activity
                    </>
                ) : (
                    <>
                        <BootstrapIcon name="pencil-fill" />
                    </>
                )}
            </Button>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                backdrop="blur"
                size="4xl"
                scrollBehavior="inside"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                {params.type === "create" ? (
                                    <>
                                        <span id="act-editor-title">
                                            Create a new Activity
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span id="act-editor-title">
                                            Update an Activity
                                        </span>
                                    </>
                                )}
                            </ModalHeader>
                            <ModalBody>
                                <Form
                                    className="grid"
                                    validationBehavior="native"
                                    onSubmit={onSubmit}
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Input
                                                name="name"
                                                className="mt-2"
                                                label="Name"
                                                placeholder="What to do?"
                                                defaultValue={
                                                    params?.data?.name
                                                }
                                                isRequired
                                                isClearable
                                                minLength={1}
                                            />
                                            <Input
                                                name="description"
                                                className="mt-2"
                                                label="Description"
                                                placeholder="Describe the Activity"
                                                defaultValue={
                                                    params?.data?.description
                                                }
                                                isClearable
                                            />
                                            <Select
                                                name="category"
                                                className="mt-2"
                                                label="Category"
                                                defaultSelectedKeys={[
                                                    (
                                                        params.data?.category ??
                                                        Category.MIX
                                                    ).toString(),
                                                ]}
                                            >
                                                {categoryConfig.map(
                                                    (category) => (
                                                        <SelectItem
                                                            key={category.key}
                                                        >
                                                            {category.label}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </Select>

                                            <Input
                                                name="time"
                                                className="mt-2"
                                                type="number"
                                                min={0}
                                                max={1440 /* 24 hours */}
                                                label="Expected Time (Minutes)"
                                                placeholder="How long does this activity take?"
                                                defaultValue={
                                                    params?.data?.timeInMin
                                                        ? params?.data?.timeInMin.toString()
                                                        : ""
                                                }
                                                isClearable
                                            />

                                            <Input
                                                name="costs"
                                                className="mt-2"
                                                type="number"
                                                label="Expected Cost (€ / Person)"
                                                placeholder="What are the costs of this activity?"
                                                defaultValue={(
                                                    (params?.data
                                                        ?.costsInCent ?? 0) /
                                                    100
                                                )?.toString()}
                                                isClearable
                                            />
                                        </div>
                                        <div>
                                            <Input
                                                name="street"
                                                className="mt-2"
                                                label="Street"
                                                placeholder="Street"
                                                defaultValue={
                                                    params?.data?.location
                                                        .street
                                                }
                                                isClearable
                                            />
                                            <Input
                                                name="zip"
                                                className="mt-2"
                                                label="Zip Code"
                                                placeholder="Zip Code"
                                                defaultValue={
                                                    params?.data?.location.zip
                                                }
                                                isClearable
                                            />
                                            <Input
                                                name="city"
                                                className="mt-2"
                                                label="City"
                                                placeholder="City"
                                                defaultValue={
                                                    params?.data?.location.city
                                                }
                                                isClearable
                                            />
                                            <Input
                                                name="state"
                                                className="mt-2"
                                                label="State"
                                                placeholder="State"
                                                defaultValue={
                                                    params?.data?.location.state
                                                }
                                                isClearable
                                            />
                                            <Input
                                                name="country"
                                                className="mt-2"
                                                label="Country"
                                                placeholder="Country"
                                                defaultValue={
                                                    params?.data?.location
                                                        .country
                                                }
                                                isRequired
                                                isClearable
                                            />

                                            <Popover>
                                                <PopoverTrigger>
                                                    <div>
                                                        <Input
                                                            className="mt-2"
                                                            label="Planet"
                                                            placeholder=""
                                                            value={"🌎 Earth"}
                                                        />
                                                    </div>
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    <div className="px-1 py-2">
                                                        <div className="text-small">
                                                            Sorry, currently you
                                                            can only travel to
                                                            places on planet
                                                            earth.
                                                        </div>
                                                        <div className="text-tiny">
                                                            But good to know
                                                            you're interested in
                                                            visisting other
                                                            planets. 😅
                                                        </div>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>

                                    <Divider className="mt-2" />

                                    <div>
                                        <div className="mt-4">
                                            To update a Travel Guide, the
                                            Password is required.
                                        </div>

                                        {showUpdateError ? (
                                            <>
                                                <div className="mt-3">
                                                    <Alert
                                                        description="Error while updating the Travel Guide"
                                                        color="danger"
                                                    >
                                                        Check the password and
                                                        try again.
                                                    </Alert>
                                                </div>
                                            </>
                                        ) : (
                                            <></>
                                        )}

                                        <Input
                                            name="password"
                                            className="mt-2"
                                            label="Password"
                                            placeholder="Travel Guide Password"
                                            type="password"
                                            isRequired
                                            minLength={
                                                params.type === "create" ? 8 : 1
                                            }
                                        />
                                    </div>
                                    <div className="flex justify-end mb-4">
                                        <div className="grow-1" />
                                        <Button
                                            color="danger"
                                            onPress={onClose}
                                            className="mr-2"
                                        >
                                            <BootstrapIcon name="x-circle-fill" />
                                            Cancel
                                        </Button>
                                        {params.type === "create" ? (
                                            <>
                                                <Button
                                                    color="primary"
                                                    type="submit"
                                                >
                                                    <BootstrapIcon name="check-circle-fill" />
                                                    Create Activity
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    color="primary"
                                                    type="submit"
                                                >
                                                    <BootstrapIcon name="check-circle-fill" />
                                                    Update Activity
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </Form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};
