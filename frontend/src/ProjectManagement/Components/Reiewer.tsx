import React, { useContext, useEffect, useState } from 'react';
import { Input, Modal, Table, message } from 'antd';
import type { TableProps } from 'antd';
import { DataProps, Project, ProjectStatus } from '../utils';
import moment from 'moment';
import styled from '@emotion/styled';
import { ReviewerActions } from './Actions/ReviewerActions';
import { useHttpClient } from '../hooks/useHttpClient';
import { ProjectView } from './ProjectView';
import { UserNavbar } from './UserNavbar';
import { ProjectUpload } from './ProjectUpload';
import '../styles/styles.css'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/authContext';
import { SearchOutlined } from '@ant-design/icons';

const StyledTable = styled.div`
    height: 100%;
`
const ContentWrapper = styled.div`
    padding: 40px; 
`

const Reviewer: React.FC = () => {
    const [reload, setReload] = useState(false);
    const [like, setLike] = useState(false);
    const [view, setView] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [activeProject, setActiveProject] = useState<Project>();
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const { fetchProjects, likeProject, rateProject, commentProject, acceptProject, rejectProject, } = useHttpClient();
    const { isAuthenticated } = useContext(AuthContext)

    // const [remark,setRemark]=useState('');

    // const remark="Just a remark for example";

    // const userId=1 //just for example

    const userId = localStorage.getItem("userId");

    const acceptHandler = (projectId: number | undefined, remark: any) => {
        acceptProject(projectId, remark)
            .then(res => {
                setReload(!reload);
                message.info(`Project ${projectId} accepted successfully`);
            })
            .catch(err => {
                console.log('Failed to accept the project', projectId);
            })
    }

    const likeHandler = () => {
        setLike(!like)
    }

    const rateHandler = (rate: number) => {
        // /project/like/:projectId/:userId
        rateProject(activeProject?.projectId, userId, rate)
            .then((res) => {
                console.log("Rating the project");
                setLike(!like)
            })
            .catch((err) => {
                console.log("Liked the project");
            });
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

    const rejectHandler = (projectId: number | undefined, remark: any) => {
        rejectProject(projectId, remark)
            .then(res => {
                setReload(!reload);
                message.info(`Project ${projectId} rejected successfully`);
            })
            .catch(err => {
                console.log('Failed to reject the project', projectId);
            })
    }

    const handleCancel = () => {
        if (like) {
            likeProject(activeProject?.projectId, userId)
                .then(res => {
                    console.log('Liked the project');
                })
                .catch(err => {
                    console.log('Liked the project');
                })
        }
        setView(false);
    }

    const viewhandler = (project: Project) => {
        setActiveProject(project);
        setView(true);
    }

    const columns: TableProps<Project>['columns'] = [
        {
            title: 'Project Name',
            dataIndex: 'projectName',
            key: 'projectName',
            ellipsis: true,
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
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (_, project: Project) => {
                return <ReviewerActions
                    project={project}
                    acceptHandler={(projectId, remark) => acceptHandler(projectId, remark)}
                    rejectHandler={(projectId, remark) => rejectHandler(projectId, remark)}
                    viewhandler={(project) => viewhandler(project)}
                />
            }
        },
    ];

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
            return;
        }
        fetchProjects()
            .then(res => {
                let projects: Project[] = res?.data;
                projects = projects.filter((project, _) => {
                    return project.status === ProjectStatus.PENDING;
                })
                setProjects(projects);
            })
            .catch(err => {
                console.log('Error fetching projects', err);
            })

    }, [reload])

    useEffect(() => {
        if (searchTerm.length > 1) {
            const filteredProjects = projects.filter((project) =>
                project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
            );
            console.log(projects, "projects")
            setProjects(filteredProjects);
        } else {
            // Fetch all projects if searchTerm is less than 3 characters
            fetchProjects()
                .then(res => {
                    let projects: Project[] = res?.data;
                    projects = projects.filter((project, _) => {
                        return project.status === ProjectStatus.PENDING;
                    })
                    setProjects(projects);
                })
                .catch(err => {
                    console.log('Error fetching projects', err);
                })
        }
    }, [reload, searchTerm]);

    const searchProject = (e: string) => {
        console.log('e', e);
        setSearchTerm(e);
    };

    return (
        <StyledTable style={{ backgroundColor: isAuthenticated ? 'white' : 'black' }}>
            <ContentWrapper>
                <UserNavbar />
                <div style={{ overflowX: "hidden", paddingTop: "15px", backgroundColor: "#fff", paddingBottom: "15px" }}>
                    <h3 >UAlbany showcase projects</h3>
                </div>
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
                    style={{ paddingTop: '40px' }}
                    rowClassName='row-style'
                />
            </ContentWrapper>
            <Modal
                title=""
                open={view}
                onCancel={handleCancel}
                footer={false}
                width={800}
                style={{ maxHeight: '80vh' }}
            >
                <ProjectView
                    projectId={activeProject?.projectId}
                    commentHandler={commentHandler}
                    like={like}
                    likeHandler={likeHandler}
                    rateHandler={rateHandler}
                    userId={Number(userId)}
                    viewLike={userId === activeProject?.userId}
                />
            </Modal>
            {/* <ProjectUpload /> */}
        </StyledTable>
    )
}

export default Reviewer;
