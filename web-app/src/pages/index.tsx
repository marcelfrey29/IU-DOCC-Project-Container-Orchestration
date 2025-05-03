import { BootstrapIcon } from "@/components/icons";
import DefaultLayout from "@/layouts/default";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { useNavigate } from "react-router-dom";

export default function IndexPage() {
    const routeTo = useNavigate();

    return (
        <DefaultLayout>
            <section className="pt-12 pb-12">
                <div className="text-center">
                    <h1 className="text-5xl font-bold text-primary tracking-tight leading-9">
                        Travel Guides
                    </h1>
                    <div className="mt-6 font-semibold leading-none tracking-tight">
                        <span className="text-2xl ">
                            Be inspired by travelers.
                        </span>
                        <br />
                        <span className="text-small uppercase text-default-600">
                            and
                        </span>
                        <br />
                        <span className="text-2xl">
                            Inspire other travelers.
                        </span>
                    </div>
                </div>
            </section>

            <section>
                <Card className="p-3 mt-6 mb-6">
                    <CardBody>
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="col-span-1">
                                <BootstrapIcon
                                    name="signpost-split-fill"
                                    className="text-4xl"
                                />
                                <h2 className="pt-3 text-3xl font-bold tracking-tight text-sky-600">
                                    Inspire and be inspired with Travel Guides.
                                </h2>
                                <p className="text-default-600 text-xl mt-3 mb-3">
                                    Are you ready to explore the world? Travel
                                    guides are your key to adventure! They're
                                    packed with amazing activities waiting to be
                                    discovered.
                                </p>
                                <Button
                                    className="mt-3 bg-sky-600 text-gray-200"
                                    onPress={() => routeTo("/travel-guides")}
                                >
                                    View all Travel Guides
                                    <BootstrapIcon name="chevron-right" />
                                </Button>
                            </div>
                            <div className="col-span-2">
                                <Image
                                    alt="NextUI Album Cover"
                                    src="/img/travel-guides-dark.png"
                                />
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card className="p-3 mt-6 mb-6">
                    <CardBody>
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="col-span-2">
                                <Image
                                    alt="NextUI Album Cover"
                                    src="/img/activities-dark.png"
                                />
                            </div>
                            <div className="col-span-1">
                                <BootstrapIcon
                                    name="activity"
                                    className="text-4xl"
                                />
                                <h2 className="pt-3 text-3xl font-bold tracking-tight text-sky-600">
                                    Activities for everyone.
                                </h2>
                                <p className="text-default-600 text-xl mt-3 mb-3">
                                    No matter what you're into, there's an
                                    activity for you! Whether you're feeling
                                    active, want to relax, or are looking to
                                    visit a museum, you'll find something
                                    perfect for you.
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card className="p-3 mt-6 mb-6">
                    <CardBody>
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="col-span-1">
                                <BootstrapIcon
                                    name="moon-stars-fill"
                                    className="text-4xl"
                                />
                                <h2 className="pt-3 text-3xl font-bold tracking-tight text-sky-600">
                                    Looks beautiful in dark and light.
                                </h2>
                                <p className="text-default-600 text-xl mt-3 mb-3">
                                    Activities during the day or at night? No
                                    worries! We support light- and darkmode, so
                                    you can enjoy them both!
                                </p>
                            </div>
                            <div className="col-span-2">
                                <Image
                                    alt="NextUI Album Cover"
                                    src="/img/travel-guide-mix.png"
                                />
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </section>
        </DefaultLayout>
    );
}
