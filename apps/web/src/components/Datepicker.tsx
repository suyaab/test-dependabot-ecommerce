import React, { useEffect, useState } from "react";

interface DatePickerProps {
  selectedDate?: Date;
  onDateChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}

const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onDateChange,
  minDate,
  maxDate,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [days, setDays] = useState<Date[]>([]);

  useEffect(() => {
    generateDays(currentMonth);
  }, [currentMonth]);

  const generateDays = (date: Date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const daysArray = [];
    for (let day = start; day <= end; day.setDate(day.getDate() + 1)) {
      daysArray.push(new Date(day));
    }
    setDays(daysArray);
  };

  const handleDateClick = (date: Date) => {
    if (minDate != null && date < minDate) {
      return;
    }

    if (maxDate != null && date > maxDate) {
      return;
    }

    onDateChange(date);
  };

  const isDayDisabled = (date: Date) => {
    const isBefore = minDate != null && date < minDate;
    const isAfter = maxDate != null && date > maxDate;

    return isBefore || isAfter;
  };

  return (
    <div className="z-50 rounded border border-gray-300 bg-white p-4 shadow-lg">
      <div className="calendar">
        <div className="header mb-4 flex items-center justify-between">
          <button
            onClick={() =>
              setCurrentMonth(
                new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)),
              )
            }
            className="rounded bg-gray-200 px-2 py-1 text-gray-700 hover:bg-gray-300"
          >
            {"<"}
          </button>

          <span className="font-semibold text-lg text-gray-800">
            {currentMonth.toLocaleDateString("default", {
              month: "long",
              year: "numeric",
            })}
          </span>

          <button
            onClick={() =>
              setCurrentMonth(
                new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)),
              )
            }
            className="rounded bg-gray-200 px-2 py-1 text-gray-700 hover:bg-gray-300"
          >
            {">"}
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center font-semibold text-gray-600">
              {day}
            </div>
          ))}

          {days.map((day) => (
            <button
              key={day.toString()}
              onClick={() => handleDateClick(day)}
              disabled={isDayDisabled(day)}
              className={`day rounded p-2 text-center ${
                isDayDisabled(day)
                  ? "cursor-not-allowed bg-gray-100 text-gray-400"
                  : "bg-white text-gray-800 hover:bg-gray-200"
              } ${
                selectedDate &&
                selectedDate.toDateString() === day.toDateString()
                  ? "border-2 border-gray-500"
                  : "border-2 border-transparent"
              }`}
            >
              {day.getDate()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
