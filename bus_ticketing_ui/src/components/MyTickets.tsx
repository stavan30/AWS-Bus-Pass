import ResponsiveAppBar from "./ResponsiveAppBar";
import React, { useEffect } from "react";
import axios from "axios";

function MyTickets(): JSX.Element {
  const [tickets, setTickets] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    if (tickets.length === 0) {
      axios
        .get(`${process.env.REACT_APP_API_ENDPOINT}tickets/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          setIsLoading(false);
          setTickets(res.data);
        })
        .catch((err) => {
          setIsLoading(false);
          console.log(err);
        });
    }
  });

  return (
    <div>
      <ResponsiveAppBar />
      {/*  UI to display ticket information */}
      <div>
        <h1 className="text-xl text-center mt-8 font-semibold">My Tickets</h1>
        <div className="relative grid grid-cols-3 gap-4 overflow-hidden py-6 sm:py-12">
          {tickets.length > 0 &&
            tickets.map((ticket: any, index) => (
              <div
                className="col-span-1 relative flex flex-col gap-4 bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10"
                key={index.toString()}
              >
                <div className="flex gap-4 items-center">
                  <div className="text-lg font-medium">
                    {/* to 12 Aug 2022 date format */}
                    {new Date(ticket?.route?.departure_time).toLocaleDateString(
                      "en-US",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </div>
                  <div className="text-2xl ml-auto text-gray-500 font-bold">
                    ${ticket.price}
                  </div>
                </div>
                <div className="flex gap-4 justify-center items-center">
                  <div className="flex flex-col">
                    <div className="text-xl">
                      {ticket?.route?.bus_route?.route?.source?.name}
                    </div>
                    <div className="font-light">
                      {new Date(
                        ticket?.route?.departure_time
                      ).toLocaleTimeString()}
                    </div>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                    />
                  </svg>
                  <div className="flex flex-col items-end">
                    <div className="text-xl">
                      {ticket?.route?.bus_route?.route?.destination?.name}
                    </div>
                    <div className="font-light">
                      {new Date(
                        ticket?.route?.arrival_time
                      ).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  {ticket?.passengers?.map((passenger: any, p: number) => (
                    <div
                      className="flex items-center gap-8 justify-evenly"
                      key={p.toString()}
                    >
                      <div className="w-[20px]">{p + 1}.</div>
                      <div className="w-[160px]">
                        {passenger.first_name} {passenger.last_name}
                      </div>
                      <div className="w-[80px]">
                        Seat: {passenger.seat_number}
                      </div>
                    </div>
                  ))}
                </div>
                <a
                  href={`${process.env.REACT_APP_API_ENDPOINT}download/ticket?ticket_id=${ticket.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-center text-blue-500 hover:text-blue-600"
                >
                  Download Ticket
                </a>
              </div>
            ))}
          {tickets.length === 0 && !isLoading && (
            <div className="col-span-1 relative flex flex-col gap-4 bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10">
              <div className="text-center text-gray-500">
                You have no tickets
              </div>
            </div>
          )}
          {isLoading && (
            <div className="col-span-1 col-start-2">
              <div className="text-center text-gray-500">Loading...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyTickets;
