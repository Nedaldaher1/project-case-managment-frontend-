import { archives } from "@/data/archivesData"
import { Link } from 'react-router-dom';
import './style.scss';

const Home = () => {

    return (
        <div className=' h-[1200px] flex flex-col items-center justify-center gap-16'>
            <div className='flex flex-col items-center justify-center gap-16'>
                <h1 className=" text-6xl">نيابة اجا الجزئية</h1>

                <div className="flex flex-wrap max-w-[1200px]  items-center justify-center gap-16">
                    {
                        archives.map((item, index) => (
                            <Link to={item.linkTo} className="my-link">

                                <div className="my-div group">
                                    {/* عنصر انميشن الحدود */}
                                    <div className="border-animation"></div>

                                    {/* خلفية الصورة التي تظهر عند hover */}
                                    <div
                                        className="my-div__bg"
                                    ></div>

                                    {item.text}
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
