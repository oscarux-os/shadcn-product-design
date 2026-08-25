import type { ReactNode } from "react"
import {
  HouseIcon,
  SquaresFourIcon,
  ChartBarIcon,
  ShoppingCartIcon,
  FileTextIcon,
  UsersIcon,
  MegaphoneIcon,
  GearIcon,
  QuestionIcon,
  PulseIcon,
  BookOpenTextIcon,
} from "@phosphor-icons/react"

export type SidebarNavItem = {
  title: string
  path?: string
  icon?: ReactNode
  isActive?: boolean
  subItems?: SidebarNavItem[]
}

export type SidebarNavGroup = {
  label: string
  items: SidebarNavItem[]
}

export const navGroups: SidebarNavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Overview",
        path: "/overview",
        icon: <HouseIcon />,
      },
      {
        title: "Dashboard",
        path: "/",
        icon: <SquaresFourIcon />,
      },
      {
        title: "Sales",
        path: "#/sales",
        icon: <ChartBarIcon />,
      },
      {
        title: "Design system",
        path: "#/design-system",
        icon: <BookOpenTextIcon />,
        subItems: [
          {
            title: "Foundations",
            path: "#/design-system/foundations",
            subItems: [
              { title: "Overview", path: "/design-system/foundations" },
              {
                title: "Colour",
                path: "/design-system/foundations/colour",
              },
              {
                title: "Typography",
                path: "/design-system/foundations/typography",
              },
              {
                title: "Layout & spacing",
                path: "/design-system/foundations/layout-spacing",
              },
              {
                title: "Depth & shape",
                path: "/design-system/foundations/depth-shape",
              },
              {
                title: "Motion & interaction",
                path: "/design-system/foundations/motion-interaction",
              },
              {
                title: "Controls & density",
                path: "/design-system/foundations/controls-density",
              },
              {
                title: "Charts & components",
                path: "/design-system/foundations/charts-components",
              },
            ],
          },
          { title: "Components", path: "/components" },
          {
            title: "Sidotyper",
            path: "#/design-system/page-types",
            subItems: [
              {
                title: "Index / List Report",
                path: "/page-types/list-report",
              },
              { title: "Details", path: "/page-types/details" },
              { title: "Worklist", path: "/page-types/worklist" },
              {
                title: "Worklist detail",
                path: "/page-types/worklist-detail",
              },
              { title: "Create a new page", path: "/page-types/create" },
              { title: "Wizard", path: "/page-types/wizard" },
              { title: "Overview", path: "/page-types/overview" },
              { title: "Analytical", path: "/page-types/analytical" },
              { title: "Settings", path: "/page-types/settings" },
              { title: "Result", path: "/page-types/result" },
              { title: "404", path: "/page-types/404" },
            ],
          },
        ],
      },
    ],
  },
  {
    label: "Store",
    items: [
      {
        title: "Orders",
        path: "#/orders",
        icon: <ShoppingCartIcon />,
        subItems: [
          { title: "All orders", path: "/orders" },
          { title: "Unfulfilled", path: "#/orders/unfulfilled" },
          { title: "Returns", path: "#/orders/returns" },
        ],
      },
      {
        title: "Products",
        path: "#/products",
        icon: <FileTextIcon />,
        subItems: [
          { title: "Catalog", path: "#/products/catalog" },
          { title: "Inventory", path: "#/products/inventory" },
          { title: "Collections", path: "#/products/collections" },
        ],
      },
      {
        title: "Customers",
        path: "#/customers",
        icon: <UsersIcon />,
      },
      {
        title: "Marketing",
        path: "#/marketing",
        icon: <MegaphoneIcon />,
      },
    ],
  },
  {
    label: "Settings",
    items: [
      {
        title: "Store settings",
        path: "#/store-settings",
        icon: <GearIcon />,
        subItems: [
          { title: "Store profile", path: "#/store-settings/profile" },
          { title: "Shipping & delivery", path: "#/store-settings/shipping" },
          { title: "Payments", path: "#/store-settings/payments" },
          { title: "Staff", path: "#/store-settings/staff" },
          { title: "Apps", path: "#/store-settings/apps" },
        ],
      },
    ],
  },
]

export const footerNavLinks: SidebarNavItem[] = [
  {
    title: "Seller help",
    path: "#/seller-help",
    icon: <QuestionIcon />,
  },
  {
    title: "Platform status",
    path: "#/status",
    icon: <PulseIcon />,
  },
]

function flattenNavItems(items: SidebarNavItem[]): SidebarNavItem[] {
  return items.flatMap((item) => [
    item,
    ...flattenNavItems(item.subItems ?? []),
  ])
}

export const navLinks: SidebarNavItem[] = [
  ...navGroups.flatMap((group) => flattenNavItems(group.items)),
  ...footerNavLinks,
]
