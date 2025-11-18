import React, {useEffect, useState, useRef, useMemo} from "react";
import { addMinutes, startOfWeek, format, addDays} from "date-fns";
import Button from "../components/clearButton.jsx";

const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function parseHourMinute(s){
    const [hour, minute] = s.split(":").map(Number);
    return {hour, minute};
}

const TimeSelector = ({
    meeting,
    initialSelected = [],
    onChange,
    onSubmit, 
}) => {

    const {
        id: meetingId,
        title = "Select Your Availabilities",
        timezone = "America/Montreal",
        slotMinutes = 30,
        dayStart = "09:00",
        dayEnd = "21:00",
        startDate,
        endDate,
    } = meeting;

    // Start of Week as Sunday
    const [weekStart, setWeekStart] = useState(() => 
        startOfWeek(new Date(), {weekStartsOn: 0 })
    );

    // if start date exists, earlitest date = new date(startdate) else null
    const earliestDay = startDate ? new Date(startDate) : null;
    const latestDay = endDate ? new Date(endDate) : null;


    // Selected Time slots
    const [selected, setSelected] = useState(() => new Set(initialSelected));
    useEffect(() => {
        onChange?.(Array.from(selected));
    }), [selected, onChange]
    
    // Dragging
    const dragging = useRef(false)
    const dragMode = useRef(null);

    useEffect(() => {
        const endDrag = () => {
            dragging.current = false;
            dragMode.current = null;
        };
        window.addEventListener("mouseup", endDrag);
        return () => window.removeEventListener("mouseup", endDrag);
    }, []);

    // Weekly grid
    const grid = useMemo(() => {
        const days = Array.from({length:7}, (_,i) => addDays(weekStart,i));
        const {hour: startHour, minute: startMinute} = parseHourMinute(dayStart);
        const {hour:endHour, minute: endMinute} = parseHourMinute(dayStart);

        const slots = days.map((d) => {
            const start = new Date(
                d.getFullYear(),
                d.getMonth(),
                d.getDate(),
                startHour,
                startMinute,
                0,
                0
            );

            const end = new Date(
                d.getFullYear(),
                d.getMonth(),
                d.getDate(),
                endHour,
                endMinute,
                0,
                0
            );

            const list = [];
            for (let t = start; t < end; t = addMinutes(t, slotMinutes)){
                list.push(new Date(t));
            }
            return list;
        });
        return {days, slots};

    }, [weekStart, dayStart, dayEnd, slotMinutes]);

    // Navigating through the weeks
    const viewPreviousWeek = !earliestDay || addDays(weekStart, 7) >= startOfWeek(earliestDay, {weekStartsOn:0});
    const viewNextWeek = !latestDay || addDays(weekStart, 7) <= startOfWeek(addDays(latestDay, 7), {weekStartsOn:0});

    // Selection

    const toggleSlot = (dateObject, force) => {
        const k = dateObject.toISOString();
        setSelected((prev) => {
            const next = new Set(prev);
            const has = next.has(k);
            const shouldAdd = force !== undefined ? force : !has;
            if (shouldAdd) {
                next.add(k);
            }
            else {
                next.delete(k);
            }
            return next;
        });
    };
    const onCellDown = (dateObject) => (e) => {
        e.preventDefault();
        const isOn = selected.has(dateObject.toISOString());
        dragMode.current = isOn ? "remove" : "add";
        dragging.current = true;
        toggleSlot(dateObject, dragMode.current === "add");
    };

    const onCellEnter = (dateObject) => () => {
        if (!dragging.current || !dragMode.current) {
            return;
        }
        toggleSlot(dateObject, dragMode.current === "add");
    };

    const dateRange = `${format(weekStart, "MMM do")} - ${format(addDays(weekStart,6), "MMM do")}`;

    return (
        <div className="w-full"> 

        {/* Header */}
        <h1 className="text-lg font-poppins font-semibold text-center mb-2">{title}</h1>
            <div className="flex items-center justify-center gap-4 mb-4">


                <Button 
                    onclick={() => viewPreviousWeek && setWeekStart(addDays(weekStart, -7))}
                    disabled={!viewPreviousWeek}
                    className={`px-4 py-1 ${viewPreviousWeek ? "bg-[#3B7AAF] hover:bg-[#326aa0]]" :"bg-gray-200 text-gray-400 cursor-not-allow"}`}
                > </Button>
            </div>

        

        {/*Submit Button */}

       <div>
            


       </div>


        
        
        </div>
     

    )
}

export default TimeSelector;