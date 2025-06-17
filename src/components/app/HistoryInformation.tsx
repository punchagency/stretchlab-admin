import type { BookingType } from "@/types/shared";
import { Fragment } from "react/jsx-runtime";

export const HistoryInformation = ({ data }: { data: BookingType }) => {
  if (!data) return null;

  const statuses: Record<string, string> = {
    completed: "Completed",
    "no show": "No Show",
    "log the booking status": "Not Logged",
    "send the booking status": "Not Sent",
  };
  const badgeColor = {
    completed: "bg-[#E7F6EC] text-[#036B26]",
    "no show": "bg-[#FBEAE9] text-[#9E0A05]",
    "log the booking status": "bg-[#FEF6E7] text-[#865503]",
    "send the booking status": "bg-[#FEF6E7] text-[#865503]",
  } as const;

  const matchedStatus = Object.keys(statuses).find((key) =>
    data?.status.toLowerCase().includes(key)
  );
  return (
    <div className="">
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
        <div className="border border-grey-3 rounded-xl md:rounded-3xl p-2 md:p-7  w-full md:w-1/2">
          <h2 className="text-dark-1 mt-2 md:mt-0 font-semibold text-2xl">
            {data?.client_name}
          </h2>
          <div className="grid grid-cols-2 gap-4 mt-6 md:mt-10">
            <div>
              <h3 className="text-[#344054] font-semibold text-lg">
                Booking ID
              </h3>
              <p className="text-dark-1 text-base">{data?.booking_id}</p>
            </div>
            <div>
              <h3 className="text-[#344054] font-semibold text-lg">Location</h3>
              <p className="text-dark-1 text-base">{data?.location}</p>
            </div>
            <div>
              <h3 className="text-[#344054] font-semibold text-lg">
                Member Rep Name
              </h3>
              <p className="text-dark-1 text-base">
                {data?.member_rep_name || "-"}
              </p>
            </div>
            <div>
              <h3 className="text-[#344054] font-semibold text-lg">
                First Time
              </h3>
              <p className="text-dark-1 text-base">{data?.first_timer}</p>
            </div>
            <div>
              <h3 className="text-[#344054] font-semibold text-lg">
                Unpaid Booking
              </h3>
              <p className="text-dark-1 text-base">{data?.unpaid_booking}</p>
            </div>
            <div>
              <h3 className="text-[#344054] font-semibold text-lg">
                Workout Type
              </h3>
              <p className="text-dark-1 text-base">{data?.workout_type}</p>
            </div>
            <div>
              <h3 className="text-[#344054] font-semibold text-lg">Status</h3>
              <div
                className={`${
                  badgeColor[matchedStatus as keyof typeof badgeColor]
                } px-2 py-1.5 rounded-2xl w-28 text-center font-medium`}
              >
                {statuses[matchedStatus as keyof typeof statuses]}
              </div>
            </div>
            <div>
              <h3 className="text-[#344054] font-semibold text-lg">
                Flexologist Name
              </h3>
              <p className="text-dark-1 text-base">{data?.flexologist_name}</p>
            </div>
          </div>
        </div>
        <div className="border border-grey-3 rounded-xl md:rounded-3xl p-2 md:p-7  w-full md:w-1/2">
          <h2 className="text-dark-1 font-semibold text-xl">Booking Details</h2>
          <div className="grid grid-cols-2 gap-4 mt-10">
            <div>
              <h3 className="text-[#344054] font-semibold text-lg">
                Appointment Date
              </h3>
              <p className="text-dark-1 text-base">{data?.appointment_date}</p>
            </div>
            <div>
              <h3 className="text-[#344054] font-semibold text-lg">
                Booked On Date
              </h3>
              <p className="text-dark-1 text-base">{data?.booked_on_date}</p>
            </div>

            <div>
              <h3 className="text-[#344054] font-semibold text-lg">
                Note Score
              </h3>
              <p className="text-dark-1 text-base">{data?.note_score}</p>
            </div>
            <div>
              <h3 className="text-[#344054] font-semibold text-lg">
                Pre Visit Preparation Rubric Score
              </h3>
              <p className="text-dark-1 text-base">
                {data?.pre_visit_preparation_rubric}
              </p>
            </div>
            <div>
              <h3 className="text-[#344054] font-semibold text-lg">
                Session Notes Rubric Score
              </h3>
              <p className="text-dark-1 text-base">
                {data?.session_notes_rubric}
              </p>
            </div>
            <div>
              <h3 className="text-[#344054] font-semibold text-lg">
                Missed Sale Follow Up Rubric Score
              </h3>
              <p className="text-dark-1 text-base">
                {data?.missed_sale_follow_up_rubric}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 md:mt-10 border border-grey-3 rounded-xl md:rounded-3xl p-2 md:p-7">
        <h3 className="text-dark-1 font-semibold text-2xl">
          Notes and Analysis
        </h3>
        <div className="flex flex-col gap-7 mt-10">
          {data?.note_oppurtunities && (
            <div>
              <h3 className="text-[#344054] font-semibold text-lg">
                Note Oppurtunities
              </h3>
              {JSON.parse(data?.note_oppurtunities as string).length > 0 ? (
                <div className="flex items center gap-2 mt-2">
                  {JSON.parse(data?.note_oppurtunities as string).map(
                    (item: string, index: number) => (
                      <div
                        className={`rounded-md font-semibold text-sm px-3 py-2 ${
                          item.toLowerCase().includes("need")
                            ? "bg-blue-500 text-white"
                            : item.toLowerCase().includes("session")
                            ? "bg-green-500 text-white"
                            : item.toLowerCase().includes("post")
                            ? "bg-orange-500 text-white"
                            : "bg-purple-500 text-white"
                        }`}
                        key={index}
                      >
                        {item}
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="text-dark-1 text-base mt-2">N/A</p>
              )}
            </div>
          )}
          <div>
            <h3 className="text-[#344054] font-semibold text-lg">Key Note</h3>
            <p className="text-dark-1 text-base mt-2">
              {data?.key_note.trim() === "" ? "N/A" : data?.key_note}
            </p>
          </div>
          <div>
            <h3 className="text-[#344054] font-semibold text-lg">
              Note Summary
            </h3>
            <p className="text-dark-1 text-base mt-2">{data?.note_summary}</p>
          </div>
          <div>
            <h3 className="text-[#344054] font-semibold text-lg">
              Note Analysis Improvements
            </h3>
            <p className="text-dark-1 text-base mt-2">
              {data?.note_analysis_improvements
                ? data?.note_analysis_improvements
                    .split("\n\n")
                    .map((line, index) => (
                      <Fragment key={index}>
                        - {line}
                        <br />
                        <br />
                      </Fragment>
                    ))
                : "N/A"}
            </p>
          </div>
          <div>
            <h3 className="text-[#344054] font-semibold text-lg">
              Note Analysis Progressive Moments
            </h3>
            <p className="text-dark-1 text-base mt-2">
              {data?.note_analysis_progressive_moments
                ? data?.note_analysis_progressive_moments
                    .split("\n\n")
                    .map((line, index) => (
                      <Fragment key={index}>
                        - {line}
                        <br />
                        <br />
                      </Fragment>
                    ))
                : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
