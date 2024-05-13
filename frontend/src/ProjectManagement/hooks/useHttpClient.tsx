import httpClient from "../httpClient";
import { BASE_URLS, DataProps, Project, User } from "../utils";
export const useHttpClient = () => {

    const options = {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': localStorage.getItem("token") || ""
        }
    }

    const headers = {
        headers: {
            'Authorization': localStorage.getItem("token") || ""
        }
    }

    return {
        getProject: (url: string) => {
            return httpClient.get(`${BASE_URLS.EXPRESS_URL}/${url}`, headers)
        },
        fetchFileFromS3: (fileName: string) => {
            return httpClient.get(`${BASE_URLS.EXPRESS_URL}/download/${fileName}`, headers)
        },
        fetchProjectsByUserId: (userId: string) => {
            return httpClient.get(`${BASE_URLS.EXPRESS_URL}/projects/${userId}`, headers)
        },
        fetchProjects: () => {
            return httpClient.get(`${BASE_URLS.EXPRESS_URL}/projects`, headers)
        },
        fetchApprovedProjects: () => {
            return httpClient.get(`${BASE_URLS.EXPRESS_URL}/approved_projects`, headers)
        }, //newly Added Endpoint to Get Approved Projects
        fetchProjectById: (projectId: number | undefined, userId: number | undefined) => {
            return httpClient.get(`${BASE_URLS.EXPRESS_URL}/project/${projectId}/${userId}`, headers)
        },
        updateProject: (projectId: number | undefined) => {
            return httpClient.put(`${BASE_URLS.EXPRESS_URL}/project/${projectId}`, headers)
        }, //newly Added to Update Project

        acceptProject: (projectId: number | undefined,remark:string) => {
            const body = {
                status: "APPROVED",
                remark:remark
            }
            return httpClient.patch(`${BASE_URLS.EXPRESS_URL}/project/${projectId}`, body, headers)
        }, //updated Change Old Method
        rejectProject: (projectId: number | undefined,remark:string) => {
            const body = {
                status: "REJECTED",
                remark:remark
            }
            return httpClient.patch(`${BASE_URLS.EXPRESS_URL}/project/${projectId}`, body, headers)
        }, //updated Chnage Old Method

        allowReviewer: (reviewerId: number) => {
            const body = {
                active:true
            }
            return httpClient.patch(`${BASE_URLS.EXPRESS_URL}/reviewer/${reviewerId}`, body, headers)
        }, //updated Change Old Method

        rejectReviewer: (reviewerId: number | undefined) => {
            const body = {
                active:false
            }
            return httpClient.patch(`${BASE_URLS.EXPRESS_URL}/reviewer/${reviewerId}`, body, headers)
        }, //updated Chnage Old Method
        uploadProject: (project: Project) => {
            return httpClient.post(`${BASE_URLS.EXPRESS_URL}/project`, project, headers)
        },
        searchProject: (req:any) => {
            return httpClient.post(`${BASE_URLS.EXPRESS_URL}/search_project`, req, headers)
        },  //newly added Endpoint to Search project

        deleteProject: (projectId: number | undefined) => {
            return httpClient.delete(`${BASE_URLS.EXPRESS_URL}/project/${projectId}`, headers)
        },
        uploadFile: (file: FormData) => {
            return httpClient.post(`${BASE_URLS.EXPRESS_URL}/file/upload`, file, options)
        },
        deleteFile: (fileName: string) => {
            return httpClient.delete(`${BASE_URLS.EXPRESS_URL}/file/delete/${fileName}`, headers)
        },
        downloadFile: (fileName?: string) => {
            return httpClient.get(`${BASE_URLS.EXPRESS_URL}/file/download/${fileName}`, headers)
        },
        login: (req: any) => {
            return httpClient.post(`${BASE_URLS.EXPRESS_URL}/login`, req, headers);
        }, //Updated (Change Old Method use email as Username)
        signup: (req: any) => {
            return httpClient.post(`${BASE_URLS.EXPRESS_URL}/user`, req, headers);
        },
        getUser: (userId: string) => {
            return httpClient.get(`${BASE_URLS.EXPRESS_URL}/user/${userId}`, headers)
        }, //userID is rollNo. Here (Updated)
        getAllUser: () => {
            return httpClient.get(`${BASE_URLS.EXPRESS_URL}/users/`, headers)
        }, // newly added to frontend to get all users

        getReviewers: () => {
            return httpClient.get(`${BASE_URLS.EXPRESS_URL}/reviewers/`, headers)
        }, // newly added Endpoints to get All Reviewers

        updateReviewerPermission: (userId: number,req:any) => {
            return httpClient.patch(`${BASE_URLS.EXPRESS_URL}/reviewer/${userId}`, req, headers)
        }, // newly added Endpoint to Update Reviewer login Permission

        updateUser: (rollNo: string | undefined, req: any) => {
            return httpClient.patch(`${BASE_URLS.EXPRESS_URL}/user/${rollNo}`, req, headers)
        },

        updateUserProfile: (userId: number | undefined, req: any) => {
            return httpClient.patch(`${BASE_URLS.EXPRESS_URL}/user_profile/${userId}`, req, headers)
        }, //newely added endpoint to update userProfile including DP

        deleteUser: (rollNo: string | undefined) => {
            return httpClient.delete(`${BASE_URLS.EXPRESS_URL}/user/${rollNo}`, headers)
        }, //newly added to fronted

        likeProject: (projectId: number | undefined,userId:any | undefined) => {
            return httpClient.patch(`${BASE_URLS.EXPRESS_URL}/project/like/${projectId}/${userId}`, null, headers)
        },
        rateProject: (projectId: number | undefined,userId:any | undefined, rating:any | undefined) => {
            return httpClient.patch(`${BASE_URLS.EXPRESS_URL}/project/rate/${projectId}/${userId}/${rating}`, null, headers)
        },
        commentProject: (projectId: number | undefined,  req: any) => {
            console.log(req);
            return httpClient.post(`${BASE_URLS.EXPRESS_URL}/project/comment/${projectId}`, req, headers)
        }, //updated Change Old Method

        deleteComment: (commentId: number | undefined) => {
            return httpClient.delete(`${BASE_URLS.EXPRESS_URL}/comment/${commentId}`, headers)
        }, //newly added Endpoint to delete comment
        resetPassword: (req: any) => {
            return httpClient.post(`${BASE_URLS.EXPRESS_URL}/resetPassword/`, req,headers);
        }, //newly added Endpoint to reset password
        otpVerify: (req: any) => {
            return httpClient.post(`${BASE_URLS.EXPRESS_URL}/otpVerify/`, req,headers);
        }, //newly added Endpoint to reset password
    }; 
};
