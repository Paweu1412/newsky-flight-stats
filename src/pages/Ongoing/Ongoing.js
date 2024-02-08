import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';

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
  { field: 'airline.icao + flightNumber', headerName: 'C/S', width: 90, editable: false, valueGetter: (params) => params.row.airline.icao + params.row.flightNumber},
  { field: 'dep.icao', headerName: 'Departure', width: 120, editable: false, valueGetter: (params) => params.row.dep.icao },
  { field: 'arr.icao', headerName: 'Arrival', width: 100, editable: false, valueGetter: (params) => params.row.arr.icao },
  { field: 'depTimeAct', headerName: 'In flight', width: 100, editable: false, 
    valueGetter: (params) => {
      if (params.row.depTimeAct === null) {
        return "0h 0min";
      }

      const depTimeAct = new Date(params.row.depTimeAct);
      const currentTime = new Date();
      const diffInMinutes = Math.round((currentTime - depTimeAct) / (1000 * 60));
      const hours = Math.floor(diffInMinutes / 60);
      const minutes = diffInMinutes % 60;

      return `${hours}h ${minutes}min`;
    } 
  },
  { field: 'aircraft.airframe.icao', headerName: 'Aircraft', width: 100, editable: false, valueGetter: (params) => params.row.aircraft.airframe.icao },
  { field: 'network.name', headerName: 'Network', width: 110, editable: false, valueGetter: (params) => (params.row.network?.name || '-').toUpperCase() },
];

const Ongoing = () => {
  const [allFlights, setAllFlights] = useState([]);

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    const url = 'https://newsky.app/api/airline-api/flights/ongoing';
    const token = process.env.REACT_APP_TOKEN;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const results = data.results.map((flight, index) => ({ ...flight, id: index }));

        setAllFlights(results);
      } else if (response.status === 429) {
        console.error('Too many redirects');
      } else {
        console.error('Failed to fetch flights');
      }
    } catch (error) {
      console.error('Error fetching flights', error);
    }
  };

  return (
    <div className="Ongoing flex justify-center">
      <div className="container w-max mt-5 overflow-x-auto p-2 ">
          <DataGrid
            rows={allFlights}
            columns={columns}
            autoHeight
            pagination
            pageSize={25}
            initialState={{
              pagination: {
                pageSize: 10,
              },
            }}
            disableSelectionOnClick
            localeText={{ noRowsLabel: 'No ongoing flights at the moment' }}
          />
      </div>
    </div>
  );
};

export default Ongoing;
