import { Link } from "@nextui-org/link";
import {
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle,
    Navbar as NextUINavbar,
} from "@nextui-org/navbar";
import { link as linkStyles } from "@nextui-org/theme";
import clsx from "clsx";

import { ThemeSwitch } from "@/components/theme-switch";
import { siteConfig } from "@/config/site";
import { BootstrapIcon } from "./icons";

export const Navbar = () => {
    return (
        <NextUINavbar maxWidth="xl" position="sticky">
            {/* Mobile Menu */}
            <NavbarMenu>
                <div className="mx-4 mt-2 flex flex-col gap-2">
                    {siteConfig.navItems.map((item, index) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey:
                        <NavbarMenuItem key={`${item}-${index}`}>
                            <Link color="foreground" href={item.href} size="lg">
                                {item.label}
                            </Link>
                        </NavbarMenuItem>
                    ))}
                </div>
            </NavbarMenu>

            {/* Main-Navigation */}
            <NavbarContent className="basis-full" justify="start">
                <NavbarMenuToggle className="md:hidden" />

                <NavbarBrand className="gap-3 max-w-fit">
                    <p className="font-bold text-inherit text-4xl">
                        <BootstrapIcon name="luggage-fill" />
                    </p>
                </NavbarBrand>

                <div className="hidden md:flex gap-4 justify-start ml-2">
                    {siteConfig.navItems.map((item) => (
                        <NavbarItem key={item.href}>
                            <Link
                                className={clsx(
                                    linkStyles({ color: "foreground" }),
                                    "data-[active=true]:text-primary data-[active=true]:font-medium",
                                )}
                                color="foreground"
                                href={item.href}
                            >
                                {item.label}
                            </Link>
                        </NavbarItem>
                    ))}
                </div>
            </NavbarContent>

            {/* Action (right) */}
            <NavbarContent className="basis-1 pl-4" justify="end">
                <ThemeSwitch />
            </NavbarContent>
        </NextUINavbar>
    );
};
