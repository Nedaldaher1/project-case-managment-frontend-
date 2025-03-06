import { Link } from "react-router-dom";

// مكون الإدارة بعد تعديل التسمية وتوضيح بعض النقاط
const Management = () => {
    return (
        <div className="flex flex-row items-center justify-center ">
            <div className="flex items-center justify-center max-w-[1200px] h-screen gap-16">
                {/* قسم الإدخال */}
                <div className=" shadow-xl text-6xl w-[350px] h-[300px] bg-gray-200 rounded-lg flex items-center justify-center">
                    <Link to="insert">
                        الإدخال
                    </Link>
                </div>
                {/* قسم الإطلاع */}
                <div className="shadow-xl text-6xl w-[350px] h-[300px] bg-gray-200 rounded-lg flex items-center justify-center">
                    <Link to="data">
                        أطلاع
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Management;
