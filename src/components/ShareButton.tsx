import copy from "copy-to-clipboard";

const ShareButton = () => {

    const shareLink = (): void => {
        // navigator.share is not available in every browser
        if (typeof window.navigator.share === "function") {
            window.navigator.share({
                title: 'defy.org',
                text: 'Check this out',
                url: `${window.location.href}`,
            })
                .then(() => console.log('Successful share'))
                .catch((error: Error) => console.log('Error sharing', error));
        } else {
            copy(window.location.href);
            alert('Link has been copied to clipboard!');
        }
    }

    return (
        <button className="app-button" onClick={shareLink}>Share</button>
    )
}

export default ShareButton;