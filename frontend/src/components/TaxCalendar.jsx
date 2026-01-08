/*export default function TaxCalendar() {
    return (
        <div>
        <h3>Quarterly Tax Due Dates</h3>
        <ul>
            <li>Q1 - 15 April</li>
            <li>Q2 - 15 July</li>
            <li>Q3 - 15 October</li>
            <li>Q4 - 15 January</li>
        </ul>
        </div>
    );
}*/

// src/components/TaxCalendar.jsx
import "../styles/TaxCalendar.css";

function TaxCalendar() {
  const getCurrentQuarter = () => {
    const month = new Date().getMonth() + 1;

    if (month <= 3) return "Q4";   // Jan–Mar
    if (month <= 6) return "Q1";   // Apr–Jun
    if (month <= 9) return "Q2";   // Jul–Sep
    return "Q3";                  // Oct–Dec
  };

  const activeQuarter = getCurrentQuarter();

  const dueDates = [
    { quarter: "Q1", date: "15 April" },
    { quarter: "Q2", date: "15 July" },
    { quarter: "Q3", date: "15 October" },
    { quarter: "Q4", date: "15 January" }
  ];

  return (
    <div className="tax-card calendar-card">
      <h3 className="card-title">Quarterly Tax Due Dates</h3>

      <ul className="calendar-list">
        {dueDates.map(({ quarter, date }) => (
          <li
            key={quarter}
            className={`calendar-item ${
              activeQuarter === quarter ? "active" : ""
}`}
          >
            <span className="quarter">{quarter}</span>
            <span className="date">{date}</span>

            {activeQuarter === quarter && (
              <span className="badge">Due Soon</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaxCalendar;

/*import "../styles/TaxCalendar.css";

function TaxCalendar() {
  const today = new Date();

  const dueDates = [
    { quarter: "Q1", month: 3, day: 15, label: "15 April" },
    { quarter: "Q2", month: 6, day: 15, label: "15 July" },
    { quarter: "Q3", month: 9, day: 15, label: "15 October" },
    { quarter: "Q4", month: 0, day: 15, label: "15 January" }
  ];

  const year = today.getFullYear();

  // Build actual date objects
  const schedule = dueDates.map((d) => {
    const dueDate = new Date(year, d.month, d.day);

    // January payment belongs to next year
    if (d.month === 0 && today.getMonth() > 0) {
      dueDate.setFullYear(year + 1);
    }

    const diffDays = Math.ceil(
      (dueDate - today) / (1000 * 60 * 60 * 24)
    );

    return {
      ...d,
      dueDate,
      diffDays
    };
  });

  // Find the next upcoming payment
  const nextDue = schedule.find((d) => d.diffDays >= 0);

  const getStatus = (diffDays) => {
    if (diffDays === 0) return "Due Today";
    if (diffDays < 0) return "Overdue";
    if (diffDays <= 7) return `Due in ${diffDays} days`;
    return `Due in ${diffDays} days`;
  };

  return (
    <div className="tax-card calendar-card">
      <h3 className="card-title">Quarterly Tax Due Dates</h3>

      <ul className="calendar-list">
        {schedule.map((item) => {
          const isActive = nextDue?.quarter === item.quarter;

          return (
            <li
              key={item.quarter}
              className={`calendar-item ${isActive ? "active" : ""}`}
            >
              <div>
                <strong>{item.quarter}</strong>
              </div>

              <div className="date">{item.label}</div>

              {isActive && (
                <span className="badge">
                  {getStatus(item.diffDays)}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default TaxCalendar;*/

/*import "../styles/TaxCalendar.css";

const QUARTERS = [
  { id: "Q1", month: 3, day: 15, label: "15 April" },
  { id: "Q2", month: 6, day: 15, label: "15 July" },
  { id: "Q3", month: 9, day: 15, label: "15 October" },
  { id: "Q4", month: 0, day: 15, label: "15 January" }
];

function getCurrentPayableQuarter() {
  const today = new Date();
  const month = today.getMonth() + 1;

  if (month >= 1 && month <= 3) return "Q4";
  if (month >= 4 && month <= 6) return "Q1";
  if (month >= 7 && month <= 9) return "Q2";
  return "Q3";
}

function getDueDate(quarterId) {
  const today = new Date();
  const year = today.getFullYear();

  const quarter = QUARTERS.find(q => q.id === quarterId);

  if (quarter.id === "Q4") {
    return new Date(year + 1, quarter.month, quarter.day);
  }

  return new Date(year, quarter.month, quarter.day);
}

function calculateDaysLeft(dueDate) {
  const today = new Date();
  const diff = dueDate - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function TaxCalendar() {
  const currentQuarter = getCurrentPayableQuarter();

  return (
    <div className="calendar-wrapper">
      <h3 className="calendar-title">Quarterly Tax Due Dates</h3>

      {QUARTERS.map((quarter) => {
        const dueDate = getDueDate(quarter.id);
        const isActive = quarter.id === currentQuarter;
        const daysLeft = isActive ? calculateDaysLeft(dueDate) : null;

        return (
          <div
            key={quarter.id}
            className={`calendar-row ${isActive ? "active" : ""}`}
          >
            {/* LEFT */ /*}
            <div className="quarter">{quarter.id}</div>

            {/* CENTER */ /*}
            <div className="days-left">
              {isActive
                ? daysLeft > 0
                  ? `${daysLeft} days left`
                  : "Due Today"
                : ""}
            </div>

            {/* RIGHT */ /*}
            <div className="date">{quarter.label}</div>
          </div>
        );
      })}
    </div>
  );
}

export default TaxCalendar;*/

/*function TaxCalendar() {
  const getCurrentQuarter = () => {
    const month = new Date().getMonth() + 1;

    if (month <= 3) return "Q4";   // Jan–Mar
    if (month <= 6) return "Q1";   // Apr–Jun
    if (month <= 9) return "Q2";   // Jul–Sep
    return "Q3";                  // Oct–Dec
  };

  const getDueDateObj = (quarter) => {
    const year = new Date().getFullYear();

    switch (quarter) {
      case "Q1":
        return new Date(year, 3, 15);   // 15 April
      case "Q2":
        return new Date(year, 6, 15);   // 15 July
      case "Q3":
        return new Date(year, 9, 15);   // 15 October
      case "Q4":
        return new Date(year + 1, 0, 15); // 15 January (next year)
      default:
        return null;
    }
  };

  const calculateDaysLeft = (dueDate) => {
    const today = new Date();
    const diff = dueDate - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const activeQuarter = getCurrentQuarter();

  const dueDates = [
    { quarter: "Q1", date: "15 April" },
    { quarter: "Q2", date: "15 July" },
    { quarter: "Q3", date: "15 October" },
    { quarter: "Q4", date: "15 January" }
  ];

  return (
    <div className="tax-card calendar-card">
      <h3 className="card-title">Quarterly Tax Due Dates</h3>

      <ul className="calendar-list">
        {dueDates.map(({ quarter, date }) => {
          const isActive = activeQuarter === quarter;
          const dueDateObj = getDueDateObj(quarter);
          const daysLeft = isActive ? calculateDaysLeft(dueDateObj) : null;

          return (
            <li
              key={quarter}
              className={`calendar-item ${isActive ? "active" : ""}`}
            >
              {/* LEFT */ /*}
              <span className="quarter">{quarter}</span>

              {/* MIDDLE */ /*}
              <span className="days-left">
                {isActive
                  ? daysLeft > 0
                    ? `${daysLeft} days left`
                    : "Due Today"
                  : ""}
              </span>

              {/* RIGHT */ /*}
              <span className="date">{date}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default TaxCalendar;*/