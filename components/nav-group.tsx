"use client"

import { usePathname } from "next/navigation"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import type { SidebarNavGroup, SidebarNavItem } from "@/components/app-shared"
import { CaretRightIcon } from "@phosphor-icons/react"

type IsActivePath = (path?: string) => boolean

function hasActiveDescendant(
  item: SidebarNavItem,
  isActivePath: IsActivePath
): boolean {
  if (isActivePath(item.path)) return true
  return !!item.subItems?.some((child) =>
    hasActiveDescendant(child, isActivePath)
  )
}

/** Renders a level of SidebarMenuSub — recurses for subItems nested another level deep. */
function NavSubTree({
  items,
  isActivePath,
}: {
  items: SidebarNavItem[]
  isActivePath: IsActivePath
}) {
  return (
    <SidebarMenuSub>
      {items.map((item) =>
        item.subItems?.length ? (
          <Collapsible
            asChild
            className="group/subcollapsible"
            defaultOpen={hasActiveDescendant(item, isActivePath)}
            key={item.title}
          >
            <SidebarMenuSubItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuSubButton isActive={isActivePath(item.path)}>
                  {item.icon}
                  <span>{item.title}</span>
                  <CaretRightIcon className="ml-auto transition-transform duration-base group-data-[state=open]/subcollapsible:rotate-90" />
                </SidebarMenuSubButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <NavSubTree items={item.subItems} isActivePath={isActivePath} />
              </CollapsibleContent>
            </SidebarMenuSubItem>
          </Collapsible>
        ) : (
          <SidebarMenuSubItem key={item.title}>
            <SidebarMenuSubButton asChild isActive={isActivePath(item.path)}>
              <a href={item.path}>
                {item.icon}
                <span>{item.title}</span>
              </a>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        )
      )}
    </SidebarMenuSub>
  )
}

export function NavGroup({ label, items }: SidebarNavGroup) {
  const pathname = usePathname()
  const isActivePath: IsActivePath = (path) =>
    !!path && path.startsWith("/") && path === pathname

  return (
    <SidebarGroup>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) => {
          const active = isActivePath(item.path)
          const childActive = hasActiveDescendant(item, isActivePath)
          return (
            <Collapsible
              asChild
              className="group/collapsible"
              defaultOpen={active || childActive}
              key={item.title}
            >
              <SidebarMenuItem>
                {item.subItems?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton isActive={active}>
                        {item.icon}
                        <span>{item.title}</span>
                        <CaretRightIcon className="ml-auto transition-transform duration-base group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <NavSubTree
                        items={item.subItems}
                        isActivePath={isActivePath}
                      />
                    </CollapsibleContent>
                  </>
                ) : (
                  <SidebarMenuButton asChild isActive={active}>
                    <a href={item.path}>
                      {item.icon}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
