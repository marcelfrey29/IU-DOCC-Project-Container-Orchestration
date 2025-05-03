import { BootstrapIcon } from "@/components/icons";
import DefaultLayout from "@/layouts/default";
import { Button } from "@nextui-org/button";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
    const routeTo = useNavigate();

    return (
        <DefaultLayout>
            <section className="mt-6 mb-12">
                <BootstrapIcon
                    name="exclamation-circle-fill"
                    className="text-3xl text-danger"
                ></BootstrapIcon>
                <p className="font-mono text-4xl">
                    <b>404</b>
                </p>
                <p className="text-3xl">Not Found.</p>
                <p className="mt-3 text-2xl">
                    The page you are looking for doesn't exist.
                </p>
                <Button
                    className="mt-4"
                    color="primary"
                    onPress={() => routeTo(`/`)}
                >
                    <BootstrapIcon name="house-fill" /> Go to Homepage
                </Button>
            </section>
        </DefaultLayout>
    );
}
