import React, { useContext, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card } from "@mui/material";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import ResponsiveAppBar from "./ResponsiveAppBar";
import { PaymentInputsWrapper, usePaymentInputs } from "react-payment-inputs";
import images from "react-payment-inputs/images";
import axios from "axios";
import { TimelineOppositeContent } from "@mui/lab";
import Button from "@mui/material/Button";

export interface ICheckoutContext {
  routeId?: number;
  passengerCount?: number;
  email?: string;
  setEmail?: React.Dispatch<React.SetStateAction<string>>;
  phone?: string;
  setPhone?: React.Dispatch<React.SetStateAction<string>>;
  routeInformation?: any;
  cardInformation?: any;
  setCardInformation?: React.Dispatch<React.SetStateAction<any>>;
  passengers: Array<{ firstName: string; lastName: string }>;
  setPassengers: React.Dispatch<
    React.SetStateAction<Array<{ firstName: string; lastName: string }>>
  >;
  seats: Array<Array<number | string>>;
  setSeats: React.Dispatch<React.SetStateAction<Array<Array<number | string>>>>;
}

const CheckoutContext = React.createContext<ICheckoutContext>({
  routeId: undefined,
  passengerCount: undefined,
  passengers: [],
  setPassengers: () => {},
  seats: [],
  setSeats: () => {},
});

function PassengerDetails(): JSX.Element {
  const { routeId, passengerCount, passengers, setPassengers } =
    React.useContext(CheckoutContext);

  return (
    <Card className="p-4">
      <div className="flex items-center">
        <h1 className="bg-blue-500 h-8 w-8 rounded text-xl font-lato text-white text-center">
          1
        </h1>
        <h2 className="text-xl font-lato ml-4 font-bold">Passenger Details</h2>
      </div>
      <div className="mt-4 flex flex-col gap-4">
        {passengers.map((passenger, i: number) => (
          <div key={i}>
            <h1 className="font-lato font-medium text-lg text-gray-600">
              Passenger {i + 1}
            </h1>
            <div className="flex gap-8">
              <div>
                <label
                  htmlFor="first_name"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  First name
                </label>
                <input
                  type="text"
                  id="first_name"
                  className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                  placeholder="John"
                  required
                  value={passengers[i].firstName}
                  onChange={(e) => {
                    console.log(i);
                    const newPassengers = [...passengers];
                    newPassengers[i] = {
                      firstName: e.target.value,
                      lastName: passengers[i].lastName,
                    };
                    console.log(newPassengers);
                    setPassengers(newPassengers);
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="last_name"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Last name
                </label>
                <input
                  type="text"
                  id="last_name"
                  className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                  placeholder="Doe"
                  required
                  value={passengers[i].lastName}
                  onChange={(e) => {
                    const newPassengers = [...passengers];
                    newPassengers[i] = {
                      lastName: e.target.value,
                      firstName: passengers[i].firstName,
                    };
                    setPassengers(newPassengers);
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function SeatReservation(): JSX.Element {
  const { passengers, seats, setSeats } = useContext(CheckoutContext);
  const passengerSeating = passengers.map(
    (each) => each.firstName[0] + each.lastName[0]
  );

  console.log(passengerSeating);

  const [selectedSeats, setSelectedSeats] = React.useState<number>(0);

  return (
    <Card className="p-4">
      <div className="flex items-center">
        <h1 className="bg-blue-500 h-8 w-8 rounded text-xl font-lato text-white text-center">
          2
        </h1>
        <h2 className="text-xl font-lato ml-4 font-bold">Seat Reservation</h2>
      </div>
      <div className="plane">
        <div className="cockpit">
          <h1>Please select a seat</h1>
        </div>
        <div className="exit exit--front fuselage"></div>
        <ol className="cabin fuselage">
          {seats.map((seat, i) => (
            <li className="row" key={i.toString()}>
              <ol className="seats">
                {seat.map((k, j) => (
                  <li className="seat" key={j.toString()}>
                    <input
                      type="checkbox"
                      disabled={seats[i][j] === "occupied"}
                      id={(4 * i + j + 1).toString()}
                      onClick={(e: React.MouseEvent<HTMLElement>) => {
                        const isChecked = (e.target as HTMLInputElement)
                          .checked;
                        if (isChecked) {
                          const newSeats = [...seats];
                          newSeats[i][j] = passengerSeating[selectedSeats];
                          setSeats(newSeats);
                          setSelectedSeats(selectedSeats + 1);
                        } else {
                          setSelectedSeats(selectedSeats - 1);
                          const newSeats = [...seats];
                          newSeats[i][j] = i * 4 + j + 1;
                          setSeats(newSeats);
                        }
                      }}
                    />
                    <label htmlFor={(4 * i + j + 1).toString()}>
                      {seats[i][j]}
                    </label>
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ol>
        <div className="exit exit--back fuselage"></div>
      </div>
    </Card>
  );
}

function Contact(): JSX.Element {
  const { email, setEmail, phone, setPhone } = useContext(CheckoutContext);
  return (
    <Card className="p-4 ">
      <div className="flex items-center">
        <h1 className="bg-blue-500 h-8 w-8 rounded text-xl font-lato text-white text-center">
          3
        </h1>
        <h2 className="text-xl font-lato ml-4 font-bold">
          Contact Information
        </h2>
      </div>
      <div className="mt-8 flex gap-8">
        <div className="grow">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Email
          </label>
          <input
            type="text"
            id="email"
            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
            placeholder="johndoe@google.com"
            required
            value={email}
            onChange={(e) => {
              setEmail!(e.target.value);
            }}
          />
        </div>
        <div className="grow">
          <label
            htmlFor="phone"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Phone
          </label>
          <input
            type="text"
            id="phone"
            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
            placeholder="+1 123 456 7890"
            required
            value={phone}
            onChange={(e) => {
              setPhone!(e.target.value);
            }}
          />
        </div>
      </div>
    </Card>
  );
}

function Payment(): JSX.Element {
  const {
    wrapperProps,
    getCardImageProps,
    getCardNumberProps,
    getExpiryDateProps,
    getCVCProps,
  } = usePaymentInputs();
  console.log(getCVCProps());
  const { cardInformation, setCardInformation } = useContext(CheckoutContext);
  return (
    <Card className="p-4">
      <div className="flex items-center">
        <h1 className="bg-blue-500 h-8 w-8 rounded text-xl font-lato text-white text-center">
          4
        </h1>
        <h2 className="text-xl font-lato ml-4 font-bold">Payment</h2>
      </div>
      <div className="mt-8">
        <PaymentInputsWrapper {...wrapperProps}>
          <svg {...getCardImageProps({ images: images as any })} />
          <input
            placeholder="Card Holder Name"
            onChange={(e) =>
              setCardInformation!({
                ...cardInformation,
                card_holder_name: e.target.value,
              })
            }
          />
          <input
            {...getCardNumberProps()}
            onChange={(e) => {
              setCardInformation!({
                ...cardInformation,
                card_number: e.target.value,
              });
            }}
          />
          <input
            {...getExpiryDateProps()}
            onChange={(e) =>
              setCardInformation!({
                ...cardInformation,
                card_expiry_date: e.target.value,
              })
            }
          />
          <input
            {...getCVCProps()}
            onChange={(e) =>
              setCardInformation!({
                ...cardInformation,
                card_cvv: e.target.value,
              })
            }
          />
        </PaymentInputsWrapper>
      </div>
    </Card>
  );
}

function Itinerary(): JSX.Element {
  const {
    routeInformation,
    passengers,
    email,
    phone,
    cardInformation,
    seats,
    routeId,
    passengerCount,
  } = useContext(CheckoutContext);
  console.log({ seats });
  const navigate = useNavigate();
  const checkout = (): void => {
    const data = {
      type: "ticket_single",
      price: routeInformation.bus_route.price,
      quantity: passengerCount,
      total: parseFloat(
        String(routeInformation.bus_route.price * passengerCount! + 3.99)
      ).toFixed(2),
      payment: {
        ...cardInformation,
        payment_type: "credit_card",
      },
      route: { ...routeInformation },
      passengers: passengers.map((passenger, i) => ({
        first_name: passenger.firstName,
        last_name: passenger.lastName,
      })),
    };

    console.log({ data });
    axios
      .post(`${process.env.REACT_APP_API_ENDPOINT}checkout/`, data, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        const { passengers, route } = res.data;
        for (let i = 0; i < passengers.length; i++) {
          const {
            pk,
            first_name: firstName,
            last_name: lastName,
          } = passengers[i];
          const seatNumber = seats
            .flat()
            .findIndex((each) => each === firstName[0] + lastName[0]);
          console.log({ seatNumber });
          const seatingData = {
            ticket_passenger: { pk },
            route: { pk: route.pk },
            seat_number: seatNumber + 1,
          };
          axios
            .post(
              `${process.env.REACT_APP_API_ENDPOINT}seating/?${routeId}`,
              seatingData,
              {
                headers: {
                  Authorization: `Token ${localStorage.getItem("token")}`,
                },
              }
            )
            .then((res) => console.log(res.data))
            .catch((err) => console.log(err));
        }
        navigate("../my-tickets");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <h1 className="text-3xl font-lato font-semibold">Booking Details</h1>
      <h1 className="font-semibold text-lg font-lato mt-4">
        {new Date(routeInformation?.departure_time).toLocaleDateString(
          "en-US",
          {
            weekday: "short",
            day: "numeric",
            month: "short",
          }
        )}
      </h1>
      <div>
        <Timeline>
          <TimelineItem>
            <TimelineOppositeContent color="text.secondary">
              {new Date(routeInformation?.departure_time).toLocaleTimeString(
                "en-US",
                {
                  hour: "numeric",
                  minute: "numeric",
                }
              )}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot variant="outlined" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              {routeInformation?.bus_route?.route?.source?.name}
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineOppositeContent color="text.secondary">
              {new Date(routeInformation?.arrival_time).toLocaleTimeString(
                "en-US",
                {
                  hour: "numeric",
                  minute: "numeric",
                }
              )}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot />
            </TimelineSeparator>
            <TimelineContent>
              {routeInformation?.bus_route?.route?.destination?.name}
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </div>
      <div>
        <h1 className="font-light text-2xl font-lato mt-8">Fare</h1>
        <div className="flex items-center gap-4 justify-center">
          <div className="mt-4">
            <h1 className="font-light text-2xl font-lato">
              <span className="font-bold font-lato">
                ${routeInformation?.bus_route?.price}
              </span>{" "}
              x {passengers?.length} passengers
            </h1>
          </div>
          <div className="ml-auto mt-4">
            <h1 className="font-semibold text-2xl font-lato">
              ${routeInformation?.bus_route?.price * passengers?.length}
            </h1>
          </div>
        </div>
        <hr className="my-4" />
        <div className="flex items-center gap-4 justify-center">
          <div className="mt-4">
            <h1 className="font-light text-2xl font-lato">Service Charge</h1>
          </div>
          <div className="mt-4 ml-auto">
            <h1 className="font-semibold text-2xl font-lato">$3.99</h1>
          </div>
        </div>
        <hr className="my-4" />
        <div className="flex items-center gap-4 justify-center">
          <div className="mt-4">
            <h1 className="font-light text-2xl font-lato">Total</h1>
          </div>
          <div className="mt-4 ml-auto">
            <h1 className="font-semibold text-2xl font-lato">
              $
              {(
                routeInformation?.bus_route?.price * passengers?.length +
                3.99
              ).toFixed(2)}
            </h1>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-8">
        <Button
          className=""
          variant="contained"
          color="primary"
          onClick={checkout}
        >
          Make payment & Book Now
        </Button>
      </div>
    </div>
  );
}

function Checkout(): JSX.Element {
  const { state }: { state: ICheckoutContext } = useLocation();
  const { routeId, passengerCount } = state;
  const [routeInformation, setRouteInformation] = React.useState(null);
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [cardInformation, setCardInformation] = React.useState({});
  const [isSeatingLoaded, setIsSeatingLoaded] = React.useState(false);
  const initialSeating: number[][] = new Array([]);
  for (let i = 0; i < 10; i++) {
    initialSeating[i] = [];
    for (let j = 0; j < 4; j++) {
      initialSeating[i].push(i * 4 + j + 1);
    }
  }

  const [seats, setSeats] =
    React.useState<Array<Array<number | string>>>(initialSeating);
  const [passengers, setPassengers] = React.useState<
    Array<{ firstName: string; lastName: string }>
  >(
    Array(passengerCount).fill({
      firstName: "",
      lastName: "",
    })
  );

  useEffect(() => {
    if (Boolean(routeId) && routeInformation === null) {
      axios
        .get(`${process.env.REACT_APP_API_ENDPOINT}schedule/${routeId}/`)
        .then((res) => {
          console.log(res.data);
          setRouteInformation(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  useEffect(() => {
    if (!isSeatingLoaded) {
      void axios
        .get(
          `${process.env.REACT_APP_API_ENDPOINT}seating/?route_id=${routeId}`
        )
        .then((res) => {
          res.data.forEach((seat: any) => {
            const seatNumber = seat.seat_number - 1;
            const newSeats = [...seats];
            const row = Math.floor(seatNumber / 4);
            const column = seatNumber % 4;
            newSeats[row][column] = "occupied";
            setSeats(newSeats);
          });
        })
        .catch(() => {});
      setIsSeatingLoaded(true);
    }
  }, [routeId]);

  return (
    <CheckoutContext.Provider
      value={{
        ...state,
        email,
        setEmail,
        routeInformation,
        phone,
        setPhone,
        passengers,
        setPassengers,
        cardInformation,
        setCardInformation,
        seats,
        setSeats,
      }}
    >
      <div>
        <ResponsiveAppBar />
        <div className="px-24 grid grid-cols-3 mt-16 gap-8 my-8">
          <div className="flex flex-col col-span-2 gap-8">
            <PassengerDetails />
            <SeatReservation />
            <Contact />
            <Payment />
          </div>
          <div className="flex flex-col col-span-1">
            <Itinerary />
          </div>
        </div>
      </div>
    </CheckoutContext.Provider>
  );
}

export default Checkout;

// TODO - Bus Pass - 1 hour
// Save ticket to S3 - 2 hour
// Deployment - 3 hour
// UI Update - 2 hour
