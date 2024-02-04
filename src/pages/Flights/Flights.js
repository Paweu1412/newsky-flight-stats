import { useState, useEffect } from 'react';
import { Button, Stack, FormControl, FormControlLabel, Checkbox, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/en-gb';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const columns = [
  { field: 'pilot', headerName: 'Pilot', width: 150, editable: false, 
    renderCell: (params) => (
      <div className="flex items-center">
        <img 
          src={`https://newsky.app/api/pilot/avatar/${params.row.pilot.avatar}`}
          alt={params.row.pilot.avatar} 
          className="rounded-full mr-2 w-8 h-8"
        />
        {params.row.pilot.fullname.split(' ')[0]}
      </div>
    ), 
  },
  { field: 'dep.icao', headerName: 'Departure', width: 120, editable: false, valueGetter: (params) => params.row.dep.icao },
  { field: 'depTimeAct', headerName: 'Departure Time', width: 150, editable: false, valueGetter: (params) => new Date(params.row.depTimeAct).toLocaleString() },
  { field: 'arr.icao', headerName: 'Arrival', width: 110, editable: false, valueGetter: (params) => params.row.arr.icao },
  { field: 'arrTimeAct', headerName: 'Arrival Time', width: 150, editable: false, valueGetter: (params) => new Date(params.row.arrTimeAct).toLocaleString() },
  { field: 'aircraft.airframe.name', headerName: 'Aircraft', width: 190, editable: false, valueGetter: (params) => params.row.aircraft.airframe.name },
  { field: 'result.totals.distance', headerName: 'Distance', width: 110, editable: false, valueGetter: (params) => params.row.result.totals.distance + ' nm'},
  { field: 'result.totals.time', headerName: 'Duration', width: 110, editable: false, valueGetter: (params) => params.row.result.totals.time + ' min' },
  { field: 'simulator', headerName: 'Simulator', width: 110, editable: false, valueGetter: (params) => params.row.simulator.toUpperCase() },
  { field: 'network.name', headerName: 'Network', width: 110, editable: false, valueGetter: (params) => (params.row.network?.name || '-').toUpperCase() },
];

const Flights = () => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [allFlights, setAllFlights] = useState([]);
  const [displayedFlights, setDisplayedFlights] = useState([]);
  const [showOnlyVatsimFlights, setShowOnlyVatsimFlights] = useState(false);
  const [errorAlert, setErrorAlert] = useState(null);

  const fetchFlights = async () => {
    setErrorAlert(null);

    if (!fromDate || !toDate) {
      setErrorAlert('Please select both dates.');
      return;
    }

    const url = 'https://newsky.app/api/airline-api/flights/bydate';
    const token = process.env.REACT_APP_TOKEN;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ start: fromDate.toISOString(), end: toDate.toISOString() }),
      });

      if (response.ok) {
        let data = await response.json();
        data = data.results.map((flight, index) => ({ ...flight, id: index }));

        setAllFlights(data);
        setDisplayedFlights(showOnlyVatsimFlights ? data.filter((flight) => flight.network?.name === 'vatsim') : data);
      } else if (response.status === 429) {
        setErrorAlert('Too many requests. Please try again later.');
      } else {
        console.error('Failed to fetch flights');
      }
    } catch (error) {
      console.error('Error fetching flights', error);
      setErrorAlert('An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    const filterFlights = () => {
      setDisplayedFlights(showOnlyVatsimFlights ? allFlights.filter((flight) => flight.network?.name === 'vatsim') : allFlights);
    };

    filterFlights();
  }, [showOnlyVatsimFlights, allFlights]);

  const handleCheckFlights = () => {
    fetchFlights();
  };

  const handleCheckboxChange = (event) => {
    setShowOnlyVatsimFlights(event.target.checked);
  };

  return (
    <div className="Dashboard flex justify-center">
      <div className="container w-full xl:w-max p-2 flex flex-col items-center">
        <div className="date-placeholders pt-5">
          <Stack spacing={2} direction={{ base: 'column', lg: 'row' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
              <DemoContainer components={['DatePicker']}>
                <DatePicker onChange={(value) => setFromDate(value)} label="From" />
              </DemoContainer>
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
              <DemoContainer components={['DatePicker']}>
                <DatePicker onChange={(value) => {
                  let dateWithOneDayAdded = new Date(value);
                  dateWithOneDayAdded.setDate(dateWithOneDayAdded.getDate() + 1);

                  setToDate(dateWithOneDayAdded);
                }} label="To" />
              </DemoContainer>
            </LocalizationProvider>
          </Stack>

          <FormControl className="mt-2">
            <FormControlLabel control={<Checkbox />} label="Show only VATSIM flights" onChange={handleCheckboxChange} />
          </FormControl>

          <Button variant="contained" className="w-full bg-second mt-2" onClick={handleCheckFlights}>
            CHECK FLIGHTS
          </Button>

          {errorAlert && <Alert severity="error" className="mt-5">{errorAlert}</Alert>}

          {displayedFlights.length === 0 && !errorAlert && (
            <Alert severity="info" className="mt-5">
              Click on <b>CHECK FLIGHTS</b> to see the results
            </Alert>
          )}

          <Alert severity="warning" className="mt-5">
            Maximum 500 flights will be shown
          </Alert>
        </div>

        <div className="flights-table w-full mt-5 overflow-x-auto">
          {displayedFlights.length > 0 && (
            <DataGrid
              rows={displayedFlights}
              columns={columns}
              autoHeight
              pagination
              pageSize={25}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              pageSizeOptions={[10, 25, 50, 100]}
              disableSelectionOnClick
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Flights;