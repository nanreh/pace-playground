import copy from "copy-to-clipboard";

const ShareButton = () => {

    const shareLink = (): void => {
        let newVariable: any;
        newVariable = window.navigator;
        if (newVariable && newVariable.share) {
            if (newVariable && newVariable.share) {
                newVariable.share({
                    title: 'defy.org',
                    text: 'Check this out',
                    url: `${window.location.href}`,
                })
                    .then(() => console.log('Successful share'))
                    .catch((error: Error) => console.log('Error sharing', error));
            }
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