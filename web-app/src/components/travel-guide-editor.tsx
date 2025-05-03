import { categoryConfig } from "@/config/category";
import { Category } from "@/service/Shared";
import {
    createTravelGuide,
    CreateTravelGuideRequest,
    TravelGuide,
    updateTravelGuide,
} from "@/service/TravelGuide";
import { Alert } from "@nextui-org/alert";
import { Button } from "@nextui-org/button";
import { Checkbox } from "@nextui-org/checkbox";
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

export const TravelGuideEditor = (params: {
    type: "create" | "update";
    data?: TravelGuide;
    onSuccess: (travelGuide: TravelGuide | null) => void;
}) => {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [showUpdateError, setUpdateError] = useState(false);

    const onSubmit = async (e: any) => {
        e.preventDefault();
        const data = Object.fromEntries(
            new FormData(e.currentTarget),
        ) as Record<string, string>;

        const createTravelGuideRequest: CreateTravelGuideRequest = {
            travelGuide: {
                name: data.name,
                description: data.description,
                isPrivate: data.isPrivate === undefined ? false : true,
                location: {
                    street: data.street,
                    zip: data.zip,
                    city: data.city,
                    state: data.state,
                    country: data.country,
                },
                category: parseInt(
                    data.category ?? Category.MIX,
                ) as unknown as Category,
            },
            secret: data.password ?? "",
        };
        try {
            let travelGuide: TravelGuide | null;
            if (params.type === "create") {
                travelGuide = await createTravelGuide(createTravelGuideRequest);
            } else {
                travelGuide = await updateTravelGuide(
                    params.data?.id ?? "unknown",
                    createTravelGuideRequest,
                    data.password ?? "",
                );
            }
            params.onSuccess(travelGuide);
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
                        <BootstrapIcon name="plus-circle-fill"></BootstrapIcon>
                        Create Travel Guide
                    </>
                ) : (
                    <>
                        <BootstrapIcon name="pencil-fill"></BootstrapIcon>
                        Edit Travel Guide
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
                                    <>Create a new Travel Guide</>
                                ) : (
                                    <>Update a Travel Guide</>
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
                                                placeholder="Name your Travel Guide"
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
                                                placeholder="Details about your Travel Guide"
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

                                    <Divider className="mt-2"></Divider>

                                    <div>
                                        <div className="flex py-2 px-1 justify-between">
                                            <Checkbox
                                                name="isPrivate"
                                                defaultSelected={
                                                    params?.data?.isPrivate
                                                }
                                                size="md"
                                                classNames={{
                                                    label: "text-small",
                                                }}
                                            >
                                                Private
                                                <br />
                                                <span className="text-gray-500">
                                                    A private Travel Guide can
                                                    only be viewed with
                                                    Password. The name is always
                                                    public.
                                                </span>
                                            </Checkbox>
                                        </div>

                                        <Divider className="mt-2"></Divider>

                                        <div className="mt-4">
                                            {params.type === "create" ? (
                                                <>
                                                    The password is required to
                                                    edit your Travel Guides and
                                                    to view it when it is
                                                    private.
                                                </>
                                            ) : (
                                                <>
                                                    To update a Travel Guide,
                                                    the Password is required.
                                                </>
                                            )}
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
                                        <div className="grow-1"></div>
                                        <Button
                                            color="danger"
                                            onPress={onClose}
                                            className="mr-2"
                                        >
                                            <BootstrapIcon name="x-circle-fill"></BootstrapIcon>
                                            Cancel
                                        </Button>
                                        {params.type === "create" ? (
                                            <>
                                                <Button
                                                    color="primary"
                                                    type="submit"
                                                >
                                                    <BootstrapIcon name="check-circle-fill"></BootstrapIcon>
                                                    Create Travel Guide
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    color="primary"
                                                    type="submit"
                                                >
                                                    <BootstrapIcon name="check-circle-fill"></BootstrapIcon>
                                                    Update Travel Guide
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
