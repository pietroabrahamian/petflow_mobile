export const lightColors = {
    primary: "#2D6A4F",
    primaryLight: "#D8F3DC",
    primaryOverlay: "rgba(45,106,79,0.85)",
    onPrimary: "#fff",
    accent: "#F9A825",
    danger: "#c0392b",

    background: "#F2F2F7",
    surface: "#fff",
    surfaceMuted: "#f9f9f9",

    textPrimary: "#1a1a1a",
    textStrong: "#444",
    textSecondary: "#666",
    textMuted: "#999",
    textLabel: "#8d8d8d",

    formLabel: "#3d3d3d",

    inputBorder: "#e0e0e0",
    border: "#eee",
    borderStrong: "#ddd",
    inactive: "#ccc",
    disabled: "#aaa",
    switchTrackOff: "#bbb",
}

export type Palette = typeof lightColors

// Mesmas chaves do tema claro: as telas não precisam saber qual tema está ativo
export const darkColors: Palette = {
    primary: "#52B788",
    primaryLight: "#1B4332",
    primaryOverlay: "rgba(27,67,50,0.85)",
    onPrimary: "#fff",
    accent: "#F9A825",
    danger: "#e57368",

    background: "#121212",
    surface: "#1E1E1E",
    surfaceMuted: "#262626",

    textPrimary: "#F1F1F1",
    textStrong: "#D6D6D6",
    textSecondary: "#B3B3B3",
    textMuted: "#8A8A8A",
    textLabel: "#9A9A9A",

    formLabel: "#D0D0D0",

    inputBorder: "#3A3A3A",
    border: "#2A2A2A",
    borderStrong: "#3A3A3A",
    inactive: "#555",
    disabled: "#666",
    switchTrackOff: "#555",
}
