import React,{useState,useEffect} from 'react';
import   { Modal, Table, message } from 'antd';
import type { TableProps } from 'antd';
import { DataProps, Project, ProjectStatus,Reviewer,ReviewerStatus } from '../utils';
import moment from 'moment';
import styled from '@emotion/styled';
import { ReviewerActions } from './Actions/ReviewerActions';
import { AdminActions } from './Actions/AdminActions';
import { useHttpClient } from '../hooks/useHttpClient';
import { ProjectView } from './ProjectView';
import { UserNavbar } from './UserNavbar';
import { ProjectUpload } from './ProjectUpload';
import '../styles/styles.css'
import { useNavigate } from 'react-router-dom';
const capitalize = require('capitalize');

const StyledTable = styled.div`
    background-color: rgb(8,9,12);
    height: 100%;
`
const ContentWrapper = styled.div`
    padding: 40px; 
`

const AllowReviewer = () => {
    const [reload, setReload] = useState(false);
    const [like, setLike] = useState(false);
    const [view, setView] = useState(false);
    const [reviewers, setReviewers] = useState<Reviewer[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [activeProject, setActiveProject] = useState<Project>();
    const navigate = useNavigate();
    const { likeProject, commentProject,getReviewers,allowReviewer,rejectReviewer } = useHttpClient();

    // const [remark,setRemark]=useState('');

    // const remark="Just a remark for example";

    // const userId=1 //just for example

    const userId= localStorage.getItem("userId");

    const acceptHandler = (reviewerId: any) => {
        allowReviewer(reviewerId)
            .then(res => {
                setReload(!reload);
                message.info(`Reviewer ${reviewerId} accepted successfully`);
            })
            .catch(err => {
                console.log('Failed to accept the project', reviewerId);
            })
    }


    const rejectHandler = (reviewerId: any) => {
        rejectReviewer(reviewerId)
            .then(res => {
                setReload(!reload);
                message.info(`reviewer ${reviewerId} rejected successfully`);
            })
            .catch(err => {
                console.log('Failed to reject the reviewer', reviewerId);
            })
    }

    const handleCancel = () => {
        if (like) {
            likeProject(activeProject?.projectId,userId)
                .then(res => {
                    console.log('Liked the project');
                })
                .catch(err => {
                    console.log('Liked the project');
                })
        }
        setView(false);
    }


    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
            return;
        }
        getReviewers()
            .then(res => {
                let reviewers: Reviewer[] = res?.data;
                setReviewers(reviewers);
            })
            .catch(err => {
                console.log('Error fetching projects', err);
            })

    }, [reload]);



    const columns: TableProps<Reviewer>['columns'] = [
        {
            title: 'Reviewer Name',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
        },
        {
            title: 'Reviewer Email',
            dataIndex: 'email',
            key: 'email',
            ellipsis: true,
        },
        {
            title: 'Allowed',
            dataIndex: 'active',
            key: 'active',
            render: (status) => (
                <span
                    style={{
                        backgroundColor:
                            status===false ? 'rgb(231,111,58)' :
                                status===true ? 'rgb(59,104,233)' :
                                    '#D62828'
                        , borderRadius: '8px',
                        color: '#FFFFFF',
                        padding: '4px 8px',
                        width: '75px',
                        fontWeight: 'bold'
                    }}
                >
                    {status===true? "APPROVED":"PENDING"}
                </span >
            ),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (_, reviewer: Reviewer) => {
                return <AdminActions
                    reviewer={reviewer}
                    acceptHandler={(reviewerId) => acceptHandler(reviewerId)}
                    rejectHandler={(reviewerId) => rejectHandler(reviewerId)}
                />
            }
        },
    ];
  return (
    <div style={{background:'white', height:'100%'}}>AllowReviewer
            <StyledTable>
            <ContentWrapper>
                <Table columns={columns}
                    dataSource={reviewers}
                    pagination={false}
                    style={{ paddingTop: '40px' }}
                    rowClassName='row-style'
                />
            </ContentWrapper>
        </StyledTable>
    </div>
  )
}

export default AllowReviewer