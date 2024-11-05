"use client"
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import {Link} from 'react-router-dom';
import { names_privte} from '@/data/homePage'

const Home =()=> {
  useEffect(() => {
    AOS.init();
  }, []);
  return (
   <div className=" h-[80vh] flex justify-around ">
      {
        names_privte.map((name) => (
          <Link to={name === 'الاطلاع على قضايا العضو' ? '/case/private/management' : '/case/private/add'}  className="item flex items-center justify-center  shadow-2xl cursor-pointer h-[468px] w-[530px] rounded-2xl  bg-[#F0F0F0] " data-aos={name === 'مواعيد تجديد المتهمين' ? 'fade-right' : 'fade-left'}  data-aos-duration="3000"  key={name}>
            <h1 className=" font-bold text-6xl w-[427px] text-center select-none">{name}</h1>
          </Link>
        ))
      }
   </div>
  );
}

export default Home;
