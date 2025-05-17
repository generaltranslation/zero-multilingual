import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Download, ExternalLink } from "lucide-react";
import { Button } from "../ui/button";
import { Var, T } from "gt-next";

type Props = {
	selectedAttachment: null | {
		id: string;
		name: string;
		type: string;
		url: string;
	};
	setSelectedAttachment: (
		attachment: null | {
			id: string;
			name: string;
			type: string;
			url: string;
		},
	) => void;
};

const AttachmentDialog = ({
	selectedAttachment,
	setSelectedAttachment,
}: Props) => {
	return (
		<T id="components.mail.attachment_dialog.1">
			<Dialog
				open={!!selectedAttachment}
				onOpenChange={(open) => !open && setSelectedAttachment(null)}
			>
				<DialogContent className="!max-w-4xl">
					<DialogHeader>
						<DialogTitle className="flex items-center justify-between">
							<span>
								<Var>{selectedAttachment?.name}</Var>
							</span>
							<div className="flex gap-2">
								<Button variant="outline" size="sm" asChild>
									<a
										href={selectedAttachment?.url}
										download
										target="_blank"
										rel="noopener noreferrer"
									>
										<Download className="mr-1 h-4 w-4" />
										Download
									</a>
								</Button>
								<Button variant="outline" size="sm" asChild>
									<a
										href={selectedAttachment?.url}
										target="_blank"
										rel="noopener noreferrer"
									>
										<ExternalLink className="mr-1 h-4 w-4" />
										Open
									</a>
								</Button>
							</div>
						</DialogTitle>
					</DialogHeader>
					<div className="bg-muted mt-4 flex min-h-[300px] items-center justify-center rounded-md p-4">
						<Var>
							{selectedAttachment?.type === "image" ? (
								<img
									src={selectedAttachment.url || "/placeholder.svg"}
									alt={selectedAttachment.name}
									className="max-h-[500px] max-w-full object-contain"
								/>
							) : (
								<T id="components.mail.attachment_dialog.0">
									<div className="text-center">
										<div className="mb-4 text-6xl">
											<Var>{selectedAttachment?.type === "pdf" && "📄"}</Var>
											<Var>{selectedAttachment?.type === "excel" && "📊"}</Var>
											<Var>{selectedAttachment?.type === "word" && "📝"}</Var>
											<Var>
												{selectedAttachment &&
													!["pdf", "excel", "word", "image"].includes(
														selectedAttachment.type,
													) &&
													"📎"}
											</Var>
										</div>
										<p className="text-muted-foreground">
											Preview not available
										</p>
									</div>
								</T>
							)}
						</Var>
					</div>
				</DialogContent>
			</Dialog>
		</T>
	);
};

export default AttachmentDialog;
