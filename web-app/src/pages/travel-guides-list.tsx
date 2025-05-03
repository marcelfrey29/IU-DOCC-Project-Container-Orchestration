import { BootstrapIcon } from "@/components/icons";
import { TravelGuideEditor } from "@/components/travel-guide-editor";
import { categoryConfig } from "@/config/category";
import DefaultLayout from "@/layouts/default";
import { getTravelGuides, type TravelGuide } from "@/service/TravelGuide";
import { Button } from "@nextui-org/button";
import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@nextui-org/table";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TravelGuidesListPage() {
    const [travelGuides, setTravelGuides] = useState([] as TravelGuide[]);
    const routeTo = useNavigate();

    const getTravelGuideData = async () => {
        setTravelGuides(await getTravelGuides());
    };
    // biome-ignore lint/correctness/useExhaustiveDependencies:
    useEffect(() => {
        getTravelGuideData();
    }, []);
    const travelGuideTableRows = travelGuides.map((tg) => {
        return (
            <>
                <TableRow key={tg.id}>
                    <TableCell>
                        {tg.isPrivate === true ? (
                            <BootstrapIcon
                                name="lock-fill"
                                className="text-danger"
                            />
                        ) : (
                            <BootstrapIcon
                                name="globe-americas"
                                className="text-success"
                            />
                        )}
                    </TableCell>
                    <TableCell>
                        <b>{tg.name}</b>
                    </TableCell>
                    <TableCell>{tg.description}</TableCell>
                    <TableCell>
                        {tg.isPrivate === true ? (
                            <span />
                        ) : (
                            <span>
                                {
                                    categoryConfig.find(
                                        (c) => c.key === tg.category,
                                    )?.label
                                }
                            </span>
                        )}
                    </TableCell>
                    <TableCell>
                        <Button
                            onPress={() => routeTo(`/travel-guides/${tg.id}`)}
                            color="primary"
                        >
                            View Travel Guide{" "}
                            <BootstrapIcon name="arrow-right" />
                        </Button>
                    </TableCell>
                </TableRow>
            </>
        );
    });

    return (
        <DefaultLayout>
            <section>
                <h2 className="text-3xl text-primary-500">Travel Guides</h2>
                <p className="mt-3">
                    Here you can find a list of Travel Guides or create your
                    own.
                </p>
                <TravelGuideEditor
                    type="create"
                    onSuccess={getTravelGuideData}
                />

                {/* <div className="mt-4">
                    <Alert
                        key="created-tg-alert"
                        color="success"
                        title={`Created Travel Guide`}
                        description=""
                        variant="flat"
                    />
                    <Alert
                        key="error-tg-alert"
                        color="danger"
                        title={`Creation of Travel Guide failed.`}
                        description=""
                        variant="flat"
                    />
                </div> */}
            </section>

            <section className="mt-6">
                <Table aria-label="Example static collection table">
                    <TableHeader>
                        <TableColumn>Visibility</TableColumn>
                        <TableColumn>Name</TableColumn>
                        <TableColumn>Description</TableColumn>
                        <TableColumn>Category</TableColumn>
                        <TableColumn>Action</TableColumn>
                    </TableHeader>
                    <TableBody
                        emptyContent={
                            "No Travel Guides. Create a Travel Guide with the 'Create Travel Guide' button above."
                        }
                    >
                        {travelGuideTableRows}
                    </TableBody>
                </Table>
            </section>
        </DefaultLayout>
    );
}
