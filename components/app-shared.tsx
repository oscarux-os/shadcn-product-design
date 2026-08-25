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
  StackIcon,
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
        title: "Components",
        path: "/components",
        icon: <StackIcon />,
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

export const navLinks: SidebarNavItem[] = [
  ...navGroups.flatMap((group) =>
    group.items.flatMap((item) =>
      item.subItems?.length ? [item, ...item.subItems] : [item]
    )
  ),
  ...footerNavLinks,
]
