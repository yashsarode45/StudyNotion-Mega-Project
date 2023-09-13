import React from 'react'
import { BsFillPeopleFill } from 'react-icons/bs';
import { TbHierarchy3 } from 'react-icons/tb';

const CourseCard = ({cardData,currentCard,}) => {
  return (
    <div className={` w-[360px] lg:w-[30%] h-[300px] box-border cursor-pointer
     ${currentCard === cardData.heading ? "bg-white shadow-[12px_12px_0_0] shadow-yellow-50  text-richblack-25" 
     : "bg-richblack-800  text-richblack-25"}`}>

        <div className='flex flex-col gap-3 p-6 border-b-[2px] border-richblack-400 border-dashed h-[80%]'>
            <p className={`font-semibold text-[20px]  
                ${currentCard === cardData.heading ? "text-richblack-800": ""}`}>
                {cardData.heading}
            </p>
            <p className="text-richblack-400">{cardData.description}</p>
        </div>

        <div className={`flex flex-row justify-between px-6 py-3 font-medium
        ${currentCard === cardData.heading ? " text-blue-300": " text-richblack-300"} `}>
            <div className='flex items-center gap-2 text-[16px]'>
                <BsFillPeopleFill/>
                <span>{cardData.level}</span>
            </div>
            <div className='flex items-center gap-2 text-[16px]'>
                <TbHierarchy3/>
                <span>{cardData.lessionNumber} Lessons</span>
            </div>
        </div>
    </div>
  )
}

export default CourseCard