import { CommentSection } from "react-comments-section"
import 'react-comments-section/dist/index.css'
import Image from '../assets/images/project-2.png'
import { BASE_URLS, DataProps, Project } from "../utils"
import { AuthContext } from "../Context/authContext"
import { useContext, useEffect, useState } from "react"
import { useHttpClient } from "../hooks/useHttpClient"
import { useRef } from 'react';


interface commentDataProps {
    projectId?: number
    commentHandler: (data: DataProps[]) => void,
}

export const Comments = ({ projectId }: commentDataProps) => {
    const loginLink = `${BASE_URLS.EXPRESS_URL}/login`
    const signupLink = `${BASE_URLS.EXPRESS_URL}/signup`
    const { userData } = useContext(AuthContext);
    const { fetchProjectById } = useHttpClient();
    const [project, setProject] = useState<Project>();
    const [commentsTemp, setCommentsTemp] = useState<DataProps[]>([]);
    const { commentProject } = useHttpClient();
    const initialCommentsTempRef = useRef(commentsTemp);


    useEffect(() => {
        initialCommentsTempRef.current = commentsTemp;
        console.log('hey',initialCommentsTempRef);
    }, [commentsTemp, projectId]);

    useEffect(() => {
        fetchProjectById(projectId,Number(userData?.userId))
        .then(res => {
            const project = res?.data;
            setProject(project);
            if (project && project.Comments) {
                let newArray = project.Comments.map(function(item :any) { 
                    item.avatarUrl = item.User.displayPictureUrl || "/static/media/project-2.e866c7be7d027d23265c.png"; // Use the user's profile picture URL if available, else use the default image
                    item.comId = "";
                    item.fullName = item.User.name;
                    item.text= item.content;
                    item.userProfile = null; 
                    item.replies = [];
                    item.userId = item.User.userId;
                    delete item.User; 
                    return item;
                });
                // Map the elements of project.Comments to Comment type
                setCommentsTemp(newArray);
            } else {
                // Handle case when project or project.Comments is null or undefined
                setCommentsTemp([]);
            }
        })
        .catch(err => {
            console.log("Error getting project");
        });
    }, [projectId]);


    return (
        <CommentSection
            titleStyle={{
                color: "white"
            }}
            overlayStyle={{
                color: "white",
                maxHeight: "400px",
            }}
            removeEmoji={true}
            replyInputStyle={{
                color: "white",
            }}
            cancelBtnStyle={{
                padding: "10px 10px"
            }}
            submitBtnStyle={{
                padding: "10px 10px"
            }}
            replyTop={false}
            customImg={Image}

        currentUser={{
            currentUserFullName: userData.username,
            currentUserId: userData.userId,
            currentUserImg: Image,
            currentUserProfile: ''
        }}
        logIn={{
            loginLink: loginLink,
            signupLink: signupLink
        }}
            commentData={commentsTemp}
        onSubmitAction={(data: DataProps) => {
                commentsTemp?.push(data);
                commentProject(projectId, data)
                .then(res => {
                    console.log(res);
                    console.log('Update coments');
                })
                .catch(err => {
                    console.log(err)
                });
            }
            }
            onReplyAction={(data: any) => {
                const commentIndex = commentsTemp?.findIndex(
                    (comment) => comment.comId === data.repliedToCommentId
                );
                if (commentIndex && commentIndex != -1) {
                    commentsTemp[commentIndex].replies.push(data);
                }
            }}

            onDeleteAction={(data: any) => {
                const { comIdToDelete, parentOfDeleteId } = data;

                if (parentOfDeleteId === undefined) {
                    const updatedComments = commentsTemp.filter(comment => comment.comId !== comIdToDelete);
                    setCommentsTemp(updatedComments);
                } else {
                    const updatedComments = [...commentsTemp];
                    const parentCommentIndex = updatedComments.findIndex(comment => comment.comId === parentOfDeleteId);

                    if (parentCommentIndex !== -1) {
                        const parentComment = updatedComments[parentCommentIndex];
                        const replyIndexToDelete = parentComment.replies.findIndex((reply: { comId: any }) => reply.comId === comIdToDelete);
                        if (replyIndexToDelete !== -1) {
                            parentComment.replies.splice(replyIndexToDelete, 1);
                            setCommentsTemp(updatedComments);
                        } else {
                            console.warn(`Reply with comId ${comIdToDelete} not found in replies array.`);
                        }
                    }
                }
            }}
    />
    )
}