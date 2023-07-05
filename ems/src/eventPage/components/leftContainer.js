import React from "react";
import styled from "styled-components";

import Calendar from "./icons/calendar.png"
import Location from "./icons/location.png"
import User from "./icons/user.png"
import Rupee from "./icons/rupee.png"

const Body = styled.div`
    height: 75vh;
    max-width: 30vw;
    display: flex;
    align-items: center;
`;

const Container = styled.div`
    height: 70vh;
    width: 25vw;
    border-radius: 10px;
    border: 2px solid gray;
    background-color: #efefef;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    overflow-y: scroll;
    &::-webkit-scrollbar{display: none};
`;

const ItemContainer = styled.div`
    height: 9vh;
    width: 15vw;
    background-color: #efefef;
    display: flex;
    justify-content: flex-start;
    margin-bottom: 15px;
    align-items: center;
`;

const Button = styled.button`
    background-color: #fff;
    color: #1f253d;
    border: 2px solid #1f253d;
    border-radius: 5px;
    padding: 20px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease-in-out;

    height: 60px;
    width: 140px;

    &:hover {
        background-color: #1f253d;
        color: #fff;
        border: 2px solid #efefef;
    }
`;

const ButtonText = styled.a`
    color: inherit;
    font-size: 1rem;
    font-weight: 500;
    text-decoration: none;
    margin: 0;
    padding: 0;
    font-family: 'Montserrat', sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.1rem;
    transition: all 0.1s ease-in-out;
`;

const TextContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const TextTitle = styled.a`
    font-size: 1.38em;
    font-family: 'Montserrat', sans-serif;
    color: black;
    text-decoration: none;
    margin-left: 10px;
`;

const TextItem = styled.a`
    font-size: 1em;
    font-family: 'Montserrat', sans-serif;
    color: black;
    text-decoration: none;
    margin-left: 10px;
`;

const LeftContainer = ({eStartDate, eEndDate, eLocation, eParticipants, ePrice, eParticipantsMax}) => {
    return (
        <Body>
            <Container>

                <ItemContainer>
                    <img src={Calendar} width={"30px"} height={"30px"} alt=""></img>
                    <TextContainer>
                        <TextTitle href={() => false}>Start Date</TextTitle>
                        <TextItem href={() => false}>{eStartDate}</TextItem>
                    </TextContainer>
                </ItemContainer>

                <ItemContainer>
                    <img src={Calendar} width={"30px"} height={"30px"} alt=""></img>
                    <TextContainer>
                        <TextTitle href={() => false}>End Date</TextTitle>
                        <TextItem href={() => false}>{eEndDate}</TextItem>
                    </TextContainer>
                </ItemContainer>

                <ItemContainer>
                    <img src={Location} width={"30px"} height={"30px"} alt=""></img>
                    <TextContainer>
                        <TextTitle href={() => false}>Location</TextTitle>
                        <TextItem href={() => false}>{eLocation}</TextItem>
                    </TextContainer>
                </ItemContainer>

                <ItemContainer>
                    <img src={User} width={"30px"} height={"30px"} alt=""></img>
                    <TextContainer>
                        <TextTitle href={() => false}>Participants</TextTitle>
                        <TextItem href={() => false}>{eParticipants} / {eParticipantsMax}</TextItem>
                    </TextContainer>
                </ItemContainer>

                <ItemContainer>
                    <img src={Rupee} width={"30px"} height={"30px"} alt=""></img>
                    <TextContainer>
                        <TextTitle href={() => false}>Price</TextTitle>
                        <TextItem href={() => false}>₹{ePrice}</TextItem>
                    </TextContainer>
                </ItemContainer>

                <Button>
                    <ButtonText href={() => false}>Register</ButtonText>
                </Button>
            </Container>
        </Body>
    );
}

export default LeftContainer;