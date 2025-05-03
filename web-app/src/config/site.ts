export type SiteConfig = typeof siteConfig;

export const siteConfig = {
    name: "Travel Guides",
    navItems: [
        {
            label: "Home",
            href: "/",
        },
        {
            label: "Travel Guides",
            href: "/travel-guides",
        },
        {
            label: "About",
            href: "/about",
        },
    ],
};
