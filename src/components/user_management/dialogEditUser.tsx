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
import { useState } from "react";
import { userEdit } from '@/api/authApi'
import { DialogEditUserProps } from '@/types/DialogEditUserProps'
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";

interface DialogEditUserComponentProps {
    id: string;
    children: React.ReactNode;
    user: string;
}

const DialogEditUser = ({ children, id , user }: DialogEditUserComponentProps) => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [role, setRole] = useState<string>("");
    const userCookie = Cookies.get('username');
    const data: DialogEditUserProps = {
        id: "",
        username: "",
        password: "",
        role: ""
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if(userCookie === user){
                toast.error("لا يمكن تعديل حسابك الخاص")
                return;
            }

            if (username) data.username = username;
            if (password) data.password = password;
            if (role) data.role = role;
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
                        </div>
                        <div>
                            <label htmlFor="password">كلمة المرور</label>
                            <Input onChange={handleChange} id="password" type="password" />
                        </div>
                        <div>
                            <label htmlFor="role">الدور</label>
                            <Select onValueChange={setRole}>
                                <SelectTrigger>
                                    <SelectValue>اختر الدور</SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="onwer">رئيس</SelectItem>
                                    <SelectItem value="admin">مدير</SelectItem>
                                    <SelectItem value="editor">محرر</SelectItem>
                                    <SelectItem value="viewer">محرر</SelectItem>
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