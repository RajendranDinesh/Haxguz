import React, { useState } from "react";
import styled from "styled-components";

import Header from "./components/header";
import LeftContainer from "./components/leftContainer";
import RightContainer from "./components/rightContainer";

const Body = styled.div`
    background-color: #efefef;
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
`;

const Container = styled.div`
    background-image: url("https://marketplace.canva.com/EAD2962NKnQ/2/0/1600w/canva-rainbow-gradient-pink-and-purple-virtual-background-_Tcjok-d9b4.jpg");
    height: 75vh;
    max-width: 100vw;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
`;

const EventPage = () => {

    const [eName, setEName] = useState('BIT Prayukti');
    const [eStartDate, setEStartDate] = useState('28/04/2024');
    const [eEndDate, setEEndDate] = useState('01/05/2024');
    const [eRegStart, setERegStart] = useState('01/01/2024');
    const [eRegEnd, setERegEnd] = useState('01/03/2024');
    const [eLocation, setELocation] = useState('Erode, TamilNadu');
    const [eParticipantsMax, setEParticipantsMax] = useState('500');
    const [eParticipants, setEParticipants] = useState('100');
    const [ePrice, setEPrice] = useState('1200');
    const [organisation, setOrganisation] = useState('Bannari Amman Institute Of Technology');
    const [description, setDescription] = useState('');

    return (
        <Body>
            <Header 
            eName={eName}
            organisation={organisation} 
            eStartDate={eStartDate}
            eEndDate={eEndDate}
            eRegStart={eRegStart}
            eRegEnd={eRegEnd}
            eLocation={eLocation}
            eParticipants={eParticipants}
            eParticipantsMax={eParticipantsMax}
            ePrice={ePrice}
            description={description}
            setDescription={setDescription}
            setEStartDate={setEStartDate}
            setEEndDate={setEEndDate}
            setELocation={setELocation}
            setEParticipants={setEParticipants}
            setEPrice={setEPrice}
            setEParticipantsMax={setEParticipantsMax}
            setERegEnd={setERegEnd}
            setERegStart={setERegStart}
            setEName={setEName}
            setOrganisation={setOrganisation}
            />
            <Container>
                <LeftContainer eStartDate={eStartDate} eEndDate={eEndDate} eLocation={eLocation} eParticipants={eParticipants} ePrice={ePrice} eParticipantsMax={eParticipantsMax}/>
                <RightContainer description={description}></RightContainer>
            </Container>
        </Body>
    );
};

export default EventPage;