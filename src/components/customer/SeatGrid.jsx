// Cinema Seating Layout Component
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatters';

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F'];
const COLS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function SeatGrid({ 
  bookedSeats = [], 
  reservedSeats = [], 
  selectedSeats = [], 
  onToggleSeat, 
  ticketPrice = 250 
}) {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSeatClick = (seatNumber) => {
    if (!isAuthenticated) {
      showToast('Please login to select seats and book tickets.', 'warning');
      navigate('/login');
      return;
    }

    if (bookedSeats.includes(seatNumber)) {
      showToast(`Seat ${seatNumber} is already booked. Please choose another seat.`, 'error');
      return;
    }

    if (reservedSeats.includes(seatNumber)) {
      showToast(`Seat ${seatNumber} is currently reserved by cinema operations.`, 'warning');
      return;
    }

    onToggleSeat(seatNumber);
  };

  return (
    <div className="cinema-hall-container">
      {/* Screen Curved Visual */}
      <div className="screen-area">
        <div className="screen-curve" />
        <span className="screen-text">All Eyes This Way &bull; Cinema Screen</span>
      </div>

      {/* Seating Rows */}
      <div className="seating-grid">
        {ROWS.map(row => (
          <div key={row} className="seat-row">
            <span className="seat-row-label">{row}</span>

            {COLS.map((col, idx) => {
              const seatNumber = `${row}${col}`;
              const isBooked = bookedSeats.includes(seatNumber);
              const isReserved = reservedSeats.includes(seatNumber);
              const isSelected = selectedSeats.includes(seatNumber);

              let statusClass = 'available';
              if (isBooked) statusClass = 'booked';
              else if (isReserved) statusClass = 'reserved';
              else if (isSelected) statusClass = 'selected';

              return (
                <React.Fragment key={seatNumber}>
                  {/* Aisle gap between seat 4 and 5 */}
                  {idx === 4 && <div className="seat-aisle-gap" />}
                  
                  <button
                    type="button"
                    className={`seat-btn ${statusClass}`}
                    onClick={() => handleSeatClick(seatNumber)}
                    disabled={isBooked || isReserved}
                    title={
                      isBooked ? `Seat ${seatNumber} (Booked)` :
                      isReserved ? `Seat ${seatNumber} (Reserved)` :
                      isSelected ? `Seat ${seatNumber} (Selected - Click to unselect)` :
                      `Seat ${seatNumber} - ${formatCurrency(ticketPrice)}`
                    }
                    aria-label={`Seat ${seatNumber} ${statusClass}`}
                  >
                    {col}
                  </button>
                </React.Fragment>
              );
            })}

            <span className="seat-row-label">{row}</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="seat-legend">
        <div className="legend-item">
          <div className="legend-seat-sample" style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.16)' }} />
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="legend-seat-sample" style={{ background: 'var(--accent-gold)', border: '1px solid #fbbf24' }} />
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="legend-seat-sample" style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)' }} />
          <span>Booked</span>
        </div>
        <div className="legend-item">
          <div className="legend-seat-sample" style={{ background: 'rgba(168, 85, 247, 0.25)', border: '1px solid rgba(168, 85, 247, 0.4)' }} />
          <span>Reserved</span>
        </div>
      </div>
    </div>
  );
}
