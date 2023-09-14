import React, { useEffect } from 'react'
import logo from "../../assets/Logo/Logo-Full-Light.png"
import { Link, matchPath } from 'react-router-dom'
import {NavbarLinks} from "../../data/navbar-links"
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {AiOutlineShoppingCart} from "react-icons/ai"
import ProfileDropDown from '../core/Auth/ProfileDropDown'
import { apiConnector } from '../../services/apiconnector'
import { categories } from '../../services/apis'
import { useState } from 'react'
import {IoIosArrowDown} from "react-icons/io"
import {RxHamburgerMenu} from "react-icons/rx"
import './loader.css'
// Ḍemo temporary data
// const subLinks = [
//     {
//         title: "Python",
//         link:"/catalog/python"
//     },
//     {
//         title: "Web Dev",
//         link:"/catalog/web-development"
//     },
// ];

const Navbar = () => {
    // console.log("Printing base url: ",process.env.REACT_APP_BASE_URL);
    
    const {token} = useSelector((state)=> state.auth);
    // console.log("token in Navbar is",token)
    const {user} = useSelector((state)=> state.profile);
    // console.log("User in Navbar is",user)
    const {cart} = useSelector((state)=> state.cart);
    const {totalItems} = useSelector((state)=> state.cart);
    const location = useLocation();

    const [subLinks, setSubLinks]  = useState([]);

    const fetchSublinks = async() => {
        try{
            const result = await apiConnector("GET", categories.CATEGORIES_API);
            // console.log("Printing Sublinks result:" , result);
            setSubLinks(result.data.data);
        }
        catch(error) {
            console.log("Could not fetch the category list");
        }
    }

    
    useEffect( () => {
        fetchSublinks();
    },[] )

    const matchRoute = (route) => {
        return matchPath({path:route}, location.pathname);
    }
    
  return (
    <div className='flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700'>
      <div className='flex w-11/12 max-w-maxContent items-center justify-between'>
        {/* Image */}
      <Link to="/">
        <img src={logo} width={160} height={42} loading='lazy'/>
      </Link>

      {/* Nav Links */}
      <nav>
        <ul className=' hidden md:flex gap-x-6 text-richblack-25'>
        {
            NavbarLinks.map( (link, index) => (
                 <li key={index}>
                    {
                        link.title === "Catalog" ? (
                            <div className='relative flex items-center gap-2 group'>
                                <p>{link.title}</p>
                                <IoIosArrowDown/>

                                <div className={`invisible absolute left-[50%] 
                                    translate-x-[-49%] ${subLinks.length ? "translate-y-[15%]" : "translate-y-[40%]"}
                                 top-[50%] z-50 
                                flex flex-col rounded-md bg-richblack-5 p-4 text-richblack-900
                                opacity-0 transition-all duration-200 group-hover:visible
                                group-hover:opacity-100 lg:w-[300px]`}>

                                <div className='absolute left-[50%] top-0
                                translate-x-[80%]
                                translate-y-[-45%] h-6 w-6 rotate-45 rounded bg-richblack-5'>
                                </div>

                                {
                                    subLinks.length ? (
                                            subLinks.map( (subLink, index) => (
                                                <Link className='rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50' to={`catalog/${subLink.name}`} key={index}>
                                                    <p>{subLink.name}</p>
                                                </Link>
                                            ) )
                                    ) : (<span className="loader"></span>)
                                }

                                </div>


                            </div>

                        ) : (
                            <Link to={link?.path}>
                                <p className={`${ matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"}`}>
                                    {link.title}
                                </p>
                                
                            </Link>
                        )
                    }
                </li>
             ) )
        }

        </ul>
      </nav>

        {/* Login/SignUp/Dashboard */}
        <div className='hidden md:flex gap-x-4 items-center'>
            {   
                user && user?.accountType != "Instructor" && (
                    <Link to="/dashboard/cart" className='relative pr-2'>
                        <AiOutlineShoppingCart className='text-2xl text-richblack-100 ' />
                        {
                            totalItems > 0 && (
                                <span className=' absolute -bottom-2 -right-0 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100'>
                                    {totalItems}
                                </span>
                            )
                        }
                    </Link>
                )
            }
            {
                token === null && (
                    <Link to="/login">
                        <button className='border  border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'>
                            Log in
                        </button>
                    </Link>
                )
            }
            {
                token === null && (
                    <Link to="/signup">
                        <button  className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'>
                            Sign Up
                        </button>
                    </Link>
                )
            }
            {
                token !== null && <ProfileDropDown />
            }
            
        </div>

         <div className='mr-4 md:hidden text-[#AFB2BF] scale-150'>
            <RxHamburgerMenu />  
         </div>   
              
      </div>
    </div>
  )
}

export default Navbar