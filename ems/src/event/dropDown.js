import styled from "styled-components";
import { logout } from "../Logout";

const DropDownContainer = styled.div`
    position: absolute;
    top: 80px;
    right: 50px;
    width: 150px;
    padding: 10px;
    border-radius: 10px;
    background-color: #efefef;
    border: 1px solid #000000;
    z-index: 99;

    &::before{
        content: '';
        position: absolute;
        top: -10px;
        right: 20px;
        width: 20px;
        height: 20px;
        transform: rotate(45deg);
        background-color: #efefef;
    }

`

const DropDownList = styled.ul`
    list-style: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0;
`

const DropDownItem = styled.li`
    color: #000000;
    font-size: 20px;
    font-weight: 500;
    cursor: pointer;
    transition: color 0.3s ease-out;
`



export function DropDown({isOrg}) {
    return (
        <DropDownContainer>
            <DropDownList>
                { isOrg? (<DropDownItem><a href="/organisation" style={{"textDecoration":"none", "color":"inherit"}}>Profile</a></DropDownItem>
                ) : (<DropDownItem><a href="/user" style={{"textDecoration":"none", "color":"inherit"}}>Profile</a></DropDownItem>)}
                <br></br>
                <DropDownItem onClick={logout}>Logout</DropDownItem>
            </DropDownList>
        </DropDownContainer>
    )
}