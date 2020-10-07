import React from 'react';
import ShareButton from './ShareButton'
import ExportButton from '../../components/ExportButton'
import HomeButton from './HomeButton'
import AboutButton from './AboutButton'
import styled from 'styled-components'
import { Units } from '../models'
import { Intervals } from '../../pc/pacecalc';
import GitHubButton from './GitHubButton';

interface Props {
    intervals: Intervals,
    units: Units,
}

const Tools = styled.div`
    display: grid;
    grid-template-columns: 10% auto 10%;
    margin: 5px;
    color: ${(props) => props.theme.colors.controlsTitle};
`
const ToolsStart = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 5px 0;
`
const ToolsMiddle = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    &> h1 {
        font-weight: 900;
    }
    @media (max-width: ${(props) => props.theme.screenSizes.sm}) {
        & > h1 {
            font-size: 1.5em;
        }
    }
`
const ToolsEnd = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin: 5px 0;
`

const Title = styled.h1`
    display: inline;
    margin: 0 .4em;
    color: ${(props) => props.theme.colors.buttonIcons};
`

const Toolbar: React.FC<Props> = ({ intervals, units }) => {
    return (
        <>
            <Tools>
                <ToolsStart>
                    <HomeButton />
                    <AboutButton />
                    <GitHubButton />
                </ToolsStart>
                <ToolsMiddle>
                    <Title>Pace Playground</Title>
                </ToolsMiddle>
                <ToolsEnd>
                    <ShareButton />
                    <ExportButton intervals={intervals} units={units} />
                </ToolsEnd>
            </Tools>
        </>
    )
}

export default Toolbar;