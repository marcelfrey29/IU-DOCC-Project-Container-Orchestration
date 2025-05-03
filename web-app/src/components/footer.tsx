import { Divider } from "@nextui-org/divider";
import { Link } from "@nextui-org/link";
import { BootstrapIcon } from "./icons";

export function Footer() {
    return (
        <footer className="text-foreground-500">
            <Divider className="my-4" />
            <div className="mt-6 grid grid-col-1 md:grid-cols-3 max-w-7xl mx-auto gap-4 px-6">
                {/* Left - Infos */}
                <div className="text-center md:text-start">
                    <p>
                        <Link
                            href="/"
                            className="text-default-500"
                            underline="hover"
                        >
                            Home
                        </Link>
                    </p>
                    <p>
                        <Link
                            href="/travel-guides"
                            className="text-default-500"
                            underline="hover"
                        >
                            Travel Guides
                        </Link>
                    </p>
                    <p>
                        <Link
                            href="/about"
                            className="text-default-500"
                            underline="hover"
                        >
                            About
                        </Link>
                    </p>
                </div>
                {/* Center - About */}
                <div className="text-center mt-4 md:mt-0">
                    <p>
                        Built with{" "}
                        <BootstrapIcon
                            name="heart-fill"
                            className="text-danger-400"
                        />{" "}
                        by Marcel
                    </p>
                    <p className="pt-2">
                        <Link
                            href="https://github.com/marcelfrey29/IU-DOCC-Project-Cloud-Computing"
                            target="_blank"
                            underline="hover"
                            className="text-xl text-default-500"
                        >
                            <BootstrapIcon name="github" />
                        </Link>
                    </p>
                </div>
                {/* Right */}
                <div className="text-center md:text-end">
                    <p>
                        <Link
                            href="/privacy"
                            className="text-default-500"
                            underline="hover"
                        >
                            Privacy
                        </Link>
                    </p>
                    <p>
                        <Link
                            href="/imprint"
                            className="text-default-500"
                            underline="hover"
                        >
                            Imprint
                        </Link>
                    </p>
                </div>
            </div>
            <Divider className="my-4" />
            <div className="text-center m-5 pb-4">
                <p>&copy; {new Date().getFullYear()} Marcel Frey</p>
            </div>
        </footer>
    );
}
