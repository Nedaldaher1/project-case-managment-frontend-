import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { createUser } from '@/api/authApi'
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";



const DialogAddUser = () => {

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [role, setRole] = useState<string>("viewer");
    const [messageError, setMessageError] = useState<string>("");
    const userCookie = Cookies.get('username');
    const roleCookie = Cookies.get('role');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            switch (e.target.id) {
                case 'username':
                    setUsername(e.target.value);
                    break;
                case 'password':
                    setPassword(e.target.value);
                    break;
                case 'role':
                    setRole(e.target.value);
                    break;
                default:
                    break;
            }

        } catch (error) {
            console.error("Error in handelChange:", error);
        }
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            const data = { username, password, role };
            const response: any = await createUser(data);
            if (response.status === 200) {
                toast.success("تم إضافة المستخدم بنجاح");
            } else {
                // عرض رسالة الخطأ في حالة عدم نجاح الطلب
                const errorMessage = response.message || "حدث خطأ أثناء إضافة المستخدم";

                toast.error(errorMessage);
            }

        } catch (error: any) {
            const serverMessage = error.response?.data?.message || "حدث خطأ غير متوقع";
            toast.error(serverMessage);

            console.error("Error in handleSubmit:", error);
        }
    }


    return (
        <Dialog>
            <DialogTrigger >
            <Button className="bg-[#283444]">إضافة مستخدم جديد</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>إضافة مستخدم جديد</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="username">اسم المستخدم</label>
                            <Input onChange={handleChange} id="username" type="text" />
                        </div>
                        <div>
                            <label htmlFor="password">كلمة المرور</label>
                            <Input onChange={handleChange} id="password" type="password" />
                        </div>
                        <div>
                            <label htmlFor="role">الدور</label>
                            <Select defaultValue="viewer" dir="rtl" onValueChange={setRole}>
                                <SelectTrigger className="w-[175px] text-black border-white">
                                    <SelectValue placeholder="اختيار الدور" />
                                </SelectTrigger>
                                <SelectContent className="text-black border-none">
                                    {roleCookie === 'owner' ? (
                                        <>
                                            <SelectItem value="owner">رئيس</SelectItem>
                                            <SelectItem value="admin">مدير</SelectItem>
                                        </>
                                    ) : null}
                                    <SelectItem value="editor">محرر</SelectItem>
                                    <SelectItem value="viewer">مشاهد</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">أضافة</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default DialogAddUser;