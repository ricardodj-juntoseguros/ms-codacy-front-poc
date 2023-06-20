export const downloadFile = (file: File) => {
  const url = URL.createObjectURL(file);

  const downloadButton = document.createElement('a');
  downloadButton.href = url;
  downloadButton.download = file.name;
  downloadButton.innerHTML = 'download';

  document.body.appendChild(downloadButton);

  downloadButton.click();

  document.body.removeChild(downloadButton);
  URL.revokeObjectURL(url);
};
