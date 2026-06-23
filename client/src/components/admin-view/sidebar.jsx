import { adminSidebarMenuItems } from "@/config";
import { User } from "lucide-react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";



function MenuItems(){
    return <nav className="mt-8 flex-col flex gap-2">
        {
            adminSidebarMenuItems.map(menuItems=> (
            <div className="flex items-center gap-2 rounded-md px-3 py-2">

            </div>))
        }
    </nav>
}

function AdminSidebar () {

const navigate = useNavigate()

    return <Fragment>

    <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">

        <div onClick={()=> navigate("/admin/dashboard")} className="flex cursor-pointer items-center gap-2">
            <User size={30}/>
            <h1 className="text-xl font-extrabold">Admin Panel</h1>
        </div>
    </aside>

    </Fragment>
}

export default AdminSidebar;