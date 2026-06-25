import { adminSidebarMenuItems } from "@/config";
import {  User } from "lucide-react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";



function MenuItems() {
      console.log(adminSidebarMenuItems);


    const navigate = useNavigate()


    return <nav className="mt-8 flex-col flex gap-2">
        {
            adminSidebarMenuItems.map(menuItems => (
                <div key={menuItems.id} onClick={() => navigate(menuItems.path)} className="flex items-center gap-2 rounded-md px-3 py-2">
                    {menuItems.icons}
                    <span>{menuItems.label}</span>

                </div>))
        }
    </nav>
}

function AdminSidebar({ open, setOpen }) {
      console.log("AdminSidebar Rendered");


    const navigate = useNavigate()

    return (
    <Fragment>
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent side="left" className="w-64">
                <div className="flex flex-col h-full">
                    <SheetHeader className="border-b">
                        <SheetTitle>
                            <User size={30} />
                            Admin Panel
                        </SheetTitle>

                    </SheetHeader>
                    <MenuItems/>
                </div>
            </SheetContent>

        </Sheet>

        <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">

            <div onClick={() => navigate("/admin/dashboard")} className="flex cursor-pointer items-center gap-2">
                <User size={30} />
                <h1 className="text-xl font-extrabold">Admin Panel</h1>
            </div>
            <MenuItems />
        </aside>

    </Fragment>
    )
}

export default AdminSidebar;