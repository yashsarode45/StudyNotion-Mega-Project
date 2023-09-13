const User = require('../models/User');
const Course = require('../models/Course')
const Section = require("../models/Section")
const SubSection = require("../models/SubSection")
const Category = require('../models/Category');
const {uploadImageToCloudinary} = require('../utils/imageUploader')
require('dotenv').config();
const CourseProgress = require("../models/CourseProgress")
const { convertSecondsToDuration } = require("../utils/secToDuration")

exports.createCourse = async (req,res) => {
    try {
        const{courseName, courseDescription, whatWillYouLearn, price, category,tags,status, instructions} = req.body;

        const thumbnail = req.files.thumbnailImage;
        console.log("Thumbnail in course creation is", thumbnail)
        if(!courseName || !courseDescription || !whatWillYouLearn || !price || !category || !thumbnail || !status || !instructions) {
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            });
        }

        const instructorId = req.user.id;

        const categoryDetails = await Category.findById(category);
        if(!categoryDetails) {
            return res.status(404).json({
                success:false,
                message:'Category Details not found',
            });
        }

        const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);

        const newCourse = await Course.create({
            courseName,
            description:courseDescription,
            whatWillYouLearn,
            price,
            thumbnail:thumbnailImage.secure_url,
            category,
            instructor:instructorId,
            tags,
            status,
            instructions
        })

        await Category.findByIdAndUpdate(category,
            {
                $push: {
                    course: newCourse._id
                }
            })

        await User.findByIdAndUpdate(instructorId, {
            $push: {
                courses: newCourse._id
            }})
            
        return res.status(200).json({
            success:true,
            message:'Course created successfully',
            newCourse
        })    
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Failed to create Course',
            error: error.message,
        })
    }
}

exports.showAllCourses = async (req,res) => {
    try {
        const allCourses = Course.find({}, {
            courseName: true,
            price: true,
            thumbnail: true,
            instructor: true,
            ratingAndReviews: true,
            studentsEnroled: true,
        }).populate("instructor").exec();

        return res.status(200).json({
            success:true,
            message:'Data for all courses fetched successfully',
            data:allCourses,
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Failed to show all Courses',
            error: error.message,
        })
    }
}

exports.getCourseDetails = async (req, res) => {
  try {
    //get id
    const {courseId} = req.body;
    //find course details
    const courseDetails = await Course.findById(courseId)
                                .populate(
                                    {
                                        path:"instructor",
                                        populate:{
                                            path:"additionalDetails",
                                        },
                                    }
                                )
                                .populate("category")
                                .populate("ratingAndReviews")
                                .populate({
                                    path:"courseContent",
                                    populate:{
                                        path:"subSection",
                                        //select: "-videoUrl",
                                    },
                                })
                                .exec();

        //validation
        if(!courseDetails) {
            return res.status(400).json({
                success:false,
                message:`Could not find the course with ${courseId}`,
            });
        }

        let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
        //return response
        return res.status(200).json({
            success:true,
            message:"Course Details fetched successfully",
            data:{courseDetails,
              totalDuration
            },
        })

  }
  catch(error) {
      console.log(error);
      return res.status(500).json({
          success:false,
          message:error.message,
      });
  }
}

exports.editCourse = async (req, res) => {
    try {
      const { courseId } = req.body
      const updates = req.body
      const course = await Course.findById(courseId)
  
      if (!course) {
        return res.status(404).json({ error: "Course not found" })
      }
  
      // If Thumbnail Image is found, update it
      if (req.files) {
        console.log("thumbnail update")
        const thumbnail = req.files.thumbnailImage
        const thumbnailImage = await uploadImageToCloudinary(
          thumbnail,
          process.env.FOLDER_NAME
        )
        course.thumbnail = thumbnailImage.secure_url
      }
  
      // Update only the fields that are present in the request body
      for (const key in updates) {
        if (updates.hasOwnProperty(key)) {
          course[key] = updates[key]
          // if (key === "tag" || key === "instructions") {
          //   course[key] = JSON.parse(updates[key])
          // } else {
          //   course[key] = updates[key]
          // }
        }
      }
  
      await course.save()
  
      const updatedCourse = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails", 
          },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec()
  
      res.json({
        success: true,
        message: "Course updated successfully",
        data: updatedCourse,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }

  exports.getFullCourseDetails = async (req, res) => {
    try {
      const { courseId } = req.body
      const userId = req.user.id
      const courseDetails = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec()
  
      let courseProgressCount = await CourseProgress.findOne({
        courseID: courseId,
        userId: userId,
      })
  
      console.log("courseProgressCount : ", courseProgressCount)
  
      if (!courseDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find course with id: ${courseId}`,
        })
      }
  
      // if (courseDetails.status === "Draft") {
      //   return res.status(403).json({
      //     success: false,
      //     message: `Accessing a draft course is forbidden`,
      //   });
      // }
  
      let totalDurationInSeconds = 0
      courseDetails.courseContent.forEach((content) => {
        content.subSection.forEach((subSection) => {
          const timeDurationInSeconds = parseInt(subSection.timeDuration)
          totalDurationInSeconds += timeDurationInSeconds
        })
      })
  
      const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
  
      return res.status(200).json({
        success: true,
        data: {
          courseDetails,
          totalDuration,
          completedVideos: courseProgressCount?.completedVideos
            ? courseProgressCount?.completedVideos
            : [],
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
  
  // Get a list of Course for a given Instructor
  exports.getInstructorCourses = async (req, res) => {
    try {
      // Get the instructor ID from the authenticated user or request body
      const instructorId = req.user.id
  
      // Find all courses belonging to the instructor
      const instructorCourses = await Course.find({
        instructor: instructorId,
      }).sort({ createdAt: -1 }).populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()
  
      // Return the instructor's courses
      res.status(200).json({
        success: true,
        data: instructorCourses,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Failed to retrieve instructor courses",
        error: error.message,
      })
    }
  }
  // Delete the Course
  exports.deleteCourse = async (req, res) => {
    try {
      const { courseId } = req.body
  
      // Find the course
      const course = await Course.findById(courseId)
      if (!course) {
        return res.status(404).json({ message: "Course not found" })
      }
  
      // Unenroll students from the course
      const studentsEnrolled = course.studentsEnrolled
      for (const studentId of studentsEnrolled) {
        await User.findByIdAndUpdate(studentId, {
          $pull: { courses: courseId },
        })
      }
  
      // Delete sections and sub-sections
      const courseSections = course.courseContent
      for (const sectionId of courseSections) {
        // Delete sub-sections of the section
        const section = await Section.findById(sectionId)
        if (section) {
          const subSections = section.subSection
          for (const subSectionId of subSections) {
            await SubSection.findByIdAndDelete(subSectionId)
          }
        }
  
        // Delete the section
        await Section.findByIdAndDelete(sectionId)
      }
      

      // Delete the course
      await Course.findByIdAndDelete(courseId)
  
      return res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      })
    }
  }