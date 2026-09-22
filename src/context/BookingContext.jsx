// Booking State Context & Provider
import React, { createContext, useContext, useState } from 'react';

const BookingContext = createContext(null);

const INITIAL_STATE = {
  movie: null,
  theatre: null,
  date: new Date().toISOString().split('T')[0],
  show: null,
  selectedSeats: [],
  ticketPrice: 0,
  subtotal: 0,
  fee: 40,
  total: 0
};

export function BookingProvider({ children }) {
  const [bookingState, setBookingState] = useState(INITIAL_STATE);

  const selectMovie = (movie) => {
    setBookingState(prev => ({
      ...prev,
      movie,
      // reset downstream selections if movie changes
      theatre: null,
      show: null,
      selectedSeats: [],
      subtotal: 0,
      total: 0
    }));
  };

  const selectTheatre = (theatre) => {
    setBookingState(prev => ({
      ...prev,
      theatre,
      show: null,
      selectedSeats: [],
      subtotal: 0,
      total: 0
    }));
  };

  const selectDate = (date) => {
    setBookingState(prev => ({
      ...prev,
      date,
      show: null,
      selectedSeats: [],
      subtotal: 0,
      total: 0
    }));
  };

  const selectShow = (show) => {
    setBookingState(prev => {
      const price = show ? show.price : 0;
      const subtotal = prev.selectedSeats.length * price;
      const fee = prev.selectedSeats.length > 0 ? 40 : 0;
      return {
        ...prev,
        show,
        ticketPrice: price,
        subtotal,
        fee,
        total: subtotal + fee
      };
    });
  };

  const toggleSeat = (seatNumber) => {
    setBookingState(prev => {
      const exists = prev.selectedSeats.includes(seatNumber);
      let updated;
      if (exists) {
        updated = prev.selectedSeats.filter(s => s !== seatNumber);
      } else {
        updated = [...prev.selectedSeats, seatNumber];
      }

      const price = prev.show ? prev.show.price : prev.ticketPrice || 250;
      const subtotal = updated.length * price;
      const fee = updated.length > 0 ? 40 : 0;

      return {
        ...prev,
        selectedSeats: updated,
        subtotal,
        fee,
        total: subtotal + fee
      };
    });
  };

  const clearSeats = () => {
    setBookingState(prev => ({
      ...prev,
      selectedSeats: [],
      subtotal: 0,
      fee: 0,
      total: 0
    }));
  };

  const resetBooking = () => {
    setBookingState(INITIAL_STATE);
  };

  const value = {
    ...bookingState,
    bookingState,
    selectMovie,
    selectTheatre,
    selectDate,
    selectShow,
    toggleSeat,
    clearSeats,
    resetBooking
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
