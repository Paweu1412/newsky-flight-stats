"use client";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { Button, Stack } from '@mui/material';

export default function Dashboard() {
  return (
    <div className="Dashboard flex justify-center">
      <div className="container w-[900px] flex justify-center">
        <div className="date-placeholders pt-5 w-[600px]">
          <Stack spacing={2} direction="row">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']}>
                <DatePicker label="From" />
              </DemoContainer>
            </LocalizationProvider>
          
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']}>
                <DatePicker label="To" />
              </DemoContainer>
            </LocalizationProvider>

            <Button 
              variant="contained" 
              color="primary" 
              style={{
                height: '90%',
              }}
            >
              Wyszukaj
            </Button>
          </Stack>
        </div>
      </div>
    </div>
  );
}