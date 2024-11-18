import React from "react";
import logo from "@/assets/mainlogo/logo.png";
function ConfirmedQuotesView() {
  return (
    <div className="bg-gray-100 min-h-screen w-full ">
      <header className="text-center mb-8 relative bg-[#0B2F46] p-8 rounded-t-md">
        <img
          src={logo}
          alt="Logo"
          className="mx-auto mb-4 h-[100px] w-[106px] object-contain absolute top-4 left-6"
        />
        <h1 className="text-[44px] font-bold text-white">
          BANQUET EVENT ORDER
        </h1>
      </header>
      <div className="p-8">
        <section className="py-6 px-10 grid grid-cols-2 gap-4 mb-6 bg-white border border-gray-[#D1D1D1] rounded-lg">
          <div className="flex flex-row gap-6 text-xl font-medium text-[#1A1A1A]">
            <p className="text-xl font-medium text-[#1A1A1A]">
              Event Coordinator Name
            </p>
            :
            <p className="text-xl font-medium text-[#888888]">
              Virendra Sharma
            </p>
          </div>
          <div className="flex flex-row gap-6 text-xl font-medium text-[#1A1A1A]">
            <p className="text-xl font-medium text-[#1A1A1A]">Event Date</p>:
            <p className="text-xl font-medium text-[#888888]">05 Aug 2024</p>
          </div>
          <div className="flex flex-row gap-6 text-xl font-medium text-[#1A1A1A]">
            <p className="text-xl font-medium text-[#1A1A1A]">Hotel Name</p>:
            <p className="text-xl font-medium text-[#888888]">Royal Regalia</p>
          </div>
          <div className="flex flex-row gap-6 text-xl font-medium text-[#1A1A1A]">
            <p className="text-xl font-medium text-[#1A1A1A]">
              Event Coordinator Reporting Time
            </p>
            :
            <p className="text-xl font-medium text-[#888888]">Some text here</p>
          </div>
          <div className="flex flex-row gap-6 text-xl font-medium text-[#1A1A1A]">
            <p className="text-xl font-medium text-[#1A1A1A]">
              Client’s Company Name
            </p>
            :<p className="text-xl font-medium text-[#888888]">ABC Pvt. Ltd.</p>
          </div>
          <div className="flex flex-row gap-6 text-xl font-medium text-[#1A1A1A]">
            <p className="text-xl font-medium text-[#1A1A1A]">
              On-Site Client Name
            </p>
            :<p className="text-xl font-medium text-[#888888]">Vivek Kumar</p>
          </div>
          <div className="flex flex-row gap-6 text-xl font-medium text-[#1A1A1A]">
            <p className="text-xl font-medium text-[#1A1A1A]">
              Sales Person Name
            </p>
            :<p className="text-xl font-medium text-[#888888]">Rahul Verma</p>
          </div>
          <div className="flex flex-row gap-6 text-xl font-medium text-[#1A1A1A]">
            <p className="text-xl font-medium text-[#1A1A1A]">Expected PAX</p>:
            <p className="text-xl font-medium text-[#888888]">Some text</p>
          </div>
          <div className="flex flex-row gap-6 text-xl font-medium text-[#1A1A1A]">
            <p className="text-xl font-medium text-[#1A1A1A]">
              Event Coordinator Name
            </p>
            :<p className="text-xl font-medium text-[#888888]">Raj Kumar</p>
          </div>
          <div className="flex flex-row gap-6 text-xl font-medium text-[#1A1A1A]">
            <p className="text-xl font-medium text-[#1A1A1A]">
              On-Site Client Name
            </p>
            :<p className="text-xl font-medium text-[#888888]">Ajay Singh</p>
          </div>
        </section>

        <section className="py-6 px-10 grid grid-cols-2 gap-4 mb-6 bg-white border border-gray-[#D1D1D1] rounded-lg">
          {/* <InfoRow label="Event Start Time" value="Text here" />
          <InfoRow label="Event End Time" value="Text here" />
          <InfoRow label="BTR" value="Text here" />
          <InfoRow label="Venue Handover Time" value="Text here" />
          <InfoRow label="Welcome Drink Start Time" value="Text here" />
          <InfoRow label="Venue Name" value="Text here" />
          <InfoRow label="Setup" value="Text here" />
          <InfoRow label="A/V Vendor Name" value="Text here" />
          <InfoRow label="Linear Order" value="Text here" />
          <InfoRow label="Exp Number of Seating" value="Text here" />
          <InfoRow label="Starters Event Time" value="Text here" />
          <InfoRow label="Starters Placement" value="Text here" /> */}

          <div className="flex flex-row gap-6 text-xl font-medium text-[#1A1A1A]">
            <p className="text-xl font-medium text-[#1A1A1A]">
            Event Start Time
            </p>
            :
            <p className="text-xl font-medium text-[#888888]">
              Some text
            </p>
          </div>
          <div className="flex flex-row gap-6 text-xl font-medium text-[#1A1A1A]">
            <p className="text-xl font-medium text-[#1A1A1A]">
            Event End Time
            </p>
            :
            <p className="text-xl font-medium text-[#888888]">
              Some text
            </p>
          </div>
          <div className="flex flex-row gap-6 text-xl font-medium text-[#1A1A1A]">
            <p className="text-xl font-medium text-[#1A1A1A]">
            BTR
            </p>
            :
            <p className="text-xl font-medium text-[#888888]">
            Some text
            </p>
          </div>
          <div className="flex flex-row gap-6 text-xl font-medium text-[#1A1A1A]">
            <p className="text-xl font-medium text-[#1A1A1A]">
            Venue
            </p>
            :
            <p className="text-xl font-medium text-[#888888]">
            Some text
            </p>
          </div>
          <div className="flex flex-row gap-6 text-xl font-medium text-[#1A1A1A]">
            <p className="text-xl font-medium text-[#1A1A1A]">
            Setup
            </p>
            :
            <p className="text-xl font-medium text-[#888888]">
            Some text
            </p>
          </div>
          <div className="flex flex-row gap-6 text-xl font-medium text-[#1A1A1A]">
            <p className="text-xl font-medium text-[#1A1A1A]">
            A/V Vendor Name
            </p>
            :
            <p className="text-xl font-medium text-[#888888]">
            Some text
            </p>
          </div>
          <div className="flex flex-row gap-6 text-xl font-medium text-[#1A1A1A]">
            <p className="text-xl font-medium text-[#1A1A1A]">
            Linear Order
            </p>
            :
            <p className="text-xl font-medium text-[#888888]">
            Some text
            </p>
          </div>
          <div className="flex flex-row gap-6 text-xl font-medium text-[#1A1A1A]">
            <p className="text-xl font-medium text-[#1A1A1A]">
            Exp Number of Seating
            </p>
            :
            <p className="text-xl font-medium text-[#888888]">
            Some text
            </p>
          </div>
          <div className="flex flex-row gap-6 text-xl font-medium text-[#1A1A1A]">
            <p className="text-xl font-medium text-[#1A1A1A]">
            Starters Event Time
            </p>
            :
            <p className="text-xl font-medium text-[#888888]">
              some text
            </p>
          </div>
          <div className="flex flex-row gap-6 text-xl font-medium text-[#1A1A1A]">
            <p className="text-xl font-medium text-[#1A1A1A]">
            Starters Placements
            </p>
            :
            <p className="text-xl font-medium text-[#888888]">
              some text
            </p>
          </div>
        </section>

        <section>
          <h4 className="text-lg font-medium text-[#1a1a1a]">Menu Selection</h4>
          <DataTable data={["Veg", "Non-Veg"]} />
        </section>

        <section>
        <h4 className="text-lg font-medium text-[#1a1a1a]">Audio / Visuals</h4>
          <DataTable data={["Text here", "Text here"]} />
        </section>

        <section>
        <h4 className="text-lg font-medium text-[#1a1a1a]">Event Flow</h4>
          <DataTable data={["Text here", "Text here"]} />
        </section>

        <section>
        <h4 className="text-lg font-medium text-[#1a1a1a]">Checklist</h4>
          <DataTable
            data={[
              "Call A/V coordinator 3 hours before event time",
              "Check BTR on all display",
              "Inform Hotel Front Row about Client's Company Name",
              "Check A/V as per requirement",
              "Check Linen and setup as per requirement",
            ]}
          />
        </section>
      </div>
    </div>
  );
}

// function InfoRow({ label, value }) {
//   return (
//     <div className="flex justify-between border-b py-2">
//       <span className="text-gray-600 font-medium">{label}</span>
//       <span className="text-gray-800">{value}</span>
//     </div>
//   );
// }

// function Section({ title, children }) {
//   return (
//     <div className="mb-6">
//       <h2 className="bg-blue-900 text-white py-2 px-4 rounded-t-md">{title}</h2>
//       <div className="border border-t-0 border-gray-300 rounded-b-md p-4 bg-white">
//         {children}
//       </div>
//     </div>
//   );
// }

function DataTable( {data} ) {
  return (
    <table className="w-full text-left mt-3">
      <thead className="bg-[#0B2F46] rounded-t-md flex flex-row justify-between w-full">
        <tr className="flex flex-row justify-between w-full flex-wrap">
          <th className="py-4 px-5 text-base font-bold text-white w-[12%]">
            Sr. No.
          </th>
          <th className="py-4 px-5 text-base font-bold text-white w-[63%]">
            Details
          </th>
          <th className="py-4 px-5 text-base font-bold text-white w-[25%] text-right">
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((item : any, index : any) => (
          <tr
            key={index}
            className="w-full border border-[#D1D1D1] flex flex-row justify-between"
          >
            <td className="py-4 px-5 text-sm font-medium text-[#555555] w-[12%]">
              {index + 1}
            </td>
            <td className="py-4 px-5 text-sm font-medium text-[#555555] w-[63%]">
              {item}
            </td>
            <td className="py-4 px-5 text-sm font-medium text-[#555555] w-[25%] text-right">
              <input type="text" className="border rounded p-1 " />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ConfirmedQuotesView;
