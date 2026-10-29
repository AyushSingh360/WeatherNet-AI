"use client";

import { Cloud, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
	className?: string;
	size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
	const sizeClasses = {
		sm: "text-2xl",
		md: "text-4xl md:text-5xl",
		lg: "text-5xl md:text-6xl",
	};

	const iconSizes = {
		sm: "h-6 w-6",
		md: "h-8 w-8 md:h-10 md:w-10",
		lg: "h-10 w-10 md:h-12 md:w-12",
	};

	return (
		<div className={cn("flex items-center gap-2", className)}>
			<div className="relative">
				<Cloud className={cn("text-black", iconSizes[size])} />
				<Zap
					className={cn(
						"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black animate-pulse",
						size === "sm"
							? "h-3 w-3"
							: size === "md"
								? "h-4 w-4 md:h-5 md:w-5"
								: "h-5 w-5 md:h-6 md:w-6",
					)}
				/>
			</div>
			<h1
				className={cn("font-bold text-black drop-shadow-sm", sizeClasses[size])}
			>
				Weather<span className="text-zinc-600">Net</span>
			</h1>
		</div>
	);
}
