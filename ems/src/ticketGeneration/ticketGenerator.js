import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useParams } from "react-router-dom";

import { QRCodeContainer } from "./components/QRCodeContainer";
import { DetailsContainer } from "./components/DetailsContainer";

import Dropzone from "react-dropzone";
import Cookies from "js-cookie";
import { SweetAlert } from "../components/SweetAlert.js"

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height:100vh;
    width:100vw;
    background-color: #394264;
    color: #efefef;
`;

const TicketContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height:72vh;
    width: 82vw;
    border: 1px dashed black;
    background-color: gray;
`;

const Ticket = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    height:68vh;
    width: 80vw;
    border: 1px solid black;
    background-image: url(${props => props.background});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    background-color : #efefef;
`;

const BackGround = styled.button`
    display: flex;
    position: absolute;
    top: 10em;
    left: 10em;
    border: 1px solid black;
    border-radius: 5px;
    background-color: #8739F9;
    color: #efefef;
    margin: 1em;
    font-size: 0.9em;
    font-weight: bold;
    cursor: pointer;

    &:hover {
        background-color: #C651CD;
        transition: background-color 0.8s ease-out;
    }
`;

const GenerateButton = styled.button`
    cursor: pointer;
    border-radius: 5px;
    border: 1px solid black;
    background-color: #8739F9;
    color: #efefef;
    margin: 1em;
    font-size: 0.9em;
    font-weight: bold;
    padding: 0.25em 1em;

    &:hover {
        background-color: #C651CD;
        transition: background-color 0.8s ease-out;
    }
`;

const ResultText = styled.a`
    font-size: 1.5em;
    font-weight: bold;
    color: #efefef;
    margin: 1em;
`;

const TicketGenerator = () => {

    const API_URL = process.env.REACT_APP_API_URL;

    const { id } = useParams();

    const [background, setBackground] = useState(null);
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [isTicketGenerated, setIsTicketGenerated] = useState(false);

    const onBackgroundDrop = (acceptedFiles) => {
        if(isTicketGenerated){
            setIsTicketGenerated(false);
        }
        const image = acceptedFiles[0];
        setBackgroundImage(image);
        const reader = new FileReader();

        reader.onload = (e) => {
            setBackground(e.target.result);
        }

        reader.readAsDataURL(image);
    };

    const onGenerateClick = async () => {
        try {
            const formData = new FormData();
            formData.append('background', backgroundImage);
            formData.append('eventId', id);

            const response = await axios.post(`${API_URL}/ticket/create`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("authToken")}`,
                        'Bypass-Tunnel-Reminder': 'eventaz',
                    },
                });

            if (response.status === 201) {
                await SweetAlert({
                    title: "Success",
                    children: "Ticket Generated Successfully",
                    icon: "success",
                });
                setIsTicketGenerated(true);
            }

        }
        catch (error) {
            if (error.response.status === 400) {
                await SweetAlert({
                    title: "Error",
                    children: "Please Choose a Background Image",
                    icon: "error",
                })
            }
            else {
                console.log(error);
            }
        }
    };

    useEffect(() => {
        
        document.title = "Ticket Generator | Haxguz";

        const onLoad = async () => {
            try {
                const response = await axios.get(`${API_URL}/ticket/org/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${Cookies.get("authToken")}`,
                            'Bypass-Tunnel-Reminder': 'eventaz',
                        },
                    });
                    if(response.status === 200){
                        setBackground(response.data.backgroundImageUrl);
                        setIsTicketGenerated(true);   
                        return;
                    }
                    
                    setIsTicketGenerated(false);
            }
            catch (error) {
                console.log(error);
                if (error.response.status === 403) {
                    await SweetAlert({
                        title: "Error",
                        children: "You are not authorized to perform this action",
                        icon: "error",
                    })
    
                    window.location.href = "/login";
                }
            }
        };

        onLoad();
    }, [API_URL, id]);

    return (
        <>

            <Container>
                <h1>Ticket Generator</h1>
                <TicketContainer>
                    <BackGround>
                        <Dropzone onDrop={onBackgroundDrop} multiple={false}>
                            {({ getRootProps, getInputProps }) => (
                                <div {...getRootProps()}>
                                    <input {...getInputProps()} accept="image/*"></input>
                                    <>Change Background</>
                                </div>)}
                        </Dropzone>
                    </BackGround>
                    <Ticket background={background}>
                        <DetailsContainer />
                        <QRCodeContainer />
                    </Ticket>
                </TicketContainer>
                {isTicketGenerated ? (
                <ResultText href={() => false}>Ticket Generated</ResultText>
                    ) : (
                    <GenerateButton onClick={onGenerateClick}>
                        <>Generate</>
                    </GenerateButton>)}
            </Container>

        </>
    );
};

export default TicketGenerator;