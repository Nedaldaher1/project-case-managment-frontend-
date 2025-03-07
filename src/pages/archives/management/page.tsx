import { Link, useSearchParams } from "react-router-dom";
import '@/globle.scss';

const Management = () => {
    // الحصول على type من الكويري
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type');

    return (
        <div className="flex flex-row items-center justify-center">
            <div className="flex items-center justify-center max-w-[1200px] h-screen gap-16">


                {/* قسم الإطلاع */}
                <Link to={`data?type=${type}`} className="my-link">
                    <div className="my-div group">
                        {/* عنصر انميشن الحدود */}
                        <div className="border-animation"></div>

                        {/* خلفية الصورة التي تظهر عند hover */}
                        <div className="my-div__bg"></div>

                        <span className="relative z-10">الاطلاع</span>
                    </div>
                </Link>



                {/* قسم الإدخال */}
                <Link to="insert" className="my-link">
                    <div className="my-div group">
                        {/* عنصر انميشن الحدود */}
                        <div className="border-animation"></div>

                        {/* خلفية الصورة التي تظهر عند hover */}
                        <div className="my-div__bg"></div>

                        <span className="relative z-10">الإدخال</span>
                    </div>
                </Link>


            </div>
        </div>
    );
};

export default Management;