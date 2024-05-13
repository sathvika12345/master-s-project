import React, { useContext, useState } from 'react';
import { Button, Form, Input, Typography, message } from 'antd';
import styled from '@emotion/styled';
import { Link, useNavigate } from 'react-router-dom';
import { useHttpClient } from '../../hooks/useHttpClient';
import planetImage from '../../assets/images/planet.jpeg'
import { AuthContext } from '../../Context/authContext';
import { PropagateLoader } from 'react-spinners';

type FieldType = {
    username?: string;
    password?: string;
    email?: string;
};

const StyledDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    overflow: hidden; 
`;

const Login: React.FC = () => {
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetPasswordRequested, setResetPasswordRequested] = useState(false);
    const { setIsAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const { login,resetPassword, otpVerify } = useHttpClient();
    const [loading, setLoading] = useState(false);

    const onFinish = (values: any) => {
        if (!resetPasswordRequested && showForgotPassword) {
            onResetPassword(values);
        } else if(resetPasswordRequested){
            callOtpVerify(values);
        } else {
            const req = {
                userEmail: values.username,
                password: values.password
            }
            setLoading(true);
            login(req)
                .then(res => {
                    const token = res?.data?.token;
                    const userData = res?.data?.userData;
                    localStorage.setItem("token", token);
                    localStorage.setItem("userId", userData.userId);
                    localStorage.setItem("userRole", userData?.role);
                    localStorage.setItem("username", userData?.username);
                    if (res.status === 200) {
                        setIsAuthenticated(true);
                        setLoading(false);
                        navigate('/');
                    } else {
                        setLoading(false);
                        navigate('/login');
                    }
                })
                .catch(err => {
                    setLoading(false);
                    console.log("getting logging error", err.response.data.error);
                    message.error(err.response.data.error);
                })
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed to login:', errorInfo);
    };

    const onResetPassword = (values : any) => {
        const reqs = {
            email: values.email
        }
        setLoading(true);
        resetPassword(reqs)
        .then(res => {
            setLoading(false);
            if (res.status === 200) {
                setResetPasswordRequested(true);
            } else {
                setResetPasswordRequested(false);
            }
        })
        .catch(err => {
            setLoading(false);
            message.error(err.response.data.error);
        })
    }

    const callOtpVerify = (values : any) => {
        const reqs = {
            otp: values.otp,
            email: values.email,
            password: values.newPassword
        }
        setLoading(true);
        otpVerify(reqs)
        .then(res => {
            setLoading(false);
            if (res.status === 200) {
                message.success('Password changed successfully');
                setResetPasswordRequested(false);
                setShowForgotPassword(false);
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            }
        })
        .catch(err => {
            setLoading(false);
            message.error(err.response.data.error);
        })
    }

    return (
        <div style={{
            height: '100vh', display: 'flex', flexDirection: 'column',
            backgroundColor:"#e6ebeb",
            width: '100%',
        }}>
            {/* Logo Svg Start */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                onClick={() => { navigate("/") }}
                style={{ position: 'relative', top: 40, left: 40, cursor: 'pointer' }}
            >
                <g clip-path="url(#clip0_3_9)">
                    <path d="M9 15V23H1V15H9ZM23 15V23H15V15H23ZM9 1V9H1V1H9ZM23 1V9H15V1H23Z" stroke="#FFFFFF" stroke-width="2" />
                </g>
                <defs>
                    <clipPath id="clip0_3_9">
                        <rect width="24" height="24" fill="white" />
                    </clipPath>
                </defs>
            </svg>
            {/* Logo Svg Start */}
            <StyledDiv>
                {!loading && <div style={{ border: '1px solid grey', padding: 40, borderRadius: 0, color: 'black',backgroundColor:"#fff" }}>
                    <Typography.Title type='secondary' style={{ fontSize: 30, textAlign: 'center', marginBottom: 30, color: 'black' }}>Login</Typography.Title>
                    <Form
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 600 }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        {!showForgotPassword && (
                            <>
                                <Form.Item<FieldType>
                                    label={<span style={{ color: '#000' }}>Username</span>}
                                    name="username"
                                    rules={[{ required: true, message: 'Please input your username!' }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item<FieldType>
                                    label={<span style={{ color: '#000' }}>Password</span>}
                                    name="password"
                                    rules={[{ required: true, message: 'Please input your password!' }]}
                                >
                                    <Input.Password />
                                </Form.Item>
                            </>
                        )}

                        {showForgotPassword && (
                            <Form.Item<FieldType>
                                label={<span style={{ color: '#000' }}>Email :</span>}
                                name="email"
                                rules={[{ required: true, message: 'Please input your email!' }]}
                            >
                                <Input className='forgot-email' style={{ display: 'block', marginBottom: '8px' }} />
                            </Form.Item>
                        )}

                        {/* Conditionally render password fields if reset password process has started */}
                        {resetPasswordRequested && (
                            <>
                                <Form.Item
                                    label={<span style={{ color: '#000' }}>Verify OTP</span>}
                                    name="otp"
                                    rules={[{ required: true, message: 'Please input the OTP!' }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label={<span style={{ color: '#000' }}>New Password</span>}
                                    name="newPassword"
                                    rules={[{ required: true, message: 'Please input your new password!' }]}
                                >
                                    <Input.Password />
                                </Form.Item>
                                <Form.Item
                                    label={<span style={{ color: '#000' }}>Confirm Password</span>}
                                    name="confirmPassword"
                                    dependencies={['newPassword']}
                                    rules={[
                                        { required: true, message: 'Please confirm your password!' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('newPassword') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('The two passwords do not match!'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password />
                                </Form.Item>
                            </>
                        )}
                        <div style={showForgotPassword ? { display: 'flex', justifyContent: 'center', gap: '13px' } : {display: 'flex', justifyContent: 'center', gap: '13px'}}>
                            <Form.Item>
                                <Button htmlType="submit" style={{ marginRight: '8px',backgroundColor:"#000",color:"#fff" }} ghost>
                                    {showForgotPassword ? 'Reset Password' : 'Submit'}
                                </Button>
                            </Form.Item>

                            {!showForgotPassword && (
                                <Form.Item wrapperCol={{ span: 16 }}>
                                    <Button onClick={() => setShowForgotPassword(true)} type="text" style={{ color: '#000' }}>
                                        Forgot password?
                                    </Button>
                                </Form.Item>
                            )}
                        </div>

                        {/* Forgot password button */}
                        {showForgotPassword && (
                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                <Button type="text" onClick={() => setShowForgotPassword(false)}>Cancel</Button>
                            </Form.Item>
                        )}

                    </Form>
                    <Typography.Text style={{ color: 'black',display:"block",textAlign:"center" }}>Not yet registered?&nbsp;&nbsp;
                        <Link to="/signup" style={{ color: '#000' }}><u>Signup</u></Link>
                    </Typography.Text>
                </div>}
                {
                    loading && (
                        <>
                            <Typography.Paragraph>Saving data hold on for a while</Typography.Paragraph>
                            <PropagateLoader color="#36D7B7" loading={true} />
                        </>
                    )
                }
            </StyledDiv>
        </div>
    )
};

export default Login;