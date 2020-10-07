import React from 'react';
import styled from 'styled-components';
import { IoMdShare } from 'react-icons/io'
import { IconContext } from 'react-icons'
import { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import copy from "copy-to-clipboard";

const Root = styled.div`
    // background-color: ${props => props.theme.colors.buttonBg};
    //border: 2px solid #111;
    border-radius: 50%;
    padding: 3px;
    &:hover {
        //background-color: ${props => props.theme.colors.buttonBg};
        cursor: pointer;
    }
    & > svg {
        width: 2em;
        height: 2em;
        display: block;
        margin-left: -2px;
        margin-right: auto;
    }
`

const ShareButton: React.FC = () => {
    const themeContext = useContext(ThemeContext);

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
        <IconContext.Provider value={{ color: themeContext.colors.buttonIcons }}>
            <Root onClick={shareLink}>
                <IoMdShare style={{ verticalAlign: 'middle' }} />
            </Root>
        </IconContext.Provider>
    )
}

export default ShareButton;