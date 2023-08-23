export const downloadFile = (file: any, fileName?: string) => {

  const name = (typeof file === 'string' || fileName) ? fileName : file.name;
  const url = typeof file === 'string' ? file : URL.createObjectURL(file);

  const downloadButton = document.createElement('a');
  downloadButton.href = url;
  downloadButton.download = name || 'file';
  downloadButton.innerHTML = 'download';

  document.body.appendChild(downloadButton);
  downloadButton.click();

  document.body.removeChild(downloadButton);
  URL.revokeObjectURL(url);
};
