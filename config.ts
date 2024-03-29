interface Config {
  defaultThemeState: "dark" | "light";
  step2FileNameLength: { max: number; visibleEnds: number };
  messageAppendedAtEnd: "10";
  defaultFont: string;
  encodeModifiedFileName: string;
}
const config: Config = {
  defaultThemeState: "dark",
  step2FileNameLength: { max: 20, visibleEnds: 8 },
  messageAppendedAtEnd: "10",
  defaultFont: "roboto",
  encodeModifiedFileName: "modified_{FILENAME}",
};

export default config;
