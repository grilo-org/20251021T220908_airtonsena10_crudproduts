"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Badge,
} from "@heroui/react";
import {
  Home,
  Package,
  BarChart3,
  User,
  LogOut,
  Settings,
  Bell,
  Search,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { toast } from "sonner";

const menuItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    label: "Produtos",
    href: "/products",
    icon: Package,
  },
  {
    label: "Métricas",
    href: "/metrics",
    icon: BarChart3,
  },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      logout();
      toast.success("Logout realizado com sucesso!");
      router.push("/login");
    } catch {
      toast.error("Erro ao fazer logout");
    }
  };

  const isActivePath = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      className="border-b m-1 border-border/40 bg-background-secondary/95 backdrop-blur supports-[backdrop-filter]:bg-background-secondary/60"
      maxWidth="full"
      height="4rem"
    >
      {/* Mobile menu toggle */}
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                CrudProdutos
              </span>
            </div>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop Navigation */}
      <NavbarContent className="hidden sm:flex gap-5" justify="center">
        {menuItems.map((item) => (
          <NavbarItem key={item.href} isActive={isActivePath(item.href)}>
            <Link
              href={item.href}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200
                ${
                  isActivePath(item.href)
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-foreground-secondary hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
                }
              `}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* Right side content */}
      <NavbarContent as="div" justify="end" className="gap-2">
        {/* Search Button */}
        <Button
          isIconOnly
          variant="light"
          className="text-foreground-secondary hover:text-foreground"
        >
          <Search className="w-4 h-4" />
        </Button>

        {/* Notifications */}
        <Button
          isIconOnly
          variant="light"
          className="text-foreground-secondary hover:text-foreground"
        >
          <Badge content="3" color="danger" size="sm">
            <Bell className="w-4 h-4" />
          </Badge>
        </Button>

        {/* Theme Switcher */}
        <ThemeSwitcher />

        {/* User Dropdown */}
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <div className="flex items-center space-x-2 cursor-pointer">
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="primary"
                name={user?.name || "User"}
                size="sm"
                src={user?.avatar}
                fallback={
                  <User className="w-4 h-4 text-foreground-secondary" />
                }
              />
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-foreground">
                  {user?.name || "Usuário"}
                </p>
                <p className="text-xs text-foreground-secondary">
                  {user?.email}
                </p>
              </div>
            </div>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Profile Actions"
            variant="flat"
            className="min-w-[200px]"
          >
            <DropdownItem
              key="profile"
              className="h-14 gap-2"
              textValue="Profile"
            >
              <div className="flex flex-col">
                <p className="font-medium">{user?.name}</p>
                <p className="text-sm text-foreground-secondary">
                  {user?.email}
                </p>
              </div>
            </DropdownItem>
            <DropdownItem
              key="settings"
              startContent={<Settings className="w-4 h-4" />}
            >
              Configurações
            </DropdownItem>
            <DropdownItem
              key="logout"
              className="text-danger"
              color="danger"
              startContent={<LogOut className="w-4 h-4" />}
              onPress={handleLogout}
            >
              Sair
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu className="bg-background-secondary/95 backdrop-blur">
        <div className="flex flex-col space-y-2 pt-6">
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item.href}-${index}`}>
              <Link
                href={item.href}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 w-full
                  ${
                    isActivePath(item.href)
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground-secondary hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
                  }
                `}
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-base">{item.label}</span>
              </Link>
            </NavbarMenuItem>
          ))}
        </div>

        {/* Mobile User Info */}
        <div className="mt-8 px-4 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Avatar
              name={user?.name || "User"}
              size="md"
              src={user?.avatar}
              fallback={<User className="w-5 h-5 text-foreground-secondary" />}
            />
            <div>
              <p className="font-medium text-foreground">{user?.name}</p>
              <p className="text-sm text-foreground-secondary">{user?.email}</p>
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <Button
              size="sm"
              variant="light"
              startContent={<Settings className="w-4 h-4" />}
              className="flex-1"
            >
              Configurações
            </Button>
            <Button
              size="sm"
              color="danger"
              variant="light"
              startContent={<LogOut className="w-4 h-4" />}
              onPress={handleLogout}
              className="flex-1"
            >
              Sair
            </Button>
          </div>
        </div>
      </NavbarMenu>
    </Navbar>
  );
}
