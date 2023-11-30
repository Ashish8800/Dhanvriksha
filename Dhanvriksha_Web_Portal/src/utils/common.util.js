export function downloadFileFromURL(url) {
  // Fetch the file from the URL
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      // Create a temporary URL for the blob
      const blobURL = URL.createObjectURL(blob);

      // Create a hidden anchor element to initiate the download
      const anchor = document.createElement("a");
      anchor.href = blobURL;
      anchor.download = url.substring(url.lastIndexOf("/") + 1); // Extract the filename from the URL
      anchor.style.display = "none";

      // Append the anchor to the document and simulate a click to trigger the download
      document.body.appendChild(anchor);
      anchor.click();

      // Clean up by revoking the temporary URL
      URL.revokeObjectURL(blobURL);
    })
    .catch((error) => console.error("Error downloading the file:", error));
}
