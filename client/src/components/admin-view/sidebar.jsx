import { adminSidebarMenuItems } from "@/config";
import {  User } from "lucide-react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";



function MenuItems({ setOpen }) {
  const navigate = useNavigate();

  return (
    <nav className="mt-8 flex flex-col gap-2">
      {adminSidebarMenuItems.map((menuItem) => {
        const Icon = menuItem.icon;

        return (
          <div
            key={menuItem.id}
            onClick={() => {
              navigate(menuItem.path);
              if (setOpen) setOpen(false);
            }}
            className="flex items-center gap-2 rounded-md px-3 py-2 cursor-pointer hover:bg-muted"
          >
            <Icon className="h-5 w-5" />
            <span>{menuItem.label}</span>
          </div>
        );
      })}
    </nav>
  );
}

function AdminSidebar({ open, setOpen }) {
      console.log("AdminSidebar Rendered");


    const navigate = useNavigate()

    return (
    <Fragment>
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent side="left" className="w-64">
                <div className="flex flex-col h-full ">
                    <SheetHeader className="border-b">
                        <SheetTitle className="flex gap-2 mt-5 mb-5">
                            <User size={30} />
                <h1 className="text-xl font-extrabold">Admin Panel</h1>
                        </SheetTitle>

                    </SheetHeader>
                    <MenuItems setOpen={setOpen}/>
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