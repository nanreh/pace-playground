import React from 'react';
import { IoMdShare } from 'react-icons/io'
import { IconContext } from 'react-icons'
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
        <IconContext.Provider value={{ color: "#fed766" }}>
            <div className="share-button-panel" onClick={shareLink}>
                <IoMdShare style={{ verticalAlign: 'middle' }} />
            </div>
        </IconContext.Provider>
    )
}

export default ShareButton;