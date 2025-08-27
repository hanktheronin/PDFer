// You can add more helpers here as needed
export function ambientColor(index) {
  // Returns a soft color for backgrounds or accents
  const colors = ['#b3c2e2', '#c2efd8', '#f9e0c7', '#e3e9f7', '#d1dae7'];
  return colors[index % colors.length];
}