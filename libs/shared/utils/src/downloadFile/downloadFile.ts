export const downloadFile = (file: File | string) => {
  const name = typeof file === 'string' ? 'file' : file.name;
  const url = typeof file === 'string' ? file : URL.createObjectURL(file);

  const downloadButton = document.createElement('a');
  downloadButton.href = url;
  downloadButton.download = name;
  downloadButton.innerHTML = 'download';

  document.body.appendChild(downloadButton);

  downloadButton.click();

  document.body.removeChild(downloadButton);
  URL.revokeObjectURL(url);
};
