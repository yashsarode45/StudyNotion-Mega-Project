import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { json, useNavigate } from 'react-router-dom';
import copy from 'copy-to-clipboard';
import { toast } from 'react-hot-toast';
import { ACCOUNT_TYPE } from '../../../utils/constants';
import { addToCart } from '../../../slices/cartSlice';
import { BiSolidRightArrow } from 'react-icons/bi';
const CourseDetailsCard = ({course, setConfirmationModal, handleBuyCourse}) => {
    const { cart } = useSelector((state) => state.cart)
    const {user} = useSelector((state)=>state.profile);
    const {token} = useSelector((state)=>state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // console.log("Course Instruction type is", typeof(course?.instructions))
    const {
        thumbnail: ThumbnailImage,
        price: CurrentPrice,

    } = course;
    
    const handleAddToCart = () => {
        if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
            toast.error("Instructor cannot buy the course")
            return
        }
        if (token) {
            // console.log("dispatching add to cart")
            dispatch(addToCart(course));
            // console.log("CART IN SLICE IS", cart)
            return;
        }
        setConfirmationModal({
            text1:"you are not logged in",
            text2:"Please login to add to cart",
            btn1text:"login",
            btn2Text:"cancel",
            btn1Handler:()=>navigate("/login"),
            btn2Handler: ()=> setConfirmationModal(null),
        })
    }
    
    const handleShare = () => {
        copy(window.location.href);
        toast.success("Link Copied to Clipboard")
    }

    return (
        <div className='flex flex-col gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5'>
        <img 
            src={ThumbnailImage}
            alt='Thumbnail Image'
            className='max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full'
        />
        <div className='px-4'>
        <div className='space-x-3 pb-4 text-3xl font-semibold'>
            Rs. {CurrentPrice}
        </div>
        <div className='flex flex-col gap-y-6'>
            <button className='yellowButton'
                onClick={
                    user && course?.studentsEnrolled.includes(user?._id)
                    ? ()=> navigate("/dashboard/enrolled-courses")
                    : handleBuyCourse
                }
            >
                {
                    user && course?.studentsEnrolled.includes(user?._id) ? "Go to Course ": "Buy Now"
                }
            </button>

        {
            (!course?.studentsEnrolled.includes(user?._id)) && (
                <button onClick={handleAddToCart} className='blackButton'>
                    Add to Cart
                </button>
            )
        }
        </div>

        <div>
            <p className='pb-3 pt-6 text-center text-sm text-richblack-25'>
                30-Day Money-Back Guarantee
            </p> 
        </div>
        <div>
            <p className='my-2 text-xl font-semibold '>
                This Course Includes:
            </p>
            <div className='flex flex-col gap-3 text-sm text-caribbeangreen-100'>
                {
                    JSON.parse(course?.instructions).map((item, index)=> (
                        <p key={index} className='flex gap-2'>
                           <BiSolidRightArrow/>
                            <span>{item}</span>
                        </p>
                    ))
                }
            </div>
        </div>
        <div className='text-center'>
            <button
            className='mx-auto flex items-center gap-2 py-6 text-yellow-100 '
            onClick={handleShare}
            >
                Share
            </button>
        </div>
        </div>
    </div>
  )
}

export default CourseDetailsCard