import { InboxOutlined } from '@ant-design/icons';
import { Form, message, Upload, Button, Input } from 'antd';
import styled from '@emotion/styled';
import { useHttpClient } from '../hooks/useHttpClient';
import { useForm } from 'antd/es/form/Form';
import { Project } from '../utils';
import moment from 'moment';
import { useState } from 'react';
const { Dragger } = Upload;

const StyledDiv = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    min-height: 40vh;
    padding: 30px 0px;
    border-radius: 8px;
    background-color: rgb(29,29,31);
`;

export const ProjectUpload = () => {

    console.log("upload Project called");

    const allowedFileTypes = [
        'application/pdf',
        'video/mp4',
        'image/jpeg',
        'image/png',
        'image/jpg',
        'video/quicktime',
        'video/x-msvideo',
    ].join(',');

    const { uploadFile, uploadProject } = useHttpClient();
    const [loading, setLoading] = useState(false);
    const [form] = useForm();

    const onFinish = (values: any) => {
        console.log('values', values);
        let abstractUrl: string;
        setLoading(true);
        const projectFormData = new FormData();
        const projectFile = values.projectFile.fileList[0]['originFileObj'];
        projectFormData.append('file', projectFile);
        uploadFile(projectFormData)
            .then(res => {
                console.log(res);
                const projectUrl = res?.data?.fileUrl;
                const abstractFormData = new FormData();
                const abstractFile = values.abstractFile.fileList[0]['originFileObj'];
                abstractFormData.append('file', abstractFile);
                uploadFile(abstractFormData)
                    .then(res => {
                        console.log('ssss',res);
                        abstractUrl = res?.data?.fileUrl;
                        const project: Project = {
                            projectName: values?.name,
                            projectDescription: values?.description,
                            projectAssetUrl: projectUrl,
                            abstractUrl: abstractUrl,
                            dateOfSubmission: moment().format('DD-MM-YYYY'),
                            createdAt:null,
                            submittedBy: localStorage.getItem("username") || "",
                            userId: localStorage.getItem("userId") || ""
                        }
                        uploadProject(project)
                            .then(res => {
                                setLoading(false);
                                form.resetFields();
                                message.info('Project Uploaded successfully');
                            })
                            .catch(err => {
                                setLoading(false);
                                message.error('Failed Uploading project');
                            })
                    })
                    .catch(err => {
                        setLoading(false);
                        message.error('Error Uploading file');
                    })
            })
            .catch(err => {
                setLoading(false);
                message.error('Error Uploading file');
            })
    };

    const props = {
        name: 'file',
        multiple: false,
        accept: allowedFileTypes,
        maxCount: 1,
        onChange(info: any) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log('File Info', info);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e: any) {
            console.log('Dropped files', e.dataTransfer.files);
        },
        beforeUpload(file: any) {
            const extension = file.name.split('.').pop()?.toLowerCase();
            const isAllowedExtension = extension ? allowedFileTypes.includes(`${extension}`) : false;

            if (!extension || !isAllowedExtension) {
                message.error(`Unsupported file type: ${file.name}`);
                return Upload.LIST_IGNORE;
            }

            const fileSizeMB = file.size / 1024 / 1024;
            const maxFileSizeMB = 10;

            if (fileSizeMB > maxFileSizeMB) {
                message.error(`File size exceeds the maximum limit of ${maxFileSizeMB}MB.`);
                return Upload.LIST_IGNORE;
            }
            return false;
        },
    };

    const validateTextArea = (rule: any, value: string, callback: Function) => {
        const wordCount = value.trim().split(/\s+/).length;
        console.log('ff',wordCount);
        if (wordCount < 10) {
            callback('Description must have at least 10 words.');
        } else {
            console.log(wordCount);
            // callback(); 
        }
    };

    return (
        <StyledDiv>
            <Form form={form} onFinish={onFinish} layout='horizontal' labelAlign='left' labelCol={{ span: 12 }}
                wrapperCol={{ span: 16 }}>
                <Form.Item
                    label={<span style={{ color: 'white' }}>Project File</span>}
                    name="projectFile"
                    rules={[
                        { required: true, message: 'Project file is required' }
                    ]}
                >
                    <Dragger {...props} height={200}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text" style={{ color: 'white' }}>Click or Drag here to upload</p>
                        <p className="ant-upload-hint" style={{ color: 'white' }}>
                            Allowed file types .pdf .mp4, .jpeg, .png, .jpg, .mov, .avi
                        </p>
                    </Dragger>
                </Form.Item>
                <Form.Item
                    label={<span style={{ color: 'white' }}>Project Name:</span>}
                    name="name"
                    rules={[
                        { required: true, message: 'Project name is required' }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={<span style={{ color: 'white' }}>Project Description:</span>}
                    name="description"
                    rules={[
                        { required: true, message: 'Project description is required' },
                        // { validator: validateTextArea }
                    ]}
                >
                    <Input.TextArea />
                </Form.Item>
                <Form.Item
                    label={<span style={{ color: 'white' }}>Abstract File:</span>}
                    name="abstractFile"
                    rules={[
                        { required: true, message: 'Abstract file is required' }
                    ]}
                >
                    <Dragger {...props} height={200}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text" style={{ color: 'white' }}>Click or Drag here to upload</p>
                        <p className="ant-upload-hint" style={{ color: 'white' }}>
                            Allowed file types .pdf
                        </p>
                    </Dragger>
                </Form.Item>
                <Form.Item>
                    <Button ghost style={{ width: '450px', marginTop: '10px' }} htmlType='submit' loading={loading}>
                        Upload
                    </Button>
                </Form.Item>
            </Form>
        </StyledDiv >
    );
};
