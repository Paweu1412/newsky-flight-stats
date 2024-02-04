"use client";

import { useState } from 'react';
import { Button, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
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
  { field: 'dep.icao', headerName: 'Departure', width: 100, editable: false, valueGetter: (params) => params.row.dep.icao },
  { field: 'arr.icao', headerName: 'Arrival', width: 100, editable: false, valueGetter: (params) => params.row.arr.icao },
  { field: 'aircraft.airframe.name', headerName: 'Aircraft', width: 150, editable: false, valueGetter: (params) => params.row.aircraft.airframe.name },
  { field: 'result.totals.distance', headerName: 'Distance', width: 100, editable: false, valueGetter: (params) => params.row.result.totals.distance + ' nm'},
  { field: 'result.totals.time', headerName: 'Duration', width: 100, editable: false, valueGetter: (params) => params.row.result.totals.time + ' min' },
  { field: 'simulator', headerName: 'Simulator', width: 100, editable: false, valueGetter: (params) => params.row.simulator.toUpperCase() },
  { field: 'network.name', headerName: 'Network', width: 100, editable: false, valueGetter: (params) => (params.row.network?.name || '-').toUpperCase() },
];

export default function Dashboard() {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [flights, setFlights] = useState([]);

  const fetchFlights = async () => {
    const url = 'https://newsky.app/api/airline-api/flights/bydate';
    const token = process.env.NEXT_PUBLIC_TOKEN;
  
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
  
        setFlights(data);
      } else {
        console.error('Failed to fetch flights');
      }
    } catch (error) {
      console.error('Error fetching flights', error);
    }
  };  

  const handleCheckFlights = () => {
    fetchFlights();
  };

  return (
    <div className="Dashboard flex justify-center">
      <div className="container w-max flex flex-col items-center">
        <div className="date-placeholders pt-5">
          <Stack spacing={2} direction="row">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']}>
                <DatePicker onChange={(value) => setFromDate(value)} label="From" />
              </DemoContainer>
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']}>
                <DatePicker onChange={(value) => setToDate(value)} label="To" />
              </DemoContainer>
            </LocalizationProvider>
          </Stack>

          <label>
          <input
            type="checkbox"
            // checked={onlyVatsim}
            // onChange={() => setOnlyVatsim(!onlyVatsim)}
          />
          Only VATSIM
        </label>

          <Button variant="contained" className="mt-5 w-[100%] bg-second" onClick={handleCheckFlights}>
            CHECK FLIGHTS
          </Button>
        </div>

        <div className="flights-table w-max mt-5">
         {flights.length > 0 &&
            <DataGrid
              rows={flights}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 25, page: 0 },
                },
              }}
            />
          }
        </div>
      </div>
    </div>
  );
}
