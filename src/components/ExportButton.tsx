import React from 'react';
import styled from 'styled-components';
import { FaFileCsv } from 'react-icons/fa';
import { IconContext } from 'react-icons'
import { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { Units } from '../defy/models'
import { Intervals } from '../pc/pacecalc'
import { toCsv, download } from "../pc/csvservice";

interface Props {
    intervals: Intervals,
    units: Units,
}

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

const ExportButton: React.FC<Props> = ({ intervals, units }) => {
    const themeContext = useContext(ThemeContext);

    const exportCsv = (): void => {
        const csvData = toCsv(intervals, units);
        download(csvData, 'intervals', 'csv');
    }

    return (
        <IconContext.Provider value={{ color: themeContext.colors.buttonIcons }}>
            <Root onClick={exportCsv}>
                <FaFileCsv style={{ verticalAlign: 'middle' }} />
            </Root>
        </IconContext.Provider >
    )
}

export default ExportButton;