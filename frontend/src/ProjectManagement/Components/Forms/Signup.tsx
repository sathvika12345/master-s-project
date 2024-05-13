import React, { useState } from 'react';
import { Button, Form, Input, Typography,Select } from 'antd';
import styled from '@emotion/styled';
import { Link, useNavigate } from 'react-router-dom';
import { PropagateLoader } from 'react-spinners';
import { UserRole } from '../../utils';
import { useHttpClient } from '../../hooks/useHttpClient';
import blackHole from '../../assets/images/moon.jpeg'

type FieldType = {
    firstname?:string;
    lastname?:string;
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    role?:string,
    rollNo?: string;
    userRole: UserRole
};

const StyledDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
`;

const Signup: React.FC = () => {

    const { Option } = Select;

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { signup } = useHttpClient();

    const onFinish = (values: any) => {
        console.log('Success:', values);
        setLoading(true);
        signup(values)
            .then(res => {
                setLoading(false);
                navigate('/');
            })
            .catch(err => {
                setLoading(false);
                navigate('/signup');
            })
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

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
                {!loading && <div style={{ border: '1px solid grey', padding: 40, borderRadius: 0, backgroundColor:"#fff",color:"#000" }}>
                    <Typography.Title type='secondary' style={{ fontSize: 30, textAlign: 'center', marginBottom: 30, color: '#000' }}>Student Project Portal</Typography.Title>
                    <Form
                        name="basic"
                        labelCol={{ span: 10 }}
                        wrapperCol={{ span: 25 }}
                        style={{ maxWidth: 700 }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item<FieldType>
                            name="firstname"
                            rules={[{ required: true, message: 'Please input your first name!' }]}
                            labelAlign='left'
                        >
                            <Input placeholder='First Name' style={{width:'100%'}}/>
                        </Form.Item>
                        <Form.Item<FieldType>
                            name="lastname"
                            rules={[{ required: true, message: 'Please input your last name!' }]}
                            labelAlign='left'
                        >
                            <Input placeholder='Last Name' style={{width:'100%'}}/>
                        </Form.Item>
                        <Form.Item<FieldType>
                            name="name"
                            rules={[{ required: true, message: 'Please input your user name!' }]}
                            labelAlign='left'
                        >
                            <Input placeholder='User Name' style={{width:'100%'}}/>
                        </Form.Item>

                        <Form.Item<FieldType>
                            name="role"
                            rules={[{ required: true, message: 'Please Select your role' }]}
                            labelAlign='left'
                        >
                                <Select placeholder="Select Role">
                                    <Option value="student">Student</Option>
                                    <Option value="reviewer">Reviewer</Option>
                                    <Option value="admin">Admin</Option>
                                </Select>
                        </Form.Item>

                        <Form.Item<FieldType>
                            name="email"
                            rules={[{ required: true, message: 'Please input your email!' }]}
                            labelAlign='left'
                        >
                            <Input type="email" placeholder='Email Address' style={{width:'100%'}}/>
                        </Form.Item>

                        <Form.Item<FieldType>
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                            labelAlign='left'
                        >
                            <Input.Password placeholder='Password' style={{width:'100%'}}/>
                        </Form.Item>

                        <Form.Item<FieldType>
                            name="confirmPassword"
                            dependencies={['password']}
                            labelAlign='left'
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
                        >
                            <Input.Password placeholder='Re-enter Password' style={{width:'100%'}} />
                        </Form.Item>

                        <Form.Item<FieldType>
                            name="rollNo"
                            rules={[{ required: false, message: 'Please input your UAlbany ID!' }]}
                            labelAlign='left'
                        >
                            <Input placeholder='UAlbany ID' style={{width:'100%'}}/>
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 0, span: 16 }}>
                            <Button htmlType="submit" ghost style={{backgroundColor:"#461469",color:"#fff",borderRadius:"0"}}>
                                Register
                            </Button>
                        </Form.Item>
                    </Form>
                    <Typography.Text style={{ color:"#461469" }}>
                        Already have an accounnt?&nbsp;&nbsp;
                        <Link to="/login" style={{ color:"#461469" }}><u>Login</u></Link>
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
            </StyledDiv >
        </div >
    )
};

export default Signup;
