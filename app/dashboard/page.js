"use client";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { Button, Stack } from '@mui/material';
import { useState } from 'react';

import { toTimestamp } from '../utils/utils';

export default function Dashboard() {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const handleOnChange = (key, value) => {
    if (key === 'fromDate') {
      setFromDate(value);
    } else if (key === 'toDate') {
      setToDate(value);
    }
  }

  return (
    <div className="Dashboard flex justify-center">
      <div className="container w-[900px] flex justify-center">
        <div className="date-placeholders pt-5">
          <Stack spacing={2} direction="row">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']}>
                <DatePicker onChange={(value) => {handleOnChange('fromDate', toTimestamp(value))}} label="From" />
              </DemoContainer>
            </LocalizationProvider>
          
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']}>
                <DatePicker onChange={(value) => {handleOnChange('toDate', toTimestamp(value))}} label="To" />
              </DemoContainer>
            </LocalizationProvider>
          </Stack>
          
          <Button variant="contained" className="mt-5 w-[100%] bg-second" onClick={() => console.log(fromDate, toDate)}>test</Button>
        </div>
      </div>
    </div>
  );
}