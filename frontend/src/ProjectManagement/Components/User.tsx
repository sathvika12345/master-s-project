import React, { useContext, useEffect, useState } from 'react';
import { Modal, Table, message,Input } from 'antd';
import type { TableProps} from 'antd';
import { DataProps, Project, ProjectStatus } from '../utils';
import moment from 'moment';
import styled from '@emotion/styled';
import { UserActions } from './Actions/UserActions';
import { useHttpClient } from '../hooks/useHttpClient';
import { ProjectView } from './ProjectView';
import { AuthContext } from '../Context/authContext';
import { UserNavbar } from './UserNavbar';
import '../styles/styles.css'
import { useNavigate } from 'react-router-dom';
import { ProjectUpload } from './ProjectUpload';
import { SearchOutlined } from '@ant-design/icons';
const capitalize = require('capitalize');

const StyledTable = styled.div`
    background-color:'white';
    height: 100vh;
`

const ContentWrapper = styled.div`
    padding: 40px; 
`
const Reviewer: React.FC = () => {
    const [reload, setReload] = useState(false);
    const [like, setLike] = useState(false);
    const [view, setView] = useState(false);
    const [abstractView, setAbstractView] = useState(false);
    const [projects, setprojects] = useState<Project[] | []>();
    const [activeProject, setActiveProject] = useState<Project>();
    const { userData } = useContext(AuthContext);
    const navigate = useNavigate();
    const { likeProject,rateProject, commentProject, fetchProjectsByUserId,fetchProjects, deleteProject,getProject } = useHttpClient();
    const role = localStorage.getItem("userRole");

    // const userId=1 //just for example

    const userId= localStorage.getItem("userId");

    const deleteHandler = (projectId: number | undefined) => {
        deleteProject(projectId)
            .then(res => {
                setReload(!reload);
                message.info(`Project ${projectId} deleted successfully`)
            })
            .catch(err => {
                console.log('Failed to delete project')
            })
    }

    const viewHandler = (project: Project) => {
        setView(true);
        setActiveProject(project);
    }

    const commentHandler = (comment: DataProps[]) => {
        if (comment.length == 0 || Object.keys(comment[0]).length === 0)
            return;
        commentProject(activeProject?.projectId, comment)
            .then(res => {
                console.log('Commented Successfully');
            })
            .catch(err => {
                console.log('Commented Failed');
            })
    }

    const likeHandler = () => {
        // /project/like/:projectId/:userId
        likeProject(activeProject?.projectId, userId)
          .then((res) => {
            console.log("Liked the project");
            setLike(!like)
          })
          .catch((err) => {
            console.log("Liked the project");
          });
    }

    const rateHandler = (rate:number) => {
        // /project/like/:projectId/:userId
        rateProject(activeProject?.projectId, userId, rate)
          .then((res) => {
            console.log("Rating the project");
          })
          .catch((err) => {
            console.log("Liked the project");
          });
    }

    const columns: TableProps<Project>['columns'] = [
        {
            title: 'Project Name',
            dataIndex: 'projectName',
            key: 'projectName',
            ellipsis: true
        },
        {
            title: 'Submitted By',
            dataIndex: 'submittedBy',
            key: 'submittedBy',
            ellipsis: true
        },
        {
            title: 'Date Of Submission',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: Date) => moment(date).format('DD MMM YYYY'),
            ellipsis: true
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: ProjectStatus) => (
                <span
                    style={{
                        backgroundColor:
                            status === ProjectStatus.PENDING ? 'rgb(231,111,58)' :
                                status === ProjectStatus.APPROVED ? 'rgb(59,104,233)' :
                                    '#D62828'
                        , borderRadius: '8px',
                        color: '#FFFFFF',
                        padding: '4px 8px',
                        width: '75px',
                        fontWeight: 'bold'
                    }}
                >
                    {capitalize(status)}
                </span >
            ),
        },
        {
            title: 'Remark',
            dataIndex: 'remark',
            key: 'remark',
            ellipsis: true
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (_, project: Project) => {
                return <UserActions deleteHandler={(projectId) => deleteHandler(projectId)} viewHandler={viewHandler} project={project} />
            }
        },
    ];

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

    const handleAbstract = () => {
        setAbstractView(false);
    }

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
            return;
        }
        const userId = localStorage.getItem("userId") || userData?.userId;
        if(role=="student"){
            fetchProjectsByUserId(userId)
            .then(res => {
                const projects = res?.data;
                setprojects(projects);
            })
            .catch(err => {
                console.log('Error Fetching Projects');
            })
        }else {
            fetchProjects()
            .then(res => {
                const projects = res?.data;
                setprojects(projects);
            })
            .catch(err => {
                console.log('Error Fetching Projects');
            })
        }
    }, [reload])

    const searchProject=(e:string)=>{
        console.log('e',e);
        if(e.length>3){
            getProject(`search_project?query=${e}`)
            .then(res => {
                console.log('res',res)
                const projects = res?.data;
                setprojects(projects);
            })
            .catch(err => {
                console.log('Error Fetching Projects');
            })
        }
        if(e==="" || !e){
            setReload(!reload)
        }
    }

    return (
        <StyledTable>
            <ContentWrapper>
            <UserNavbar />
            <div className='search-box'>
            <Input
                  placeholder='Search project'
                  onChange={(e) => searchProject(e.target.value)}
                  style={{ width: '500px' }} // Increase the width of the input
                  prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} // Add the magnifying glass icon
                    />
            </div>
            <Table columns={columns}
                dataSource={projects}
                pagination={false}
                rowClassName='row-style'
                />
            </ContentWrapper>
            User Id {userId} activeProject {activeProject?.userId}
            <Modal
                title=""
                open={view}
                onCancel={handleCancel}
                footer={false}
                width='80vw'
                style={{ maxHeight: '80vh', color: '#FFFFFF' }}
            >
                <ProjectView
                    projectId={activeProject?.projectId}
                    commentHandler={(comment: DataProps[]) => commentHandler(comment)}
                    like={like}
                    likeHandler={likeHandler} 
                    rateHandler={rateHandler}
                    userId={Number(userId)}
                    viewLike={userId==activeProject?.userId}
                    />
            </Modal>
            <Modal
                title=""
                open={abstractView}
                onCancel={handleAbstract}
                footer={false}
                style={{ maxHeight: '50vh', color: '#FFFFFF' }}
                width={500}
            >
                <ProjectUpload />
            </Modal>
        </StyledTable>
    )
}

export default Reviewer;
