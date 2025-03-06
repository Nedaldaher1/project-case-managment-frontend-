import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button"

// مكون الإدارة بعد تعديل التسمية وتوضيح بعض النقاط
const Insert = () => {
    return (
        <div className="flex flex-row items-center justify-center ">
            <div className="flex items-center justify-center max-w-[1200px] h-screen gap-16">
                {/* قسم الإدخال */}
                <div className=" flex  justify-center items-center text-white shadow-xl text-xl w-[1050px]   h-[600px]  bg-gray-950 rounded-lg ">
                    <form className=" max-w-[800px] h-[400px] flex items-center justify-center flex-wrap gap-16 ">
                        <div className=" w-[200px] flex flex-col items-center justify-center gap-2  ">
                            <label htmlFor="" className=" self-end">مسلسل</label>
                            <input className="   p-1 text-black outline-none bg-white rounded-xl" type="number" />
                        </div>
                        <div className=" w-[200px] flex flex-col items-center justify-center gap-2">
                            <label htmlFor="" className=" self-end">رقم الاشيا </label>
                            <input className="  p-1 text-black outline-none bg-white rounded-xl" type="number" />
                        </div>
                        <div className=" w-[200px] flex flex-col items-center justify-center gap-2">
                            <label htmlFor="" className=" self-end">الرقم الكلي</label>
                            <input className="  p-1 text-black outline-none bg-white rounded-xl" type="number" />
                        </div>
                        <div className=" w-[200px] flex flex-col items-center justify-center gap-2">
                            <label htmlFor="" className=" self-end">رقم الغرفة </label>
                            <input className="  p-1 text-black outline-none bg-white rounded-xl" type="number" />
                        </div>
                        <div className=" w-[200px] flex flex-col items-center justify-center gap-2">
                            <label htmlFor="" className=" self-end">رقم الاستاند </label>
                            <input className="  p-1 text-black outline-none bg-white rounded-xl" type="number" />
                        </div>
                        <div className=" w-[200px] flex flex-col items-center justify-center gap-2">
                            <label htmlFor="" className=" self-end">رقم الرف  </label>
                            <input className="  p-1 text-black outline-none bg-white rounded-xl" type="number" />
                        </div>
                        <div className=" w-[200px] flex flex-col items-center justify-center gap-2 ">
                            <label htmlFor="" className=" self-end">التهمة</label>
                            <input className="  p-1 text-black outline-none bg-white rounded-xl" type="text" />
                        </div>
                        <div className=" w-[200px] flex flex-col items-center justify-center gap-2">
                            <label htmlFor="" className=" self-end">بيان الحرز </label>
                            <input className="  p-1 text-black outline-none bg-white rounded-xl" type="text" />
                        </div>

                        <div className=" w-[200px] flex flex-col items-center justify-center gap-2">
                            <label htmlFor="" className=" self-end">التصرف في الحرز </label>
                            <input className="  p-1 text-black outline-none bg-white rounded-xl" type="text" />
                        </div>
                        <button className="w-[200px] h-[40px] bg-gray-200 rounded-xl text-black">حفظ</button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default Insert;
