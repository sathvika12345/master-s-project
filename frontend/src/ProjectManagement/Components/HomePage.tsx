import projectImage from "../assets/images/logo.png";
import likeImage from "../assets/svgs/like.svg";
import starImage from "../assets/svgs/star.svg";
import commentImage from "../assets/svgs/comment.svg";
import { Row, Col, Card, Typography, Modal, Image ,message } from "antd";
import { useHttpClient } from "../hooks/useHttpClient";
import { useContext, useEffect, useState } from "react";
import moment from 'moment';
import { DataProps, Project, ProjectStatus } from "../utils";
import { ProjectView } from "./ProjectView";
import { UserNavbar } from "./UserNavbar";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/authContext";
const { Meta } = Card;

const StyledTable = styled.div`
  height: 100vh;
`;

const ContentWrapper = styled.div`
  padding: 40px;
`;

const HomePage: React.FC = () => {
  const [view, setView] = useState(false);
  const [like, setLike] = useState(false);
  const [projects, setProjects] = useState<Project[]>();
  const [activeProject, setActiveProject] = useState<Project>();
  const { fetchProjects, likeProject,rateProject, commentProject } = useHttpClient();
  const { isAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate();
//   const userId = 1; //just for example;

  const role = localStorage.getItem("userRole");
  const userId= localStorage.getItem("userId");

  const handleCancel = () => {
    if (like) {
      likeProject(activeProject?.projectId, userId)
        .then((res) => {
          console.log("Liked the project",res);
        })
        .catch((err) => {
          console.log("Here comes the error in liking");
          message.error(err.response.data.error);
        });
    }
    setView(false);
  };

  const likeHandler = () => {
    setLike(!like);
  };

  const rateHandler = (rate:number) => {
    // /project/like/:projectId/:userId
    rateProject(activeProject?.projectId, userId,rate)
      .then((res) => {
        console.log("Rating the project");
        setLike(!like)
      })
      .catch((err) => {
        console.log("Liked the project");
      });
  }

  const commentHandler = (comment: DataProps[]) => {
    if (comment.length == 0 || Object.keys(comment[0]).length === 0) return;
    commentProject(activeProject?.projectId, comment)
      .then((res) => {
        console.log("Commented Successfully");
      })
      .catch((err) => {
        console.log("Commented Failed");
      });
  };

  const handleActiveProject = (project: Project) => {
    setActiveProject(project);
    setView(true);
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    fetchProjects()
      .then((res) => {
        const projects = res?.data;
        setProjects(projects);
      })
      .catch((err) => {
        console.log("Error fetching projects");
      });
  }, []);

  return (
    <StyledTable style={{ backgroundColor: isAuthenticated ? 'white' : 'black' }}>
      <ContentWrapper>
        <UserNavbar />
        <div style={{ overflowX: "hidden", paddingTop: "40px" }}>
          <Row gutter={[16, 16]}>
            {projects
              ?.filter((project: Project) => {
                // Check if userRole is "student" and userId matches
                if (
                  localStorage.getItem("userRole") == "student"
                ) {
                  return project.status === ProjectStatus.APPROVED && project.userId == localStorage.getItem("userId");
                }
                // If userRole is not "student", fetch all projects with APPROVED status
                return project.status === ProjectStatus.APPROVED;
              })
              .map((project: Project, index) => (
                <Col
                  span={6}
                  xs={20}
                  sm={12}
                  md={8}
                  lg={5}
                  xl={6}
                  onClick={() => setActiveProject(project)}
                  key={index}
                >
                  <Card
                    hoverable
                    title={
                      <span
                        style={{
                          color: "white",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {project.projectName}
                      </span>
                    }
                    onClick={() => handleActiveProject(project)}
                    style={{
                      backgroundColor: "rgb(70, 22, 107)",
                      border: "2px solid rgb(47,48,50)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        color: "#FFFFFF",
                        borderRadius: "8px",
                        padding: "3px 5px",
                        fontSize: "11px",
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center" }}>
                        {/* Accept Svg Start */}
                        <svg
                          width="25"
                          height="24"
                          viewBox="0 0 25 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M17.5 9L10.5 16L7.49994 13"
                            stroke="#FFFFFF"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M12.5 21C17.4706 21 21.5 16.9706 21.5 12C21.5 7.02944 17.4706 3 12.5 3C7.52944 3 3.5 7.02944 3.5 12C3.5 16.9706 7.52944 21 12.5 21Z"
                            stroke="#FFFFFF"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                        {/* Accept Svg end */}
                        &nbsp; Approved
                      </span>
                      <span style={{ display: "flex", alignItems: "center" }}>
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clip-path="url(#clip0_6_2)">
                            <path
                              d="M8 3.5C8 3.36739 7.94732 3.24021 7.85355 3.14645C7.75979 3.05268 7.63261 3 7.5 3C7.36739 3 7.24021 3.05268 7.14645 3.14645C7.05268 3.24021 7 3.36739 7 3.5V9C7.00003 9.08813 7.02335 9.17469 7.06761 9.25091C7.11186 9.32712 7.17547 9.39029 7.252 9.434L10.752 11.434C10.8669 11.4961 11.0014 11.5108 11.127 11.4749C11.2525 11.4391 11.3591 11.3556 11.4238 11.2422C11.4886 11.1288 11.5065 10.9946 11.4736 10.8683C11.4408 10.7419 11.3598 10.6334 11.248 10.566L8 8.71V3.5Z"
                              fill="white"
                            />
                            <path
                              d="M8 16C10.1217 16 12.1566 15.1571 13.6569 13.6569C15.1571 12.1566 16 10.1217 16 8C16 5.87827 15.1571 3.84344 13.6569 2.34315C12.1566 0.842855 10.1217 0 8 0C5.87827 0 3.84344 0.842855 2.34315 2.34315C0.842855 3.84344 0 5.87827 0 8C0 10.1217 0.842855 12.1566 2.34315 13.6569C3.84344 15.1571 5.87827 16 8 16ZM15 8C15 9.85652 14.2625 11.637 12.9497 12.9497C11.637 14.2625 9.85652 15 8 15C6.14348 15 4.36301 14.2625 3.05025 12.9497C1.7375 11.637 1 9.85652 1 8C1 6.14348 1.7375 4.36301 3.05025 3.05025C4.36301 1.7375 6.14348 1 8 1C9.85652 1 11.637 1.7375 12.9497 3.05025C14.2625 4.36301 15 6.14348 15 8Z"
                              fill="white"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_6_2">
                              <rect width="16" height="16" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                        &nbsp;&nbsp;
                        {moment(project.createdAt).format('DD MMM YYYY')}
                      </span>
                    </div>
                    <Meta
                      title={``}
                      description={
                        <span
                          style={{
                            color: "white",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {moment(project.createdAt).format('DD MMM YYYY')}
                        </span>
                      }
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        marginTop: "10px",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: "20px",
                      }}
                    >
                      <Image
                        preview={false}
                        src={projectImage}
                        style={{
                          width: "40px",
                          height: "40px",
                          marginLeft: "15px",
                          cursor: "pointer",
                        }}
                      />
                      <div style={{ display: "flex" }}>
                        <Typography
                          style={{ marginRight: "10px", color: "white" }}
                        >
                          <Image
                            src={starImage}
                            width={30}
                            height={30}
                            preview={false}
                          />
                          &nbsp;&nbsp;
                          {!like ? project?.likeCount : (project?.likeCount || 0) + 1}
                        </Typography>
                        <Typography style={{ color: "white" }}>
                          <Image
                            src={commentImage}
                            width={30}
                            height={30}
                            preview={false}
                          />
                          &nbsp;&nbsp;
                          {project.Comments?.length}
                        </Typography>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
          </Row>
        </div>
      </ContentWrapper>
      <Modal
        title=""
        open={view}
        onCancel={handleCancel}
        footer={false}
        width="80%"
        style={{ maxHeight: "80vh" }}
      >
        <ProjectView
          projectId={activeProject?.projectId}
          project={activeProject}
          commentHandler={commentHandler}
          like={like}
          likeHandler={likeHandler}
          rateHandler={rateHandler}
          userId={Number(userId)}
          viewLike={userId===activeProject?.userId}
        />
      </Modal>
    </StyledTable>
  );
};

export default HomePage;
