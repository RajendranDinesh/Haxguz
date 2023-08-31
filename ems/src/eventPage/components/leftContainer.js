import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";

import Calendar from "./icons/calendar.png"
import Location from "./icons/location.png"
import User from "./icons/user.png"
import Rupee from "./icons/rupee.png"

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Cookies from "js-cookie";
import { Modal } from "../../userProfile/components/Modal";
dayjs.extend(utc);
dayjs.extend(timezone);

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
    background-color: #8739F9;
    color: #efefef;
    border: 2px solid #1f253d;
    border-radius: 5px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    margin-bottom: 10px;

    height: 60px;
    width: 140px;

    &:hover {
        background-color: #C651CD;
        border: 2px solid #efefef;
    }
`;

const ButtonText = styled.a`
    color: inherit;
    font-size: 1rem;
    font-weight: 500;
    letter-spacing: 0.1rem;
    text-decoration: none;
    font-family: 'Montserrat', sans-serif;
    text-transform: uppercase;
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

const ModalContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    overflow-y: scroll;
    &::-webkit-scrollbar{display: none};
    color: #efefef;
`;

const TeamInfoContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 90%;
    overflow-x: none;
    flex-wrap: wrap;
    margin-top: 2vh;
    margin-bottom: 4vh;

    border: 1px solid #efefef;
    border-radius: 10px;
`;

const MemberInfo = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px
`;

const MemberName = styled.a`
    font-size: 2em;
`;

const MemberEmail = styled.a`
    font-size: 1.1em;
`;

const LeftContainer = ({ eStartDate, eEndDate, eLocation, eParticipants, ePrice, eParticipantsMax, isMod, id, isRegistered, isTeamEvent, maxNumberOfTeams }) => {

    const API_URL = process.env.REACT_APP_API_URL;
    const authToken = Cookies.get('authToken');

    const handleRedirectToTicket = () => {
        window.location.href = `/create-ticket/${id}`;
    }

    const handleUserRedirectToTicket = () => {
        window.location.href = `/view-ticket/${id}`;
    };

    const handleRedirectToCertificate = () => {
        window.location.href = `/create-certificate/${id}`;
    };

    const handleUserRedirectToCertificate = () => {
        window.location.href = `/view-certificate/${id}`;
    };

    const isEventOver = dayjs(eEndDate).isBefore(dayjs());

    const handlePayment = async () => {
        await axios.post(
            `${API_URL}/create-checkout-session-solo`,
            {
                eventId: id,
            },
            {
                headers: {
                    'Bypass-Tunnel-Reminder': 'eventaz',
                    Authorization: `Bearer ${authToken}`,
                },
            }
        )
            .then((res) => {
                console.log(res);
                window.location.href = res.data.url;
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleTeamPayment = async (teamName) => {
        await axios.post(
            `${API_URL}/create-checkout-session-team`,
            {
                eventId: id,
                teamName: teamName,
            },
            {
                headers: {
                    'Bypass-Tunnel-Reminder': 'eventaz',
                    Authorization: `Bearer ${authToken}`,
                },
            }
        )
            .then((res) => {
                console.log(res);
                window.location.href = res.data.url;
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
    const [isPaymentIntimidationOpen, setIsPaymentIntimidationOpen] = useState(false);
    const [teamData, setTeamData] = useState([]);
    const [teamName, setTeamName] = useState('');
    const [totalMembers, setTotalMembers] = useState(0);

    const handleRegistrationOpen = async () => {
        try {
            const authToken = Cookies.get('authToken');
            const response = await axios.get(`${API_URL}/teams/user`, {
                headers: {
                Authorization: `Bearer ${authToken}`,
                'Bypass-Tunnel-Reminder': 'eventaz',
            }})

            setTeamData(response.data.teamObjects);
            setIsRegistrationOpen(true);
        } catch (error) {
            alert(error.message);
        }
    };

    const handleChooseTeam = async (teamName) => {
    try {
        const response = await axios.get(`${API_URL}/teams/teaminfo/${teamName.teamName}/${id}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                'Bypass-Tunnel-Reminder': 'eventaz',
                }})

        setTeamName(response.data.teamName);
        setTotalMembers(response.data.totalMembers);
        handlePaymentModalOpen(true);
    } catch (error) {
        
    }
    };

    const handlePaymentModalOpen = () => {
        setIsPaymentIntimidationOpen(true);
    };

    const handlePaymentModalClose = () => {
        setIsPaymentIntimidationOpen(false);
    };

    const handleRegistrationClose = () => {
        setIsRegistrationOpen(false);
    };

    return (
        <>
        <Body>
            <Container>

                <ItemContainer>
                    <img src={Calendar} width={"30px"} height={"30px"} alt=""></img>
                    <TextContainer>
                        <TextTitle href={() => false}>Start Date</TextTitle>
                        <TextItem href={() => false}>{dayjs(eStartDate).utc().tz('Asia/Kolkata').format('DD/MM/YYYY')}</TextItem>
                    </TextContainer>
                </ItemContainer>

                <ItemContainer>
                    <img src={Calendar} width={"30px"} height={"30px"} alt=""></img>
                    <TextContainer>
                        <TextTitle href={() => false}>End Date</TextTitle>
                        <TextItem href={() => false}>{dayjs(eEndDate).utc().tz('Asia/Kolkata').format('DD/MM/YYYY')}</TextItem>
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
                    <TextContainer>
                        <TextTitle href={() => false}> Team Event {isTeamEvent? <>Yes</>:<>No</>}</TextTitle>
                    </TextContainer>
                </ItemContainer>

                {isTeamEvent ? 
                    (<>
                    <ItemContainer>
                        <img src={User} width={"30px"} height={"30px"} alt=""></img>
                        <TextContainer>
                            <TextTitle href={() => false}> Maximum Registration Allowed</TextTitle>
                            <TextItem href={() => false}>{maxNumberOfTeams}</TextItem>
                        </TextContainer>
                    </ItemContainer>
                    <ItemContainer>
                        <img src={User} width={"30px"} height={"30px"} alt=""></img>
                        <TextContainer>
                            <TextTitle href={() => false}> Minimum Team Size</TextTitle>
                            <TextItem href={() => false}>{eParticipants}</TextItem>
                        </TextContainer>
                    </ItemContainer>
                    <ItemContainer>
                        <img src={User} width={"30px"} height={"30px"} alt=""></img>
                        <TextContainer>
                            <TextTitle href={() => false}> Maximum Team Size</TextTitle>
                            <TextItem href={() => false}>{eParticipantsMax}</TextItem>
                        </TextContainer>
                    </ItemContainer>
                    </>) :
                (<ItemContainer>
                    <img src={User} width={"30px"} height={"30px"} alt=""></img>
                    <TextContainer>
                        <TextTitle href={() => false}> Maximum Registration Allowed</TextTitle>
                        <TextItem href={() => false}>{eParticipantsMax}</TextItem>
                    </TextContainer>
                </ItemContainer>)}

                <ItemContainer>
                    <img src={Rupee} width={"30px"} height={"30px"} alt=""></img>
                    <TextContainer>
                        <TextTitle href={() => false}>Price</TextTitle>
                        <TextItem href={() => false}>₹{ePrice}</TextItem>
                    </TextContainer>
                </ItemContainer>

                {authToken ? (
                    <>{isMod ? (
                        <>
                        <Button onClick={handleRedirectToTicket}>
                            <ButtonText href={() => false}>Ticket</ButtonText>
                        </Button>
                        <Button onClick={handleRedirectToCertificate}>
                            <ButtonText href={() => false}>Certificate</ButtonText>
                        </Button>
                        </>
                    ) : (
                        isRegistered ? (<>
                            <Button onClick={handleUserRedirectToTicket}>
                                <ButtonText href={() => false}>Your Ticket</ButtonText>
                            </Button>
                            {isEventOver ? (<>
                                <Button onClick={handleUserRedirectToCertificate}>
                                    <ButtonText href={() => false}>Your Certificate</ButtonText>
                                </Button>
                                </>) : (<></>)}
                        </>) : (
                            <>
                                {/* <Button onClick={handlePayment}> */}
                                <Button onClick={handleRegistrationOpen}>
                                    <ButtonText href={() => false}>Register</ButtonText>
                                </Button>
                            </>)
                    )}</>) : (<></>)}
            </Container>
        </Body>

{/*Team Choosing*/}
        <Modal isOpen={isRegistrationOpen} onClose={handleRegistrationClose} modalHeight={"50vh"} modalWidth={"45vw"}>
            {isTeamEvent? (
            <ModalContainer>
                <a href={() => false}>Choose Your Team</a>
                {Object.keys(teamData).length !== 0 && teamData.map((team, index) => (
                    <TeamInfoContainer key={index}>
                        <MemberInfo style={{"border":"1px solid #efefef", "borderRadius":"10px", "marginTop":"10px", "marginBottom":"10px"}}>
                            <a href={() => false} style={{fontSize: "2em"}}>{team.teamName}</a>Created By
                            <MemberName>
                                {team.teamLead.name}
                            </MemberName>
                            <MemberEmail>
                                {team.teamLead.email}
                            </MemberEmail>
                        </MemberInfo>
                        
                        {team.teamMembers.map((member, index) => (
                        <MemberInfo key={index}>
                            <MemberName>
                                {member.name}
                            </MemberName> 
                            <MemberEmail>
                                {member.email}
                            </MemberEmail>
                        </MemberInfo>))}

                        <Button onClick={() => {handleChooseTeam({teamName: team.teamName})}}>
                            <ButtonText href={() => false}>Use This Team</ButtonText>
                        </Button>

                    </TeamInfoContainer>
                    ))}
            </ModalContainer>
            ) : (
            <>
                <a href={() => false}>Click On Pay Now.</a>
                <Button onClick={handlePayment}>
                    <ButtonText href={() => false}>Pay Now</ButtonText>
                </Button>
            </>)}
        </Modal>

{/*Payment Intimidation*/}
        <Modal isOpen={isPaymentIntimidationOpen} onClose={handlePaymentModalClose} modalHeight={"40vh"} modalWidth={"40vw"}>
            <ModalContainer>
                <a href={() => false}>Team Name: {teamName}</a>
                <a href={() => false}>Total Members: {totalMembers}</a>
                <a href={() => false}>Total Amount: ₹{totalMembers*ePrice}</a>
                <a href={() => false}>Click On Pay Now.</a>
                <Button onClick={() => handleTeamPayment(teamName)}>
                    <ButtonText href={() => false}>Pay Now</ButtonText>
                </Button>
            </ModalContainer>
        </Modal>
        </>
    );
}

export default LeftContainer;