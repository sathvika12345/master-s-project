export interface Project {
  projectId?: number;
  projectName: string;
  projectDescription: string;
  projectAssetUrl: string;
  abstractUrl: string;
  dateOfSubmission: string;
  submittedBy: string;
  status?: string;
  userId: any;
  likeCount?: number;
  rating?: number;
  rateCount?: number;
  likes?:number;
  comments?: DataProps[];
  Comments?:any;
  createdAt:any;
}

export interface User {
  firstname:string;
  lastname:string;
  name: string;
  email: string;
  password: string;
  rollNo: string;
  role?: string;
}

export interface Reviewer {
  userId:number;
  name:string;
  active:boolean;
}

export interface DataProps {
  userId: string;
  comId: string;
  avatarUrl: string;
  userProfile?: string;
  fullName: string;
  text: string;
  replies: any;
  commentId: string;
}

export enum ProjectStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum ReviewerStatus {
  APPROVED="APPROVED",
  PENDING="PENDING"
}

export enum UserRole {
  REVIEWER = "reviewer",
  STUDENT = "student",
  ADMIN="admin"
}

export interface getUserProps {
  displayPictureUrl : any;
  name:any;
}

export const NETWORK_CALL_TIMEOUT = 5 * 60 * 1000;

export const BASE_URLS = {
  EXPRESS_URL: process.env.REACT_APP_EXPRESS_URL,
};