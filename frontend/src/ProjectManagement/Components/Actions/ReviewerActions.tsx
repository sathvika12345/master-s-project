import React,{useState} from 'react';
import styled from '@emotion/styled'
import { Project } from '../../utils';
import { Button, Form, Input, Typography, message } from 'antd';

const StyledDiv = styled.div`
    display:flex;
`
interface ReviewerActionProps {
    project: Project
    viewhandler: (project: Project) => void
    acceptHandler: (projectId: number | undefined,remark:any) => void
    rejectHandler: (projectId: number | undefined,remark:any) => void
}

export const ReviewerActions = ({ project, acceptHandler, rejectHandler, viewhandler,}: ReviewerActionProps) => {

    const [remark,setRemark]=useState('');

    const remarkChangeHandler=(e:any)=>{
        setRemark(e.target.value);
    }

    return (
        <StyledDiv style={{display:'flex', flexDirection:'column',justifyContent:'center'}}>
            {/* View Svg Start */}
            <div>
            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                style={{ marginRight: 10, cursor: 'pointer' }} onClick={() => {
                console.log('View Project')
                viewhandler(project);
                }}
            >
                <path d="M12.5 5C6.13636 5 2.5 12 2.5 12C2.5 12 6.13636 19 12.5 19C18.8636 19 22.5 12 22.5 12C22.5 12 18.8636 5 12.5 5Z" stroke="#777A83" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M12.5 15C14.1569 15 15.5 13.6569 15.5 12C15.5 10.3431 14.1569 9 12.5 9C10.8431 9 9.5 10.3431 9.5 12C9.5 13.6569 10.8431 15 12.5 15Z" stroke="#777A83" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            {/* View Svg end */}
            {/* Accept Svg Start */}
            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                style={{ marginLeft: 10, cursor: 'pointer' }} onClick={() => {
                    console.log('Approve Project');
                    acceptHandler(project.projectId,remark);
                    setRemark("");
                }}
            >
                <path d="M17.5 9L10.5 16L7.49994 13" stroke="#777A83" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M12.5 21C17.4706 21 21.5 16.9706 21.5 12C21.5 7.02944 17.4706 3 12.5 3C7.52944 3 3.5 7.02944 3.5 12C3.5 16.9706 7.52944 21 12.5 21Z" stroke="#777A83" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            {/* Accept Svg end */}
            {/* Reject Svg Start */}
            <svg width="25" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
                style={{ marginLeft: 10, cursor: 'pointer' }} onClick={() => {
                console.log('Reject Project')
                rejectHandler(project.projectId,remark);
                setRemark("");
                }}
            >
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12.4711 3.52876C12.7314 3.78911 12.7314 4.21122 12.4711 4.47157L4.47108 12.4716C4.21073 12.7319 3.78862 12.7319 3.52827 12.4716C3.26792 12.2112 3.26792 11.7891 3.52827 11.5288L11.5283 3.52876C11.7886 3.26841 12.2107 3.26841 12.4711 3.52876Z" fill="#777A83" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M3.52827 3.52876C3.78862 3.26841 4.21073 3.26841 4.47108 3.52876L12.4711 11.5288C12.7314 11.7891 12.7314 12.2112 12.4711 12.4716C12.2107 12.7319 11.7886 12.7319 11.5283 12.4716L3.52827 4.47157C3.26792 4.21122 3.26792 3.78911 3.52827 3.52876Z" fill="#777A83" />
            </svg>

            <div style={{width:'100%',marginTop:"1rem"}}>
            <Input value={remark} onChange={remarkChangeHandler} className="white-placeholder" placeholder='Enter your Remark (Optional)' style={{background:'',color:'',}} />
            </div>

            </div>
            {/* Reject Svg end */}
        </StyledDiv>
    )
}