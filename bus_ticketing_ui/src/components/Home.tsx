import React, { useContext, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import ResponsiveAppBar from "./ResponsiveAppBar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  Card,
  TextField,
  Autocomplete,
} from "@mui/material";
import axios from "axios";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

const HomeContext = React.createContext({
  numberOfPassengers: 1,
  setNumberOfPassengers: (value: number) => {},
});

function AvailableBuses({ data }: { data: any }): JSX.Element {
  data = data.sort((a: any, b: any) => {
    return (
      new Date(a.departure_time).getTime() -
      new Date(b.departure_time).getTime()
    );
  });
  const { numberOfPassengers } = useContext(HomeContext);

  return (
    <div>
      <div>
        {data.map((bus: any, i: number) => (
          <div className="m-8 rounded-lg p-4 shadow-md" key={i.toString()}>
            <h1 className="text-2xl text-gray-800 font-lato">
              {bus.bus_route.bus.name}
            </h1>
            <div className="grid grid-cols-9 mt-3">
              <div className="col-span-6">
                <div className="flex items-center justify-center gap-8">
                  <p className="font-semibold">
                    {new Date(bus.departure_time).toLocaleTimeString()}
                    <br />
                    {new Date(bus.departure_time).toLocaleDateString()}
                  </p>
                  <span className="h-0 grow border"></span>
                  <p className="text-gray-500">
                    {bus.bus_route.duration} hours
                  </p>
                  <span className="h-0 grow border"></span>
                  <p className="font-semibold">
                    {new Date(bus.arrival_time).toLocaleTimeString()}
                    <br />
                    {new Date(bus.arrival_time).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-8">
                  <p className="text-2xl text-gray-600">
                    {bus.bus_route.route.source.name}
                  </p>
                  <span className="h-0 grow"></span>
                  <p className="text-2xl text-gray-600">
                    {bus.bus_route.route.destination.name}
                  </p>
                </div>
              </div>
              <div className="col-span-3 flex items-center justify-center gap-8">
                <span className="text-3xl">
                  ${bus.bus_route.price}
                  <h6 className="text-sm text-gray-400">per person</h6>
                </span>
              </div>
            </div>
            <div className="flex mt-4">
              <Link
                to="../checkout"
                state={{ routeId: bus.pk, passengerCount: numberOfPassengers }}
                className="bg-blue-200 rounded px-4 py-3 font-semibold text-blue-600 text-xl ml-auto"
              >
                <button>Continue</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BookingContainer(): JSX.Element {
  const [bookingType, setBookingType] = React.useState("one_way");
  const [places, setPlaces] = React.useState([]);
  const [fromPlaceQuery, setFromPlaceQuery] = React.useState("");
  const [toPlaceQuery, setToPlaceQuery] = React.useState("");

  const [fromDate, setFromDate] = React.useState<Dayjs>(dayjs(new Date()));

  const [toDate, setToDate] = React.useState<Dayjs>(
    dayjs(new Date()).add(2, "day")
  );

  const { numberOfPassengers, setNumberOfPassengers } = useContext(HomeContext);

  const [availableBuses, setAvailableBuses] = React.useState([]);

  const handleFromDateChange = (newValue: Dayjs | null): void => {
    setFromDate(newValue as Dayjs);
  };

  const handleToDateChange = (newValue: Dayjs | null): void => {
    setToDate(newValue as Dayjs);
  };

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const result = await axios(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `${process.env.REACT_APP_API_ENDPOINT}places/`
      );
      const data = result.data?.map((place: any) => {
        return {
          label: place.name,
          value: place.name,
        };
      });
      setPlaces(data);
    };

    if (places.length === 0) {
      void fetchData().then().catch();
    }
  }, []);

  const handleSearch = (
    _: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    const params = new URLSearchParams({
      source: fromPlaceQuery,
      destination: toPlaceQuery,
      departure_date: fromDate.toDate().toISOString().slice(0, 10),
      arrival_date: new Date(fromDate?.toDate().getTime() + 3 * 86400000)
        .toISOString()
        .slice(0, 10),
    }).toString();

    axios
      .get(
        `${process.env.REACT_APP_API_ENDPOINT}schedules/search/?${params}`,
        {}
      )
      .then((data) => {
        console.log(data);
        setAvailableBuses(data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <Card className="bg-white opacity-100 p-8">
        {/* Booking Type */}
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={bookingType}
            onChange={(event, value) => setBookingType(value)}
            row
          >
            <FormControlLabel
              value="one_way"
              control={<Radio />}
              label="One Way"
            />
            <FormControlLabel
              value="round_trip"
              control={<Radio />}
              label="Round Trip"
            />
          </RadioGroup>
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="flex mt-8 gap-4">
            <Autocomplete
              id="combo-box-demo"
              options={places}
              isOptionEqualToValue={(option: any, value: any) =>
                option.value === value.value
              }
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="From" />}
              onInputChange={(event, value) => setFromPlaceQuery(value)}
            />
            <Autocomplete
              id="combo-box-demo"
              options={places}
              sx={{ width: 300 }}
              isOptionEqualToValue={(option: any, value: any) =>
                option.value === value.value
              }
              renderInput={(params) => <TextField {...params} label="To" />}
              onInputChange={(event, value) => setToPlaceQuery(value)}
            />
            <DatePicker
              label="Departure Date"
              value={fromDate}
              onChange={handleFromDateChange}
              renderInput={(params) => <TextField {...params} />}
            />
            {bookingType === "round_trip" && (
              <DatePicker
                label="Return Date"
                value={toDate}
                onChange={handleToDateChange}
                renderInput={(params) => <TextField {...params} />}
              />
            )}
            <TextField
              id="outlined-number"
              label="Number of Passengers"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              onChange={(event) =>
                setNumberOfPassengers(Number(event.target.value))
              }
              value={numberOfPassengers}
            />
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </LocalizationProvider>
      </Card>
      {availableBuses.length > 0 && <AvailableBuses data={availableBuses} />}
    </div>
  );
}

function Home(): JSX.Element {
  const [numberOfPassengers, setNumberOfPassengers] = React.useState(1);

  return (
    <HomeContext.Provider value={{ numberOfPassengers, setNumberOfPassengers }}>
      <div className="relative">
        <ResponsiveAppBar />
        <div className="flex justify-center mt-8">
          <BookingContainer />
        </div>
      </div>
    </HomeContext.Provider>
  );
}

export default Home;
