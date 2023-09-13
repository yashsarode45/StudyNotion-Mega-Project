import React from 'react'
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineCurrencyRupee } from "react-icons/hi"
import { MdNavigateNext } from "react-icons/md"
import {
    addCourseDetails, editCourseDetails, fetchCourseCategories
} from '../../../../../services/operations/courseDetailsAPI'
import { setCourse, setStep } from "../../../../../slices/courseSlice"
import { COURSE_STATUS } from "../../../../../utils/constants"
import IconBtn from "../../../../common/IconBtn"
import Upload from "../Upload"
import ChipInput from "./ChipInput"
import RequirementsField from "./RequirementField"


const CourseInformationForm = () => {
    const {
        register,
        setValue, 
        getValues,
        formState: {errors},
        handleSubmit
    } = useForm();

    const dispatch = useDispatch();
    const {token} = useSelector((state)=> state.auth)
    const { course, editCourse } = useSelector((state) => state.course)
    const [loading, setLoading] = useState(false)
    const [courseCategories, setCourseCategories] = useState([])
    
    useEffect(() => {
      // console.log("Course from slice in the step 1 form is", course)
      // console.log("EditCourse from slice in the step 1 form is", editCourse)
      const getCategories = async () => {
        setLoading(true);

        const categories = await fetchCourseCategories()
        // console.log("categories respnse is",categories)
        if (categories.length > 0) {
            // console.log("categories", categories)
            setCourseCategories(categories)
          }
          setLoading(false)
      }
      
       // if form is in edit mode
    if (editCourse) {
        // console.log("data populated", editCourse)
        setValue("courseTitle", course.courseName)
        setValue("courseShortDesc", course.description)
        setValue("coursePrice", course.price)
        setValue("courseTags", course.tags)
        setValue("courseBenefits", course.whatWillYouLearn)
        setValue("courseCategory", course.category)
        setValue("courseRequirements", course.instructions)
        setValue("courseImage", course.thumbnail)
      }
      getCategories()
      
    }, [])
    
    const isFormUpdated = () => {
        const currentValues = getValues();

        if(
            currentValues.courseTitle !== course.courseName ||
            currentValues.courseShortDesc !== course.courseDescription ||
            currentValues.coursePrice !== course.price ||
            currentValues.courseTags.toString() !== course.tags.toString() ||
            currentValues.courseBenefits !== course.whatWillYouLearn ||
            currentValues.courseCategory._id !== course.category._id ||
            currentValues.courseRequirements.toString() !==
            course.instructions.toString() ||
            currentValues.courseImage !== course.thumbnail
        ) {return true}
        return false
    }

    const onSubmit = async (data)=> {
        // console.log("Form Data is", data)
        if(editCourse){
            if(isFormUpdated()){
                const currentValues = getValues()
                const formData = new FormData()
                // console.log(data)
                formData.append("courseId", course._id)
                if (currentValues.courseTitle !== course.courseName) {
                formData.append("courseName", data.courseTitle)
                }
                if (currentValues.courseShortDesc !== course.courseDescription) {
                formData.append("description", data.courseShortDesc)
                }
                if (currentValues.coursePrice !== course.price) {
                formData.append("price", data.coursePrice)
                }
                if (currentValues.courseTags.toString() !== course.tags.toString()) {
                formData.append("tags", JSON.stringify(data.courseTags))
                }
                if (currentValues.courseBenefits !== course.whatWillYouLearn) {
                formData.append("whatWillYouLearn", data.courseBenefits)
                }
                if (currentValues.courseCategory._id !== course.category._id) {
                formData.append("category", data.courseCategory)
                }
                if (
                currentValues.courseRequirements.toString() !==
                course.instructions.toString()
                ) {
                formData.append(
                    "instructions",
                    JSON.stringify(data.courseRequirements)
                )
                }
                if (currentValues.courseImage !== course.thumbnail) {
                formData.append("thumbnailImage", data.courseImage)
                }
                // console.log("Edit Form data: ", formData)
                setLoading(true)
                const result = await editCourseDetails(formData, token)
                setLoading(false)
                if (result) {
                dispatch(setStep(2))
                dispatch(setCourse(result))
                }
            }
            else{
                toast.error("No changes made to the form")
            }
            return
        }

        const formData = new FormData();
        formData.append("courseName", data.courseTitle)
        formData.append("courseDescription", data.courseShortDesc)
        formData.append("price", data.coursePrice)
        formData.append("tags", JSON.stringify(data.courseTags))
        formData.append("whatWillYouLearn", data.courseBenefits)
        formData.append("category", data.courseCategory)
        formData.append("status", COURSE_STATUS.DRAFT)
        formData.append("instructions", JSON.stringify(data.courseRequirements))
        formData.append("thumbnailImage", data.courseImage)

        setLoading(true);

        const result = await addCourseDetails(formData, token);
        if (result) {
            dispatch(setStep(2));
            dispatch(setCourse(result))
        }
        setLoading(false)

    }
  return (
    <form onSubmit={handleSubmit(onSubmit)}
    className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
    >
        {/* Course Title */}
        <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="courseTitle">
            Course Title <sup className="text-pink-200">*</sup>
            </label>
            <input 
                id='courseTitle'
                placeholder='Enter Course Title'
                {...register("courseTitle", {required: true})}
                className='form-style w-full'
            />
            {
                errors.courseTitle && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">
                Course title is required
            </span>
                )
            }
        </div>
        
        {/* Course Description */}
        <div className='flex flex-col space-y-2'>
            <label htmlFor='courseShortDesc' className=' text-sm text-richblack-5'>
                Course Short Description <sup className=' text-pink-200'>*</sup>
            </label>
            <textarea id='courseShortDesc' placeholder='Enter Description'
                {...register("courseShortDesc",{required:true})}
                className=' form-style resize-x-none min-h-[130px] w-full'
            />
            {errors.courseShortDesc && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
                Course Description is required
            </span>
            )}
        </div>

        {/* Course Price */}
        <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="coursePrice">
          Course Price <sup className="text-pink-200">*</sup>
        </label>
        <div className="relative">
          <input
            id="coursePrice"
            placeholder="Enter Course Price"
            {...register("coursePrice", {
              required: true,
              valueAsNumber: true,
              pattern: {
                value: /^(0|[1-9]\d*)(\.\d+)?$/,
              },
            })}
            className="form-style w-full !pl-12"
          />
          <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
        </div>
        {errors.coursePrice && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Price is required
          </span>
        )}
        </div>
        
        {/* Course Category DropDown */}
        <div className="flex flex-col space-y-2">
            <label htmlFor='courseCategory' className="text-sm text-richblack-5">
                Category <sup className="text-pink-200">*</sup>
            </label>

            <select 
            id='courseCategory'
            defaultValue=""
            {...register("courseCategory", {required:true})}
            className='form-style w-full'>
                <option value="" disabled>Choose a category</option>
                {
                    !loading && 
                    courseCategories.map((category, index) => (
                        <option value={category?._id} key={index}>
                            {category?.name}
                        </option>
                    ))
                }
            </select>
            {errors.courseCategory && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                Course Category is required
                </span>
            )}
        </div>

        {/* Tags component */}
        <ChipInput
            label="Tags"
            name="courseTags"
            placeholder="Enter Tags and Press Enter"
            register={register}
            setValue={setValue}
            getValues={getValues}
            errors={errors}
        />

        {/* Upload Component */}
        <Upload 
        name="courseImage"
        label="Course Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editCourse ? course?.thumbnail : null}
        />

        {/* Benefits of the course */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseBenefits">
          Benefits of the course <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseBenefits"
          placeholder="Enter benefits of the course"
          {...register("courseBenefits", { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full"
        />
        {errors.courseBenefits && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Benefits of the course is required
          </span>
        )}
      </div>
      {/* Requirements/Instructions */}
      <RequirementsField
        name="courseRequirements"
        label="Requirements/Instructions"
        register={register}
        setValue={setValue}
        errors={errors}
        getValues={getValues}
      />

      <div className='flex justify-end gap-2'>
        {editCourse && (
            <button 
            onClick={()=> dispatch(setStep(2))}
            disabled={loading}
            className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
            >
                Continue Without Saving
            </button>
        )}
        <IconBtn 
        disabled={loading}
        text={editCourse ? "Save Changes" : "Next"}
        >
            <MdNavigateNext/>
        </IconBtn>
      </div>
    </form>
  )
}

export default CourseInformationForm