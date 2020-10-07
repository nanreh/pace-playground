import React from 'react';
import styled from 'styled-components';
import { MdLock } from 'react-icons/md';
import { IconContext } from 'react-icons'
import { useContext } from 'react';
import { ThemeContext } from 'styled-components';

interface Props {
    unlockCb: () => void,
}

const Root = styled.div`
    background-color: ${props => props.theme.colors.buttonBg};
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
        margin-left: auto;
        margin-right: auto;
    }
`

const LockButton: React.FC<Props> = ({ unlockCb }) => {
    const themeContext = useContext(ThemeContext);
    return (
        <IconContext.Provider value={{ color: themeContext.colors.buttonIcons, size: "1.5em" }}>
            <Root onClick={unlockCb}>
                <MdLock style={{ verticalAlign: 'middle' }} />
            </Root>
        </IconContext.Provider>
    )
}

export default LockButton;