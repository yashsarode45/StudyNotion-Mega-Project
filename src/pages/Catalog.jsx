import React, { useEffect, useState } from 'react'
import Footer from '../components/common/Footer'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import { getCatalogaPageData } from '../services/operations/pageAndComponentData';
import Course_Card from '../components/core/Catalog/Course_Card';
import CourseSlider from '../components/core/Catalog/CourseSlider';
import { useSelector } from 'react-redux';

const Catalog = () => {

    const {catalogName} = useParams();
    
    const [catalogPageData, setCatalogPageData] = useState(null);
    const [categoryId, setCategoryId] = useState("");
    const [active, setActive] = useState(1)
    const [loading, setLoading] = useState(false)
    //Fetch all categories
    useEffect(()=> {
        const getCategories = async() => {
            setLoading(true)
            const res = await apiConnector("GET", categories.CATEGORIES_API);
            
            const category_id = 
            res?.data?.data?.filter((ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName.split(" ").join("-").toLowerCase())[0]._id;
            
            setCategoryId(category_id);
        }
        getCategories();
    },[catalogName]);

    useEffect(() => {
        const getCategoryDetails = async() => {
            setLoading(true)
            try{
                const res = await getCatalogaPageData(categoryId);
                // console.log("PRinting res: ", res);
                if (res.success) {
                    setCatalogPageData(res);
                }
                else{
                    setCatalogPageData(null)
                }
                setLoading(false)
            }
            catch(error) {
                console.log(error)
            }
        }
        if(categoryId) {
            getCategoryDetails();
        }
        
    },[categoryId]);

    useEffect(() => {
    //   console.log("catalogPageData?.selectedCourses.course.length", catalogPageData?.selectedCourses.course.length)
    //   console.log("catalogPageData?.differentCourses.course.length", catalogPageData?.differentCourses.course.length)
    //     console.log("catalogPageData?.mostSellingCourses.length ",catalogPageData?.mostSellingCourses.length)
      
    }, [catalogPageData])
    
    
    if(loading){
        return (
        <div className=' h-screen flex justify-center items-center text-richblack-100 mx-auto  text-3xl'>
        <p>
                Loading...
        </p>
        </div>
    )}
    else{
        return (
            <>
                {
                    (!catalogPageData) ? 
                    (<div className=' text-center text-xl text-richblack-300 my-8'> No Courses for the category </div>) 
                    :(
                        <>    
            <div className=" box-content bg-richblack-800 px-4">
                <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
                <p className="text-sm text-richblack-300">{`Home / Catalog / `}
                <span className="text-yellow-25">
                    {catalogPageData?.name}
                </span></p>
                <p className="text-3xl text-richblack-5"> {catalogPageData?.name} </p>
                <p className="max-w-[870px] text-richblack-200"> {catalogPageData?.description}</p>
                </div>
            </div>
        
            <div >
                {/* section1 */}
                <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                <div className="section_heading">Courses to get you started</div>
                    <div className="my-4 flex border-b border-b-richblack-600 text-sm">
                    <p
                    className={`px-4 py-2 ${
                      active === 1
                        ? "border-b border-b-yellow-25 text-yellow-25"
                        : "text-richblack-50"
                    } cursor-pointer`}
                    onClick={() => setActive(1)}
                  >
                    Most Populer
                  </p>
                  <p
                    className={`px-4 py-2 ${
                      active === 2
                        ? "border-b border-b-yellow-25 text-yellow-25"
                        : "text-richblack-50"
                    } cursor-pointer`}
                    onClick={() => setActive(2)}
                  >
                    New
                  </p>
                    </div>
                    <div>
                        <CourseSlider Courses={catalogPageData?.selectedCourses.course} />
                    </div>
                </div>  
        
                {/* section2 */}
                <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                <div className="section_heading">Checkout {catalogPageData?.differentCourses.name} Courses Also</div>
                    <div className="py-8">
                        <CourseSlider Courses={catalogPageData?.differentCourses.course}/>
                        
                    </div>
                </div>
        
                {/* section3 */}
                <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                    <div className="section_heading">Most Selling Courses</div>
                    <div className='py-8'>
        
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        
                            {
                                catalogPageData?.mostSellingCourses.length === 0 ? (<p className=' text-xl text-white'>No Most selling courses</p>) : (catalogPageData?.mostSellingCourses?.slice(0,4)
                                .map((course, index) => (
                                    <Course_Card course={course} key={index} Height={"h-[400px]"}/>
                                )))
                            }
        
                        </div>
        
                    </div>
                </div>
        
            </div>
        <Footer />
            </>
                    )
                }
            </>
        
            
          )
    }
}

export default Catalog
