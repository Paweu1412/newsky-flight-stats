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
  { field: 'dep.icao', headerName: 'Departure', width: 120, editable: false, valueGetter: (params) => params.row.dep.icao },
  { field: 'arr.icao', headerName: 'Arrival', width: 110, editable: false, valueGetter: (params) => params.row.arr.icao },
  { field: 'depTimeAct', headerName: 'In air', width: 100, editable: false, 
    valueGetter: (params) => {
      const depTimeAct = new Date(params.row.depTimeAct);
      const currentTime = new Date();
      const diffInMinutes = Math.round((currentTime - depTimeAct) / (1000 * 60));
      return diffInMinutes + ' min';
    } 
  },
  { field: 'aircraft.airframe.name', headerName: 'Aircraft', width: 190, editable: false, valueGetter: (params) => params.row.aircraft.airframe.name },
  { field: 'simulator', headerName: 'Simulator', width: 110, editable: false, valueGetter: (params) => params.row.simulator.toUpperCase() },
  { field: 'network.name', headerName: 'Network', width: 110, editable: false, valueGetter: (params) => (params.row.network?.name || '-').toUpperCase() },
  { field: 'emergency', headerName: 'EMG', width: 90, editable: false, valueGetter: (params) => (params.row.emergency === true ? '<p style="color: red">YES</p>' : '-') }
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
        let data = await response.json();
        data = data.results.map((flight, index) => ({ ...flight, id: index }));

        setAllFlights(data);
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
        {allFlights.length > 0 && (
          <DataGrid
            rows={allFlights}
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
            disableSelectionOnClick
          />
        )}
      </div>
    </div>
  );
};

export default Ongoing;
