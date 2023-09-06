interface Config {
  defaultThemeState: { theme: ["dark" | "light"] };
  step2FileNameLength: { max: number; visibleEnds: number };
  messageAppendedAtEnd: "10";
}
const config: Config = {
  defaultThemeState: { theme: ["dark"] },
  step2FileNameLength: { max: 20, visibleEnds: 8 },
  messageAppendedAtEnd: "10",
};

export default config;
