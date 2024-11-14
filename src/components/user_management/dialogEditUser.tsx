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
import { useEffect, useState } from "react";
import { userEdit } from '@/api/authApi'
import { DialogEditUserProps } from '@/types/DialogEditUserProps'
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";

interface DialogEditUserComponentProps {
    id: string;
    children: React.ReactNode;
    roleUser: string;
    userNamePass: string;
}

const DialogEditUser = ({ children, id, roleUser, userNamePass }: DialogEditUserComponentProps) => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [role, setRole] = useState<string>("viewer");
    const userCookie = Cookies.get('username');
    const roleCookie = Cookies.get('role');
    const data: DialogEditUserProps = {
        id: "",
        username: "",
        password: "",
        role: ""
    };




    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (userCookie === username) {
                toast.error("رجاء تغير اسم المستخدم ");
                return;
            }

            if (username === userNamePass) {
                toast.error("رجاء تغير اسم المستخدم ");
                return;
            }
            const roleData = roleUser === 'admin' ? 'admin' : role;
            if (username) data.username = username;
            if (password) data.password = password;
            if (role) data.role = roleData;
            const response = await userEdit(id, data);

            if (response.status === 200) {
                toast.success("تم تعديل المستخدم  بنجاح");
            } else {
                toast.error(" تواصل مع المطور لحل المشكلة");
            }
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        switch (e.target.id) {
            case "username":
                setUsername(e.target.value);
                break;
            case "password":
                setPassword(e.target.value);
                break;
            default:
                break;
        }
    };



    return (
        <Dialog>
            <DialogTrigger>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>تعديل بيانات المستخدم</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="username">اسم المستخدم</label>
                            <Input onChange={handleChange} id="username" type="text" />
                            {

                                username === userNamePass ? <p className="text-red-500">هاذا الاسم موجود عليك تغيره</p> : null

                            }
                        </div>
                        <div>
                            <label htmlFor="password">كلمة المرور</label>
                            <Input onChange={handleChange} id="password" type="password" />

                        </div>
                        <div>
                            <label htmlFor="role">الدور</label>
                            <Select defaultValue="viewer" disabled={roleUser === 'admin'} dir="rtl" onValueChange={setRole}>
                                <SelectTrigger className="w-[175px]  text-black  border-white  ">
                                    <SelectValue placeholder="اختيار الدور" />
                                </SelectTrigger>
                                <SelectContent className="  text-black border-none">
                                    {
                                        roleCookie === 'owner' ? (
                                            <>
                                                <SelectItem value="owner">رئيس</SelectItem>
                                                <SelectItem value="admin">مدير</SelectItem>
                                            </>
                                        ) : (
                                            null
                                        )
                                    }
                                    <SelectItem value="editor">محرر</SelectItem>
                                    <SelectItem value="viewer">مشاهد</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">حفظ</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
export default DialogEditUser;