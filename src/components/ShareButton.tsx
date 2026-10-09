const ShareButton = () => {

    const shareLink = (): void => {
        const url = window.location.href;
        // navigator.share is not available in every browser
        if (typeof window.navigator.share === "function") {
            // rejects when the share sheet is dismissed, which is not an error
            window.navigator.share({
                title: 'defy.org',
                text: 'Check this out',
                url: url,
            }).catch(() => {});
        } else {
            window.navigator.clipboard.writeText(url)
                .then(() => alert('Link has been copied to clipboard!'))
                // the clipboard is unavailable, so show the link to copy by hand
                .catch(() => window.prompt('Copy this link to share:', url));
        }
    }

    return (
        <button className="app-button" onClick={shareLink}>Share</button>
    )
}

export default ShareButton;
