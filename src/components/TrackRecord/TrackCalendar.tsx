import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useReplayStore} from '../../helpers/useReplayStore';

export default function TrackCalendar() {
  const selectedDate = useReplayStore((state) => state.selectedDate);
  const setSelectedDate = useReplayStore((state) => state.setSelectedDate);
  const handleDateChange = (newValue: Dayjs | null) => {
    setSelectedDate(newValue ? newValue.toDate() : null);
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Select Date"
        value={selectedDate ? dayjs(selectedDate) : null}
        onChange={handleDateChange}
        minDate={dayjs('2024-01-01')}
        maxDate={dayjs()}
      />
    </LocalizationProvider>
  );
}