import { Download } from "lucide-react";
import type { Craft } from "../../types/craft";
import { exportCraftAsPng } from "../../utils/exportCanvas";
import { Button } from "../ui/Button";

export function ExportButton({ craft }: { craft: Craft }) {
  return <Button icon={<Download className="h-4 w-4" />} onClick={() => exportCraftAsPng(craft)}>Export</Button>;
}
