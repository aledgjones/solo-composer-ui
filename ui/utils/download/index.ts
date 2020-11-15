import { error } from "../../utils/error";
import { pack } from "jsonpack";

export async function download(
  raw: any,
  name: string,
  mime: string = "text/plain"
): Promise<void> {
  const content = pack(raw);
  const blob = new Blob([content], { type: mime });
  const localUrl = URL.createObjectURL(blob);

  // yes we need to append else it doesn't work
  const a: any = document.createElement("A");
  document.body.appendChild(a);
  a.style.position = "fixed";
  a.style.visibility = "hidden";
  a.style.left = "-100000px";
  a.style.top = "-100000px";
  a.href = localUrl;
  a.download = name;

  try {
    a.click();
    a.remove();
    URL.revokeObjectURL(localUrl);
    return;
  } catch (err) {
    a.remove();
    URL.revokeObjectURL(localUrl);
    throw error("@download/fail", "Could not download the file.");
  }
}
