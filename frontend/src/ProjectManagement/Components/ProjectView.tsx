import React, { useContext } from 'react';
import { Avatar, Badge, Image, Typography, message, Input } from 'antd';
import { ReactComponent as Like } from '../assets/svgs/like.svg'
import { ReactComponent as Comment } from '../assets/svgs/comment.svg'
import { DataProps, Project, getUserProps } from '../utils';
import { Comments } from './Comments';
import '../styles/styles.css'
import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useHttpClient } from '../hooks/useHttpClient';
import { AuthContext } from '../Context/authContext';

interface ProjectProps {
    projectId?: number,
    project?: Project,
    like: boolean,
    likeHandler: () => void
    rateHandler: (rate: number) => void
    commentHandler: (data: DataProps[]) => void,
    viewLike: boolean,
    userId: number
}

const CommentsContainer = styled.div`
    overflow-y: auto;
`

export const ProjectView = ({ projectId, likeHandler, rateHandler, like, commentHandler, viewLike, userId }: ProjectProps) => {


    const { isAuthenticated } = useContext(AuthContext);

    const [showComments, setShowComments] = useState(false);
    const [userState, setUserState] = useState<getUserProps>();
    const [tempProject, setTempProject] = useState<Project>();
    const [rating, setRating] = useState<number>(0);
    const { fetchProjectById, downloadFile, getUser } = useHttpClient();

    useEffect(() => {
        fetchProjectById(projectId, userId)
            .then(res => {
                console.log('res?.data', res?.data)
                setTempProject(res?.data);
                setRating(res?.data?.rating ? res?.data?.rating : 0)
                if (res?.data.User) {
                    getUser(res?.data.User.userId).then(ress => {
                        setUserState(ress?.data);
                    }).catch(err => {
                        console.log(err);
                    });
                }
            })
            .catch(err => {
                console.log("Error fetching project");
            })
    }, [projectId])

    const handleLike = () => {
        if (!isAuthenticated) {
            message.error("You must be logged in to like the projects");
        }
        else {
            likeHandler();
        }
    }


    const getFileExtension = (filename: string | undefined) => {
        return filename?.split('.').pop()?.toLowerCase();
    };

    const fileExtension = getFileExtension(tempProject?.projectAssetUrl);

    const renderMedia = () => {
        if (!fileExtension) return null;

        if (fileExtension === 'mp4' || fileExtension === 'mov' || fileExtension === 'avi') {
            return (
                <video
                    width="600"
                    height="300"
                    controls
                    style={{ borderRadius: '5px' }}
                >
                    <source src={tempProject?.projectAssetUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            );
        } else if (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png') {
            return (
                <Image src={tempProject?.projectAssetUrl} height={200} width={200} style={{ borderRadius: '8px' }} />
            );
        } else if (fileExtension === 'pdf') {
            return (
                <iframe
                    src={tempProject?.projectAssetUrl}
                    width="600"
                    height="800"
                    style={{ border: 'none' }}
                    title="Project Asset"
                />
            );
        }
        else {
            return null;
        }
    };

    return (
        <div className='inner'
            style={{
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                height: '100%',
            }}>
            <div style={{
                width: '90%', borderRadius: '5px solid white', display: 'flex', flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
            }}>
                <div style={{ padding: '30px 0px' }}>
                    <Typography.Title style={{ color: '#FFFFFF' }}>
                        {tempProject?.projectName}
                    </Typography.Title>
                    {userState && (<Typography.Title style={{ color: '#FFFFFF', fontSize: "15px" }}>
                        Submitted By : <Avatar src={userState.displayPictureUrl} size={32} /> {userState.name}
                    </Typography.Title>)}
                    <a href={tempProject?.abstractUrl}>
                        Download Abstract File
                    </a>
                    <Typography.Paragraph style={{ color: 'rgb(183,183,184)', maxWidth: '600px' }}>
                        {tempProject?.projectDescription}
                    </Typography.Paragraph>
                </div>
                <div style={{ padding: '20px' }}>
                    {renderMedia()}
                </div>
                <Typography.Title style={{ color: '#FFFFFF', fontSize: '23px' }}>
                    Hope you like my project
                </Typography.Title>
                <Typography.Paragraph style={{ color: '#FFFFFF' }}>
                    Would like to hear in your words. Comment below...
                </Typography.Paragraph >
                <div style={{ gap: '1rem', display: 'flex', justifyContent: 'space-between', margin: '20px', alignItems: 'center' }}>
                    {/* {!viewLike ? 
                        <Badge count={!like ? tempProject?.likeCount : (tempProject?.likeCount || 0) + 1} color='#0080F0'>
                            <Avatar shape="square" size="large" icon={<Like />} onClick={handleLike} />
                        </Badge>
                        : null
                    } */}
                    <Badge count={tempProject?.Comments?.length} color='#0080F0'>
                        <Avatar shape="square" size="large" icon={<Comment onClick={() => {
                            if (!isAuthenticated) {
                                message.error("You must be logged in to comment on projects")
                            } else {
                                setShowComments(!showComments);
                            }
                        }} />} />
                    </Badge>
                    {!viewLike ?
                        <div>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span key={star}
                                    onClick={() => {
                                        setRating(star);
                                        rateHandler(star);
                                    }}
                                    style={{ cursor: 'pointer', color: star <= rating ? 'gold' : 'gray' }}
                                >
                                    ★
                                </span>
                            ))}
                            <span>
                                {tempProject?.rateCount}
                            </span>
                        </div>
                        : null
                    }
                </div>
            </div>
            <CommentsContainer>
                {showComments && <Comments commentHandler={commentHandler} projectId={tempProject?.projectId} />}
            </CommentsContainer>
        </div >
    );
};

