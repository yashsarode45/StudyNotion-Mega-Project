import React from 'react'
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { IoAddCircleOutline } from "react-icons/io5"
import { MdNavigateNext } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"

import {
  createSection,
  updateSection,
} from "../../../../../services/operations/courseDetailsAPI"
import {
  setCourse,
  setEditCourse,
  setStep,
} from "../../../../../slices/courseSlice"
import IconBtn from "../../../../common/IconBtn"
import NestedView from "./NestedView"

const CourseBuilderForm = () => {
  const {
    register, setValue, getValues, handleSubmit, formState: {errors}
  } =  useForm();

  const {course} = useSelector((state)=> state.course)
  const {token} = useSelector((state)=> state.auth)
  const [loading, setLoading] = useState(false);
  const [editSectionName, setEditSectionName] = useState(null)
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    setLoading(true)
    let result

    if (editSectionName) {
      result = await updateSection({
        sectionName: data.sectionName,
        sectionId: editSectionName,
        courseId: course._id
      },
      token)
    }else{
      result = await createSection({
        sectionName: data.sectionName,
        courseId:course._id
      },
      token)
    }

    if(result) {
      dispatch(setCourse(result))
      setEditSectionName(null);
      setValue("sectionName", "")
    }
    setLoading(false)
  }

  const cancelEdit = ()=> {
    setEditSectionName(null)
    setValue("sectionName", "")
  }

  const handleChangeEditSectionName = (sectionId, sectionName) => {
      if(editSectionName === sectionId)
      {
        cancelEdit();
        return
      }
      setEditSectionName(sectionId);
      setValue("sectionName", sectionName)
  }

  const goToNext = () => {
    if (course.courseContent.length === 0) {
      toast.error("Please add atleast one section")
      return
    }
    if (
      course.courseContent.some((section) => section.subSection.length === 0)
    ) {
      toast.error("Please add atleast one lecture in each section")
      return
    }
    dispatch(setStep(3))
  }

  const goBack = () => {
    dispatch(setStep(1))
    dispatch(setEditCourse(true))
  }

  return (
    <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor='sectionName' 
          className="text-sm text-richblack-5">Section Name <sup className="text-pink-200">*</sup> </label>

          <input
            id='sectionName'
            placeholder='Add a section to build the course'
            disabled={loading}
            {...register("sectionName", {required:true})}
            className='form-style w-full'
          />

            {errors.sectionName && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Section name is required
              </span>
            )}
        </div>

        <div>
          <IconBtn
          type="submit"
          disabled={loading}
          text={editSectionName ? "Edit Section Name" : "Create Section"}
          outline={true}>
            <IoAddCircleOutline size={20} className="text-yellow-50" />
          </IconBtn>
          {editSectionName && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-sm text-richblack-300 underline"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
      {course.courseContent.length > 0 && (
        <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
      )}
      {/* Next Prev Button */}
      <div className="flex justify-end gap-x-3">
        <button
          onClick={goBack}
          className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
        >
          Back
        </button>
        <IconBtn disabled={loading} text="Next" onclick={goToNext}>
          <MdNavigateNext />
        </IconBtn>
      </div>
    </div>
  )
}

export default CourseBuilderForm