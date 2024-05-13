import styled from "@emotion/styled";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Dropdown, Image, MenuProps, Modal } from "antd";
import projectImage from '../assets/images/logo.png'
import { ProjectUpload } from "./ProjectUpload";

const StyledDiv = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center; 
    width: 100%; 
    background-color: rgb(29,29,31);
    // background: linear-gradient(to top left, #13171c 0%, #1a2e4d 63%);
    border: 2px solid rgb(47,48,50); 
    border-radius: 8px;
`;

export const UserNavbar = () => {
    const [showUpload, setshowUpload] = useState(false);
    const role = localStorage.getItem("userRole");
    const navigate = useNavigate();
    const location = useLocation();
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: <Link to="/profile">Profile</Link>,
        },
        {
            key: '2',
            label: (
                <a
                    href="/"
                    onClick={() => {
                        localStorage.clear();
                    }}
                >
                    Logout
                </a>
            ),
        }]
    return (
        <StyledDiv style={{display:'flex' ,justifyContent:'center'}}>
            {/* Logo Start */}
            {/* <Image preview={false} src={projectImage} style={{ width: '40px', height: '40px', marginLeft: '15px', cursor: 'pointer' }} onClick={() => { navigate("/") }} /> */}
            {/* Logo Start */}
            <div >
                {/* Upload Svg Start */}
                {role == 'student' && location.pathname !== '/approved-projects' && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ padding: '15 20 10 0', cursor: 'pointer' }}
                    onClick={() => { setshowUpload(true); }}>
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 1.25C12.1083 1.24993 12.2153 1.27331 12.3137 1.31854C12.4121 1.36377 12.4995 1.42977 12.57 1.512L15.57 5.012C15.6994 5.16317 15.7635 5.35957 15.7481 5.55798C15.7327 5.7564 15.6392 5.94057 15.488 6.07C15.3368 6.19943 15.1404 6.2635 14.942 6.24812C14.7436 6.23274 14.5594 6.13917 14.43 5.988L12.75 4.028V15C12.75 15.1989 12.671 15.3897 12.5303 15.5303C12.3897 15.671 12.1989 15.75 12 15.75C11.8011 15.75 11.6103 15.671 11.4697 15.5303C11.329 15.3897 11.25 15.1989 11.25 15V4.027L9.57 5.988C9.50591 6.06285 9.42771 6.12435 9.33986 6.16898C9.25201 6.21361 9.15623 6.2405 9.05798 6.24812C8.95974 6.25573 8.86096 6.24392 8.76728 6.21336C8.6736 6.1828 8.58685 6.13409 8.512 6.07C8.43715 6.00592 8.37565 5.92771 8.33102 5.83986C8.28639 5.75201 8.2595 5.65623 8.25188 5.55798C8.24427 5.45974 8.25608 5.36096 8.28664 5.26728C8.3172 5.1736 8.36592 5.08685 8.43 5.012L11.43 1.512C11.5005 1.42977 11.5879 1.36377 11.6863 1.31854C11.7847 1.27331 11.8917 1.24993 12 1.25ZM6.996 8.252C7.19491 8.25094 7.3861 8.32894 7.5275 8.46884C7.6689 8.60874 7.74894 8.79909 7.75 8.998C7.75106 9.19691 7.67306 9.3881 7.53316 9.5295C7.39326 9.6709 7.20291 9.75094 7.004 9.752C5.911 9.758 5.136 9.786 4.547 9.894C3.981 9.999 3.652 10.166 3.409 10.409C3.132 10.686 2.952 11.075 2.853 11.809C2.752 12.564 2.75 13.565 2.75 15V16C2.75 17.436 2.752 18.437 2.853 19.192C2.952 19.926 3.133 20.314 3.409 20.592C3.686 20.868 4.074 21.048 4.809 21.147C5.563 21.249 6.565 21.25 8 21.25H16C17.435 21.25 18.436 21.249 19.192 21.147C19.926 21.048 20.314 20.868 20.591 20.591C20.868 20.314 21.048 19.926 21.147 19.192C21.248 18.437 21.25 17.436 21.25 16V15C21.25 13.565 21.248 12.564 21.147 11.808C21.048 11.075 20.867 10.686 20.591 10.409C20.347 10.166 20.019 9.999 19.453 9.894C18.864 9.786 18.089 9.758 16.996 9.752C16.8975 9.75147 16.8001 9.73155 16.7093 9.69338C16.6185 9.6552 16.5361 9.59952 16.4668 9.5295C16.3976 9.45949 16.3428 9.37651 16.3056 9.28532C16.2684 9.19412 16.2495 9.09649 16.25 8.998C16.2505 8.89951 16.2704 8.80209 16.3086 8.71129C16.3468 8.6205 16.4025 8.53811 16.4725 8.46884C16.5425 8.39957 16.6255 8.34477 16.7167 8.30756C16.8079 8.27035 16.9055 8.25147 17.004 8.252C18.086 8.258 18.987 8.284 19.724 8.419C20.482 8.559 21.127 8.824 21.652 9.349C22.254 9.95 22.512 10.709 22.634 11.609C22.75 12.475 22.75 13.578 22.75 14.945V16.055C22.75 17.423 22.75 18.525 22.634 19.392C22.512 20.292 22.254 21.05 21.652 21.652C21.05 22.254 20.292 22.512 19.392 22.634C18.525 22.75 17.422 22.75 16.055 22.75H7.945C6.578 22.75 5.475 22.75 4.608 22.634C3.708 22.513 2.95 22.254 2.348 21.652C1.746 21.05 1.488 20.292 1.367 19.392C1.25 18.525 1.25 17.422 1.25 16.055V14.945C1.25 13.578 1.25 12.475 1.367 11.608C1.487 10.708 1.747 9.95 2.348 9.348C2.873 8.824 3.518 8.558 4.276 8.419C5.013 8.284 5.914 8.258 6.996 8.252Z" fill="#FFFFFF" />
                  </svg>
                )}
                {/* Upload Svg end */}
                {/* Profile Svg Start */}
                {/* <Dropdown menu={{ items }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ padding: '15 30 10 0', cursor: 'pointer' }}>
                        <path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4.271 18.346C4.271 18.346 6.5 15.5 12 15.5C17.5 15.5 19.73 18.346 19.73 18.346M12 12C12.7956 12 13.5587 11.6839 14.1213 11.1213C14.6839 10.5587 15 9.79565 15 9C15 8.20435 14.6839 7.44129 14.1213 6.87868C13.5587 6.31607 12.7956 6 12 6C11.2044 6 10.4413 6.31607 9.87868 6.87868C9.31607 7.44129 9 8.20435 9 9C9 9.79565 9.31607 10.5587 9.87868 11.1213C10.4413 11.6839 11.2044 12 12 12Z" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </Dropdown> */}
                {/* Profile Svg end */}
            </div>
            <Modal
                open={showUpload}
                title=""
                footer={false}
                onCancel={() => {
                    setshowUpload(false);
                }}
                width={700}
            >
                <ProjectUpload />
            </Modal>
        </StyledDiv>
    );
};
