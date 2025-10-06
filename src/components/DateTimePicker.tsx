import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DateTimePickerProps {
  value?: string;
  onChange: (date: string) => void;
}

export const DateTimePicker = ({ value, onChange }: DateTimePickerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    value ? new Date(value) : undefined,
  );
  const [time, setTime] = useState<string>(
    value ? format(new Date(value), "HH:mm") : "12:00",
  );

  useEffect(() => {
    if (value) {
      const date = new Date(value);
      setSelectedDate(date);
      setTime(format(date, "HH:mm"));
    }
  }, [value]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      updateDateTime(date, time);
    }
  };

  const handleTimeChange = (newTime: string) => {
    setTime(newTime);
    if (selectedDate) {
      updateDateTime(selectedDate, newTime);
    }
  };

  const updateDateTime = (date: Date, timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    onChange(newDate.toISOString());
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? (
            <span>
              {format(selectedDate, "PPP")} at {time}
            </span>
          ) : (
            <span>Pick a date and time</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          initialFocus
          className="pointer-events-auto"
        />
        <div className="p-3 border-t border-border">
          <Label htmlFor="time" className="text-sm mb-2 block">
            Time
          </Label>
          <Input
            id="time"
            type="time"
            value={time}
            onChange={(e) => handleTimeChange(e.target.value)}
            className="w-full"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};
