import { FaPrint } from "react-icons/fa6";
import { MdOutlineFilterAlt } from "react-icons/md";
import { Link } from "react-router-dom";


export default function Breadcrumb({pageTitle,addbuttn,excelbuttn,printbuttn,filterbuttn,pageCategory,activePage,handleOpenCreateModal,handleOpenFilterModal,withLink,previouspageurl,addbuttnurl,additionaltext}:any) {
  return (
  <>
  <div className="bg-breadcrumb-gradient w-full h-[140px] pt-8 px-6 ">
<div className="flex justify-between items-center">
<h3 className="page-title text-white text-2xl font-medium mb-2">{pageTitle}</h3>
<ul className="buttn_list flex gap-2 items-center">
  {
    addbuttn ?
    <li>
      {
        withLink ?
        <Link to={addbuttnurl} className="bg-yellowcolor hover:bg-greencolor py-2 px-4 text-text15 h-[32px] font-medium text-white rounded-md">+ Add</Link>
        :
        <button type="button" onClick={handleOpenCreateModal} className="bg-yellowcolor hover:bg-greencolor py-2 px-4 text-text15 h-[32px] font-medium text-white rounded-md">+ Add {additionaltext}</button>
      }
   
</li>
:
""
  }
  {
    excelbuttn ?
    <li>
    <Link to="/" className="bg-greencolor hover:bg-[#699834] py-2 px-3 text-text15 font-medium text-white rounded-md">Export to Excel</Link>
</li>
    :
    ""
  }
  {
    printbuttn ?
    <li>
    <button type="button" className="bg-[#009efb] hover:bg-[#009ffbc7] py-[6px] px-5 text-text15 font-medium text-white rounded-md flex items-center gap-2"> <FaPrint />Print</button>
</li>
    :
    ""
  }

  {
    filterbuttn ?
    <li>
    <button type="button" onClick={handleOpenFilterModal} className="bg-yellowcolor hover:bg-greencolor h-[32px]  flex items-center gap-1 py-2 px-4 text-text15  font-medium text-white rounded-md"><MdOutlineFilterAlt /> Filter</button>
</li>
    :
    ""
  }
   
</ul>
</div>
<ul className="flex items-center gap-3">
    <li>
        <Link to={`${previouspageurl}`} className="text-lightwhite text-lg">{pageCategory}</Link>
    </li>
    <li className="text-paracolor">
        /
    </li>
    <li>
<span className="text-breadcrumbactive text-text15">{activePage}</span>
    </li>
</ul>
  </div>
  
  </>
  )
}
