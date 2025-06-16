import axios from "axios";
import { Holiday } from "../types";
import { isAfter, parseISO, isBefore } from "date-fns";

async function getHolidays(startDate: Date, endDate: Date): Promise<Holiday[]> {
  try {
    const years = getYearsInRange(startDate, endDate);
    const allHolidays: Holiday[] = [];

    for (const year of years) {
      const nationalHolidays = await getNationalHolidays(year);
      allHolidays.push(...nationalHolidays);
    }

    const filteredHolidays = allHolidays.filter((holiday) => {
      const holidayDate = parseISO(holiday.date);
      const isInRange =
        !isBefore(holidayDate, startDate) && !isAfter(holidayDate, endDate);

      return isInRange;
    });

    return filteredHolidays;
  } catch (error) {
    return [];
  }
}

async function getNationalHolidays(year: number): Promise<Holiday[]> {
  try {
    const response = await axios.get(
      `https://date.nager.at/api/v3/PublicHolidays/${year}/BR`
    );
    return response.data.map((holiday: any) => ({
      date: holiday.date,
      name: holiday.name,
      type: "national" as const,
    }));
  } catch (error) {
    return [];
  }
}

function getYearsInRange(startDate: Date, endDate: Date): number[] {
  const years: number[] = [];
  let currentYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();

  while (currentYear <= endYear) {
    years.push(currentYear);
    currentYear++;
  }

  return years;
}

export default {
  getHolidays,
};
