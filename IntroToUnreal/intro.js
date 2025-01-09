function downloadFile() {
    const link = document.createElement('a');
    link.href = 'IntroToUnreal1.zip';
    link.download = 'IntroToUnreal1.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}