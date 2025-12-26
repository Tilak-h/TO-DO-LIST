import { Check, Moon, Sun, Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const accents = [
    { name: "Blue", value: "theme-blue", color: "hsl(221.2 83.2% 53.3%)" },
    { name: "Purple", value: "theme-purple", color: "hsl(262.1 83.3% 57.8%)" },
    { name: "Green", value: "theme-green", color: "hsl(142.1 76.2% 36.3%)" },
    { name: "Orange", value: "theme-orange", color: "hsl(24.6 95% 53.1%)" },
    { name: "Red", value: "theme-red", color: "hsl(346.8 77.2% 49.8%)" },
    { name: "Zinc", value: "theme-zinc", color: "hsl(240 5.9% 10%)" },
];

export function ThemeCustomizer() {
    const { theme, setTheme } = useTheme();
    const [accent, setAccent] = useState("theme-blue");
    const [highContrast, setHighContrast] = useState(false);

    useEffect(() => {
        const root = window.document.documentElement;
        accents.forEach((a) => root.classList.remove(a.value));
        root.classList.add(accent);
    }, [accent]);

    useEffect(() => {
        const root = window.document.documentElement;
        if (highContrast) {
            root.classList.add("high-contrast");
        } else {
            root.classList.remove("high-contrast");
        }
    }, [highContrast]);

    return (
        <div className="flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 w-8 px-0">
                        <Monitor className="h-4 w-4" />
                        <span className="sr-only">Customize theme</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Theme</DropdownMenuLabel>
                    <div className="grid grid-cols-3 gap-2 p-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setTheme("light")}
                            className={cn(theme === "light" && "border-2 border-primary")}
                        >
                            <Sun className="mr-2 h-4 w-4" />
                            Light
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setTheme("dark")}
                            className={cn(theme === "dark" && "border-2 border-primary")}
                        >
                            <Moon className="mr-2 h-4 w-4" />
                            Dark
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setTheme("system")}
                            className={cn(theme === "system" && "border-2 border-primary")}
                        >
                            <Monitor className="mr-2 h-4 w-4" />
                            System
                        </Button>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Accent Color</DropdownMenuLabel>
                    <div className="grid grid-cols-3 gap-2 p-2">
                        {accents.map((a) => (
                            <Button
                                key={a.value}
                                variant="outline"
                                size="sm"
                                className={cn(
                                    "justify-start",
                                    accent === a.value && "border-2 border-primary"
                                )}
                                onClick={() => setAccent(a.value)}
                            >
                                <div
                                    className="mr-2 h-4 w-4 rounded-full"
                                    style={{ backgroundColor: a.color }}
                                />
                                <span className="text-xs">{a.name}</span>
                                {accent === a.value && <Check className="ml-auto h-3 w-3" />}
                            </Button>
                        ))}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={(e) => {
                            e.preventDefault();
                            setHighContrast(!highContrast)
                        }}
                    >
                        <div className="flex items-center gap-2">
                            <div className={cn("h-4 w-4 border rounded", highContrast ? "bg-primary border-primary" : "border-input")} >
                                {highContrast && <Check className="h-3 w-3 text-primary-foreground" />}
                            </div>
                            <span>High Contrast</span>
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
