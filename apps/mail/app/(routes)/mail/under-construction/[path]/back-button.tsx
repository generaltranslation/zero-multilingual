"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { T } from "gt-next";

export default function BackButton() {
	return (
		<T id="_routes_.mail.under_construction._path_.back_button.0">
			<a href="/mail">
				<Button variant="outline" className="text-muted-foreground gap-2">
					<ArrowLeft className="h-4 w-4" />
					Go Back
				</Button>
			</a>
		</T>
	);
}
