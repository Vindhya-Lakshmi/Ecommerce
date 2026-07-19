import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Fragment } from "react"
import { filterOptions } from "@/config";

function ProductFilter({filters, handleFilter}) {
    return (
        <div className="bg-background rounded-lg shadow-sm">
            <div className="p-4 border-b">
                <h2 className="text-lg font-extrabold">Filters</h2>
            </div>
            <div className="p-4 space-y-4">
                {
                    Object.keys(filterOptions).map((keyItem) => (
                    <Fragment key={keyItem}>
                        <div>
                            <h3 className="text-base font-bold">{keyItem}</h3>
                            <div className="grid gap-2 mt-2">
                                {
                                    filterOptions[keyItem].map(option=> 
                                    <Label key={option.id}
                                    className="flex items-center gap-3 cursor-pointer rounded-md px-2 py-1 transition-colors hover:bg-gray-100">
                                        <Checkbox className="h-5 w-5 border-2 border-black data-[state=checked]:bg-black data-[state=checked]:border-black"
                                        checked={
                                            filters &&
                                            filters[keyItem] &&
                                            filters[keyItem].includes(option.id)
                                        }
                                         onCheckedChange={()=>handleFilter(keyItem, option.id)}/>
                                        {option.label}
                                    </Label>)
                                }
                            </div>
                        </div>
                        <Separator/>
                    </Fragment>
                    ))}
            </div>
        </div>
    )
}
export default ProductFilter