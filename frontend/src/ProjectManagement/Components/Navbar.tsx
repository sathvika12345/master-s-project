import React,{useContext} from "react";
import styled from "@emotion/styled";
import { Link, useNavigate } from "react-router-dom";
// import projectImage from '../assets/images/project-logo.png'
import projectImage from '../assets/images/logo1.jpeg'
import { Dropdown, Image, MenuProps, Modal } from "antd";
import { AuthContext } from '../Context/authContext';

const StyledDiv = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center; 
    width: 100%; 
    >*{
        padding:50px;
    }
`;

const LinksContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-right: 20px;
`;

const LinkItem = styled(Link)`
    margin-right: 30px;
    color: #FFFFFF;
    text-decoration: none;
    &:last-child {
        margin-right: 0;
    }
`;

const LoginButton = styled.div`
    background-color: #FFFFFF;
    color: #000000;
    padding: 5px 20px;
    border-radius: 20px;
    cursor: pointer;
`;

export const NavBar = () => {

    const { isAuthenticated } = useContext(AuthContext);
    console.log(isAuthenticated, 'isAuthenticated');
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: <Link to="/profile">Profile</Link>,
        },
        {
            key: '2',
            label: (
                <a
                    href="/login"
                    onClick={() => {
                        localStorage.clear();
                    }}
                >
                    Logout
                </a>
            ),
        }]

    const navigate = useNavigate();
    const role = localStorage.getItem("userRole");
    return (
        <StyledDiv style={{ backgroundColor: isAuthenticated ? '#333' :'#333' }}>
            {/* <ProjectIcon style={{ padding: '10px 30px', cursor: 'pointer' }} onClick={() => { navigate("/") }} /> */}
            <Image preview={false} src={projectImage} style={{ width: '400px', 
            height: '80px', marginLeft: '15px',
             cursor: 'pointer' }} onClick={() => { navigate("/") }} />
            <LinksContainer>
                <LinkItem to="/">Home</LinkItem>
                {(role=='student' || role=="admin") &&  isAuthenticated && <LinkItem to='/projects'>Projects</LinkItem> }
                { role=="admin" &&  isAuthenticated && <LinkItem to='/allow-reviewer'>Allow Reviewer</LinkItem> }
                {role=='student' &&isAuthenticated && <LinkItem to="/approved-projects">Approved Projects</LinkItem>}
                {role=='reviewer' && isAuthenticated && <LinkItem to="/reviewer">Review Projects</LinkItem>}

                <LinkItem to="/about">About us</LinkItem>
                {!isAuthenticated && <LoginButton onClick={() => { navigate("/login") }}>Login</LoginButton> }
                
                {isAuthenticated && <Dropdown menu={{ items }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ padding: '15 30 10 0', cursor: 'pointer' }}>
                        <path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M4.271 18.346C4.271 18.346 6.5 15.5 12 15.5C17.5 15.5 19.73 18.346 19.73 18.346M12 12C12.7956 12 13.5587 11.6839 14.1213 11.1213C14.6839 10.5587 15 9.79565 15 9C15 8.20435 14.6839 7.44129 14.1213 6.87868C13.5587 6.31607 12.7956 6 12 6C11.2044 6 10.4413 6.31607 9.87868 6.87868C9.31607 7.44129 9 8.20435 9 9C9 9.79565 9.31607 10.5587 9.87868 11.1213C10.4413 11.6839 11.2044 12 12 12Z" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </Dropdown>}
            </LinksContainer>
        </StyledDiv>
    );
};
