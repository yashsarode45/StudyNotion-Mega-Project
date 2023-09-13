import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { getFullDetailsOfCourse } from '../services/operations/courseDetailsAPI';
import { setCompletedLectures, setCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from '../slices/viewCourseSlice';
import VideoDetailsSidebar from '../components/core/ViewCourse/VideoDetailsSidebar';
import CourseReviewModal from '../components/core/ViewCourse/CourseReviewModal';

const ViewCourse = () => {
    const [reviewModal, setReviewModal] = useState(false)
    const {courseId} = useParams();
    const {token} = useSelector((state)=> state.auth);
    const dispatch = useDispatch();
    const location = useLocation()
    const {courseSectionData, courseEntireData, completedLectures} = useSelector((state)=>state.viewCourse);

    // useEffect(() => {
    //     dispatch(setCourseSectionData([]));
        
    //     dispatch(setEntireCourseData([]));
        
    //     dispatch(setCompletedLectures(0))
        
    // }, [])
    

    useEffect(() => {
    const setCourseSpecificDetails = async () => {
        // console.log("In video details page", courseId)
        const courseData = await getFullDetailsOfCourse(courseId, token);
        dispatch(setCourseSectionData(courseData.courseDetails.courseContent));
        
        dispatch(setEntireCourseData(courseData.courseDetails));
        
        dispatch(setCompletedLectures(courseData.completedVideos));
        
        let lectures = 0;
        courseData.courseDetails.courseContent.forEach((sec) => {
            lectures += sec.subSection.length
        } )
        dispatch(setTotalNoOfLectures(lectures))
    }
    
    setCourseSpecificDetails()
    },[courseId])
    
  return (
    <>
        <div className="relative flex min-h-[calc(100vh-3.5rem)]">
            <VideoDetailsSidebar setReviewModal={setReviewModal} />
            <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
                <div className="mx-6">
                <Outlet />
                </div>
            </div>
            {reviewModal && (<CourseReviewModal setReviewModal={setReviewModal} />)}
        </div>
        
    </>
  )
}

export default ViewCourse