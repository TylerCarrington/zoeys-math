// Top 25 popular colors for wallpaper selection
export const wallpaperColors = [
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#45B7D1", // Sky Blue
  "#FFA07A", // Light Salmon
  "#98D8C8", // Mint
  "#F7DC6F", // Yellow
  "#BB8FCE", // Purple
  "#85C1E2", // Cornflower Blue
  "#F8B88B", // Peach
  "#A8E6CF", // Light Green
  "#FFD3B6", // Apricot
  "#FFAAA5", // Light Red
  "#FF8B94", // Light Pink
  "#A8D8EA", // Light Blue
  "#AA96DA", // Lavender
  "#FCBAD3", // Pink
  "#FFFFD2", // Light Yellow
  "#A1CCA5", // Sage Green
  "#FFB7B2", // Salmon
  "#E2CF5B", // Gold
  "#B4A7D6", // Wisteria
  "#FFC1CC", // Blush
  "#B5D2E8", // Periwinkle
  "#C5A9D3", // Lilac
  "#FFE5E5", // Light Coral
];

export const getRandomWallpaperColor = () => {
  return wallpaperColors[Math.floor(Math.random() * wallpaperColors.length)];
};
