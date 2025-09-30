import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Plane, Sun, Globe, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { useI18n } from "@/lib/i18n";

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { locale, switchLocale, href, t } = useI18n();

  const navigation = [
    { name: t("header_book"), href: href("/"), match: new RegExp(`^/${locale}/?$`).test(location) },
    { name: t("header_checkin"), href: href("/checkin"), match: new RegExp(`^/${locale}/checkin/?$`).test(location) },
    { name: t("header_destinations"), href: href("/destinations"), match: new RegExp(`^/${locale}/destinations/?$`).test(location) },
    { name: t("header_offers"), href: href("/offers"), match: new RegExp(`^/${locale}/offers/?$`).test(location) },
    { name: t("header_my_booking"), href: href("/my-booking"), match: new RegExp(`^/${locale}/my-booking/?$`).test(location) },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={href("/")} className="flex items-center" data-testid="logo-link">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-sunblue rounded-full flex items-center justify-center mr-2">
                <Sun className="text-sunorange h-4 w-4" />
              </div>
              <span className="text-sunblue font-bold text-xl">SunExpress</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-medium transition-colors ${
                  item.match
                    ? "text-sunblue"
                    : "text-gray-700 hover:text-sunblue"
                }`}
                data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden md:flex items-center space-x-2" data-testid="language-selector">
                  <Globe className="h-4 w-4" />
                  <span>{locale.toUpperCase()}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem data-testid="language-en" onSelect={() => switchLocale("en")}>English</DropdownMenuItem>
                <DropdownMenuItem data-testid="language-tr" onSelect={() => switchLocale("tr")}>Türkçe</DropdownMenuItem>
                <DropdownMenuItem data-testid="language-de" onSelect={() => switchLocale("de")}>Deutsch</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Account */}
            <Button variant="ghost" size="sm" data-testid="user-account">
              <User className="h-4 w-4" />
            </Button>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden" data-testid="mobile-menu-trigger">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-6">
                  {navigation.map((item) => (
                    <SheetClose key={item.name} asChild>
                      <Link
                        href={item.href}
                        className={`text-lg font-medium transition-colors ${
                          item.match
                            ? "text-sunblue"
                            : "text-gray-700 hover:text-sunblue"
                        }`}
                        data-testid={`mobile-nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {item.name}
                      </Link>
                    </SheetClose>
                  ))}
                  <div className="border-t pt-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Globe className="h-4 w-4" />
                      <span>{t("lang_label")}: {locale.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
