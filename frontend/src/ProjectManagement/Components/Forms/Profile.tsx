import React, { useContext, useEffect, useState, useRef } from 'react';
import { Button, Form, Input, Typography, message } from 'antd';
import styled from '@emotion/styled';
import { User } from '../../utils';
import { useHttpClient } from '../../hooks/useHttpClient';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/authContext';
import earthImage from '../../assets/images/earth3.jpeg'

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const ProfileUpdate: React.FC = () => {

    const [profile, setProfile] = useState<User>();
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const { getUser, updateUser,uploadFile, updateUserProfile } = useHttpClient();
    const navigate = useNavigate();
    const { userData } = useContext(AuthContext);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onFinish = (values: any) => {
        const req = {
            email: values?.email,
            password: values?.password
        }
        updateUser(profile?.rollNo, req)
            .then(res => {
                message.info('User Data Updated Successfully');
                localStorage.clear();
                navigate("/");
            })
            .catch(err => {
                console.log('User Updation failed');
            })
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) {
            // No files selected, do nothing
            return;
        }
        
        const file = files[0];
        const formData = new FormData();
        formData.append('file', file);
        const userId = localStorage.getItem("userId") || userData.userId;
        const req = {
            displayPictureUrl: null,
            email: profile?.email,
            name : profile?.name
        }
        try {
            // Call your uploadFile function
            const fileUrl = uploadFile(formData).then(res => {
                // Handle the response, e.g., show a success message
                if(res.status == 200){
                    req.displayPictureUrl = res.data.fileUrl;
                    updateUserProfile(Number(userId),req).then(response => {
                        message.success('Profile Pic uploaded Successfully');
                    }).catch(error => {
                        message.error('Failed to upload file');
                    });
                    setProfilePicture(res.data.fileUrl);
                }
            }).catch(err => {
                console.error('Error uploading file:', err);
                // Handle error, e.g., show error message
                message.error('Failed to upload file');
            });
        
        } catch (error) {
            console.error('Error uploading file:', error);
            // Handle error, e.g., show error message
            message.error('Failed to upload file');
        }
    };

    const handleClick = () => {
        // Trigger file input click when round box is clicked
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
    };

    useEffect(() => {
        const userId = localStorage.getItem("userId") || userData.userId;
        getUser(userId)
            .then(res => {
                const user = res?.data;
                setProfilePicture(user.displayPictureUrl);
                setProfile(user);
            })
            .catch(err => {
                console.log('User details not found');
            })
    }, [])

    if (!profile) {
        return null
    }

    return (
        <div style={{
            height: '100vh', display: 'flex', flexDirection: 'column',
            backgroundImage: `url(${earthImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%',
        }}>
            <StyledDiv>
                <div style={{ border: '1px solid grey', padding: 40, borderRadius: 8 }}>
                    <Typography.Title type='secondary' style={{ fontSize: 30, textAlign: 'center', marginBottom: 30, color: 'white' }}>Update Profile</Typography.Title>
                    {/* Profile picture */}
                    <label style={{ position: 'relative', cursor: 'pointer' }}>
                        {/* File input hidden from view */}
                        <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={handleFileUpload} />
                        {/* Profile picture box */}
                        <div style={{ width: 200, height: 200, borderRadius: '50%', overflow: 'hidden', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center',margin:'auto',marginBottom:'20px' }} onClick={handleClick}>
                        {profilePicture ? (
                            <img src={profilePicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ backgroundColor: '#ccc', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span>No Image</span>
                            </div>
                        )}
                        </div>
                    </label>
                <Form
                    name="basic"
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                            label={<span style={{ color: '#FFFFFF' }}>Name</span>}
                            name="name"
                        labelAlign='left'
                    >
                            <Input
                                defaultValue={profile?.name}
                                value={profile?.name}
                                disabled
                                style={{ color: '#FFFFFF' }}
                            />
                    </Form.Item>


                    <Form.Item
                            label={<span style={{ color: '#FFFFFF' }}>Email</span>}
                        name="email"
                        rules={[{ required: true, message: 'Please input your email!' }]}
                        labelAlign='left'
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                            label={<span style={{ color: '#FFFFFF' }}>Password</span>}
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                        labelAlign='left'
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                            label={<span style={{ color: '#FFFFFF' }}>Confirm Password</span>}
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Please confirm your password!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords do not match!'));
                                },
                            }),
                        ]}
                        labelAlign='left'
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                            label={<span style={{ color: '#FFFFFF' }}>Roll No</span>}
                        name="rollNo"
                        rules={[{ required: false, message: 'Please input your roll number!' }]}
                        labelAlign='left'
                    >
                            <Input disabled defaultValue={profile?.rollNo} value={profile?.rollNo} style={{ color: '#FFFFFF' }} />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button htmlType="submit" ghost>
                            Update
                        </Button>
                    </Form.Item>
                </Form>
                </div>
            </StyledDiv>
        </div>
    );
};

export default ProfileUpdate;
