import { unpack } from "jsonpack";
import { Score } from "./defs";
import parser from "fast-xml-parser";
import { empty } from "../utils";
import JsZip from "jszip";

export async function importFile(file: File): Promise<Score> {
  if (file.name.includes(".scf")) {
    return importSCF(file);
  } else {
    return importXML(file);
  }
}

export async function importSCF(file: File): Promise<Score> {
  const zip = await JsZip().loadAsync(file);
  const content = await zip.file("main.txt").async("string");
  return unpack(content);
}

export async function importXML(file: File): Promise<Score> {
  try {
    const zip = await JsZip().loadAsync(file);
    const metaFile = await zip.file("META-INF/container.xml").async("string");
    const meta = parser.parse(
      metaFile,
      { ignoreAttributes: false, attrNodeName: "attr", attributeNamePrefix: "" },
      true
    );
    const root = meta.container.rootfiles.rootfile.attr["full-path"];
    const content = await zip.file(root).async("string");
    const score = parser.parse(
      content,
      {
        textNodeName: "@text_",
        ignoreAttributes: false,
        attributeNamePrefix: "@attr_",
      },
      true
    )["score-partwise"];
    console.log(score);
    return {
      ...empty().score,
      meta: {
        title: score?.work?.["work-title"] || "",
        subtitle: "",
        composer: score?.identification?.creator?.find((entry: any) => entry.attr.type === "composer")?.str || "",
        arranger: score?.identification?.creator?.find((entry: any) => entry.attr.type === "arranger")?.str || "",
        lyricist: score?.identification?.creator?.find((entry: any) => entry.attr.type === "lyricist")?.str || "",
        copyright: score?.identification?.rights || "",
        created: new Date(score?.identification?.encoding?.["encoding-date"]).valueOf(),
        modified: new Date(score?.identification?.encoding?.["encoding-date"]).valueOf(),
      },
    };
  } catch (error) {
    console.log(error.message);
  }
}
