import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import '@/globle.scss';

const Home = () => {
    const [data, setData] = useState<{ id: string, name: string }[]>([]);
    const getData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/archives/office/all');
            setData(response.data.offices);
        } catch (error) {
            console.error('An error occurred while fetching data:', error);
        }
    }

    useEffect(() => {
        getData();
    console.log(data);

    }, []);
    console.log(data);
    return (
        <div className=' h-[600px] flex flex-col items-center justify-center gap-16'>
            <div className='flex flex-col items-center justify-center gap-16'>
        <h1 className=" text-6xl"> نظام الارشيف الالكتروني للأحراز  </h1>
                <div className="flex flex-wrap max-w-[1200px]  items-center justify-center  gap-8">
                    {
                        data.map((office, index) => (
                            <Link key={index} to={`management?type=${office.id}`} className="my-link  rounded-full">

                            <div className="my-div group">
                                {/* عنصر انميشن الحدود */}
                                <div className="border-animation"></div>

                                {/* خلفية الصورة التي تظهر عند hover */}
                                <div
                                    className="my-div__bg"
                                ></div>

                                {office.name}
                            </div>
                        </Link>
                        ))
                    }
                </div>



            </div>
        </div>
    )
};



export default Home;
