export const bookmarklet = function(): void {
  const report = document.getElementsByClassName('cssReport');
  navigator.clipboard.writeText(report[0].outerHTML);
  alert('Copied list to clipboard! Please paste in FoW Tools.');
};