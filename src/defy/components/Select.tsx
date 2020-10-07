import styled from 'styled-components'

const Select = styled.select`
    display: inline;
    font-size: 16px;
    font-weight: 900;
    color: ${(props) => props.theme.colors.buttonTxt};
    line-height: 1.3;
    padding: .6em 1.4em .5em .8em;
    margin: 0 2px;
    max-width: 100%;
    border-radius: .5em;
    -moz-appearance: none;
    -webkit-appearance: none;
    background-color: ${(props) => props.theme.colors.buttonBg};
    border: 1px solid ${(props) => props.theme.colors.buttonBg};
    &:focus {
        outline: none;
    }
    &:hover {
        border: 1px solid ${(props) => props.theme.colors.buttonSelectedBorder};
    }
`

export default Select;