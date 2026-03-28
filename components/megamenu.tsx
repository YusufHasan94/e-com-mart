"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import type { MenuItem } from "@/lib/api-service"

interface MegaMenuProps {
  isOpen: boolean
  onClose: () => void
  menuItem: MenuItem | null
}

export function MegaMenu({ isOpen, onClose, menuItem }: MegaMenuProps) {
  const [activeTabId, setActiveTabId] = useState<number | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Tabs = direct children of the megamenu item
  const tabs = menuItem?.children ?? []
  const tabsWithChildren = tabs.filter(t => t.children.length > 0)
  const tabsNoChildren = tabs.filter(t => t.children.length === 0)

  // Set first tab with children as default when menu opens
  useEffect(() => {
    if (isOpen) {
      if (tabsWithChildren.length > 0) {
        setActiveTabId(tabsWithChildren[0].id)
      } else {
        setActiveTabId(null)
      }
    }
  }, [isOpen, menuItem])

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    }
  }, [])

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => onClose(), 200)
  }

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault()
        const currentIndex = tabsWithChildren.findIndex(t => t.id === activeTabId)
        if (currentIndex !== -1) {
          const newIndex =
            e.key === "ArrowDown"
              ? (currentIndex + 1) % tabsWithChildren.length
              : (currentIndex - 1 + tabsWithChildren.length) % tabsWithChildren.length
          setActiveTabId(tabsWithChildren[newIndex].id)
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, activeTabId, tabsWithChildren, onClose])

  if (!isOpen || !menuItem) return null

  const activeTab = tabsWithChildren.find(t => t.id === activeTabId) ?? null
  const columnsCount = menuItem.columns ?? 4

  // Group active tab children by heading to create columns
  const groupedChildren: { heading: MenuItem | null, links: MenuItem[] }[] = []
  if (activeTab) {
    let currentGroup: { heading: MenuItem | null, links: MenuItem[] } | null = null
    for (const child of activeTab.children) {
      if (child.type === "heading") {
        if (currentGroup) groupedChildren.push(currentGroup)
        currentGroup = { heading: child, links: [] }
      } else {
        if (!currentGroup) currentGroup = { heading: null, links: [] }
        currentGroup.links.push(child)
      }
    }
    if (currentGroup) groupedChildren.push(currentGroup)
  }

  return (
    <div
      ref={menuRef}
      className="hidden lg:block fixed top-24 left-0 right-0 bg-background border-b border-t border-border shadow-xl z-50 max-h-[calc(100vh-6rem)] overflow-y-auto"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="menu"
      aria-label="Shop navigation megamenu"
    >
      <div className="max-w-[1440px] mx-auto px-5 py-6 overflow-x-auto xl:overflow-x-visible">
        <div className="flex gap-6">
          {/* Left: tab column */}
          <div className="w-[200px] lg:w-[240px] shrink-0 border-r pr-6">
            <h3 className="text-xs font-semibold tracking-widest text-muted-foreground mb-3">
              Browse by Category
            </h3>
            <nav className="space-y-0.5" role="list">
              {tabs.map(tab => {
                const hasChildren = tab.children && tab.children.length > 0;
                return (
                  <Link
                    key={tab.id}
                    href={tab.url}
                    className={`group flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${activeTabId === tab.id
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-primary/10 hover:text-primary text-foreground"
                      }`}
                    onMouseEnter={() => {
                      if (hasChildren) setActiveTabId(tab.id);
                      else setActiveTabId(null);
                    }}
                    onClick={onClose}
                    role="menuitem"
                    target={tab.target}
                  >
                    <span className="flex items-center gap-2.5 truncate">
                      {tab.icon && (
                        <i className={`${tab.icon} text-base shrink-0 ${activeTabId === tab.id ? "text-primary" : "text-muted-foreground group-hover:text-primary transition-colors"}`} />
                      )}
                      <span className="truncate">{tab.title}</span>
                    </span>
                    {hasChildren && (
                      <ChevronRight
                        className={`h-3.5 w-3.5 shrink-0 transition-opacity ${activeTabId === tab.id ? "opacity-100 text-primary" : "opacity-0 group-hover:opacity-50"
                          }`}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: grouped subcategory panel */}
          <div className="flex-1 pl-4 min-w">
            {activeTab && (
              <>

                {/* Columns representing headings and links */}
                <div
                  className="grid gap-x-8 gap-y-10"
                  style={{ gridTemplateColumns: `repeat(auto-fill, minmax(160px, 1fr))` }}
                  role="group"
                >
                  {groupedChildren.map((group, idx) => (
                    <div key={idx} className="col-span-1 flex flex-col gap-4">
                      {group.heading && (
                        <p className="text-sm font-bold text-foreground">
                          {group.heading.title}
                        </p>
                      )}

                      {group.links.length > 0 && (
                        <div className="flex flex-col gap-3">
                          {group.links.map(link => (
                            <Link
                              key={link.id}
                              href={link.url}
                              className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
                              onClick={onClose}
                              target={link.target}
                              role="menuitem"
                            >
                              {link.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Compact version for mobile
export function MegaMenuCompact({ isOpen, onClose, menuItem }: MegaMenuProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const tabs = menuItem?.children ?? []

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !menuItem) return null

  return (
    <div
      className="lg:hidden border-t bg-background shadow-lg max-h-[80vh] overflow-y-auto"
      role="menu"
      aria-label="Mobile shop navigation menu"
    >
      <div className="px-4 py-4 space-y-1">
        {/* Back / top link */}
        <Link
          href={menuItem.url}
          className="flex items-center gap-2 py-2 px-3 text-sm font-semibold text-primary hover:underline"
          onClick={onClose}
        >
          {menuItem.icon && <i className={`${menuItem.icon} text-base`} />}
          View All {menuItem.title}
        </Link>
        <div className="border-b mb-2" />

        {tabs.map(tab => (
          <div key={tab.id}>
            {tab.children.length > 0 ? (
              <>
                <button
                  className="w-full flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                  onClick={() => setExpandedId(expandedId === tab.id ? null : tab.id)}
                  aria-expanded={expandedId === tab.id}
                >
                  <span className="flex items-center gap-2 text-sm font-medium">
                    {tab.icon && <i className={`${tab.icon} text-base text-muted-foreground`} />}
                    {tab.title}
                  </span>
                  <ChevronRight
                    className={`h-4 w-4 transition-transform shrink-0 text-muted-foreground ${expandedId === tab.id ? "rotate-90" : ""
                      }`}
                  />
                </button>

                {expandedId === tab.id && (
                  <div className="ml-4 border-l-2 border-primary/20 pl-4 pb-2 space-y-0.5 animate-in slide-in-from-top-2 duration-150">
                    {/* <Link
                      href={tab.url}
                      className="block text-xs font-medium text-primary py-1 hover:underline"
                      onClick={onClose}
                    >
                      View all {tab.title} →
                    </Link> */}
                    {tab.children.map(child =>
                      child.type === "heading" ? (
                        <p key={child.id} className="text-xs font-semibold uppercase tracking-widest text-muted-foreground pt-2 pb-0.5">
                          {child.title}
                        </p>
                      ) : (
                        <Link
                          key={child.id}
                          href={child.url}
                          className="block text-sm text-foreground hover:text-primary transition-colors py-0.5"
                          onClick={onClose}
                          target={child.target}
                        >
                          {child.title}
                        </Link>
                      )
                    )}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={tab.url}
                className="flex items-center gap-2 py-2 px-3 rounded-lg text-sm hover:bg-muted/50 transition-colors"
                onClick={onClose}
                target={tab.target}
              >
                {tab.icon && <i className={`${tab.icon} text-base text-muted-foreground`} />}
                {tab.title}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
