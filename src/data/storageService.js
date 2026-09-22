// LocalStorage Data Service for CineWave
import {
  INITIAL_USERS,
  INITIAL_MOVIES,
  INITIAL_THEATRES,
  INITIAL_SHOWS,
  INITIAL_BOOKINGS,
  INITIAL_NOTIFICATIONS
} from './initialData';

const KEYS = {
  USERS: 'cinewave_users',
  MOVIES: 'cinewave_movies',
  THEATRES: 'cinewave_theatres',
  SHOWS: 'cinewave_shows',
  BOOKINGS: 'cinewave_bookings',
  NOTIFICATIONS: 'cinewave_notifications',
  CURRENT_USER: 'cinewave_current_user'
};

// Initialize Storage with Seed Data if not present
export function initializeStorage() {
  if (!localStorage.getItem(KEYS.USERS)) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem(KEYS.MOVIES)) {
    localStorage.setItem(KEYS.MOVIES, JSON.stringify(INITIAL_MOVIES));
  }
  if (!localStorage.getItem(KEYS.THEATRES)) {
    localStorage.setItem(KEYS.THEATRES, JSON.stringify(INITIAL_THEATRES));
  }
  if (!localStorage.getItem(KEYS.SHOWS)) {
    localStorage.setItem(KEYS.SHOWS, JSON.stringify(INITIAL_SHOWS));
  }
  if (!localStorage.getItem(KEYS.BOOKINGS)) {
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
  }
  if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  }
}

// Event Dispatcher for Real-time Reactive Updates
function triggerUpdate(key) {
  window.dispatchEvent(new CustomEvent('cinewave_data_updated', { detail: { key } }));
}

// USERS
export function getUsers() {
  initializeStorage();
  try {
    return JSON.parse(localStorage.getItem(KEYS.USERS)) || [];
  } catch (e) {
    return INITIAL_USERS;
  }
}

export function saveUser(user) {
  const users = getUsers();
  const existingIdx = users.findIndex(u => u.id === user.id || u.email === user.email);
  if (existingIdx >= 0) {
    users[existingIdx] = { ...users[existingIdx], ...user };
  } else {
    users.push(user);
  }
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  triggerUpdate(KEYS.USERS);
  return user;
}

export function findUserByCredentials(email, password, role) {
  const users = getUsers();
  return users.find(u => 
    u.email.toLowerCase() === email.trim().toLowerCase() && 
    u.password === password &&
    (!role || u.role === role)
  );
}

// CURRENT AUTHENTICATED USER
export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.CURRENT_USER)) || null;
  } catch (e) {
    return null;
  }
}

export function setCurrentUser(user) {
  if (user) {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(KEYS.CURRENT_USER);
  }
  triggerUpdate(KEYS.CURRENT_USER);
}

// MOVIES
export function getMovies() {
  initializeStorage();
  try {
    return JSON.parse(localStorage.getItem(KEYS.MOVIES)) || [];
  } catch (e) {
    return INITIAL_MOVIES;
  }
}

export function getMovieById(id) {
  const movies = getMovies();
  return movies.find(m => m.id === id);
}

export function saveMovie(movie) {
  const movies = getMovies();
  const idx = movies.findIndex(m => m.id === movie.id);
  if (idx >= 0) {
    movies[idx] = { ...movies[idx], ...movie };
  } else {
    movies.unshift(movie);
  }
  localStorage.setItem(KEYS.MOVIES, JSON.stringify(movies));
  triggerUpdate(KEYS.MOVIES);
  return movie;
}

export function deleteMovie(id) {
  let movies = getMovies();
  movies = movies.filter(m => m.id !== id);
  localStorage.setItem(KEYS.MOVIES, JSON.stringify(movies));
  triggerUpdate(KEYS.MOVIES);
}

// THEATRES
export function getTheatres() {
  initializeStorage();
  try {
    return JSON.parse(localStorage.getItem(KEYS.THEATRES)) || [];
  } catch (e) {
    return INITIAL_THEATRES;
  }
}

export function getTheatreById(id) {
  const theatres = getTheatres();
  return theatres.find(t => t.id === id);
}

export function saveTheatre(theatre) {
  const theatres = getTheatres();
  const idx = theatres.findIndex(t => t.id === theatre.id);
  if (idx >= 0) {
    theatres[idx] = { ...theatres[idx], ...theatre };
  } else {
    theatres.push(theatre);
  }
  localStorage.setItem(KEYS.THEATRES, JSON.stringify(theatres));
  triggerUpdate(KEYS.THEATRES);
  return theatre;
}

export function deleteTheatre(id) {
  let theatres = getTheatres();
  theatres = theatres.filter(t => t.id !== id);
  localStorage.setItem(KEYS.THEATRES, JSON.stringify(theatres));
  triggerUpdate(KEYS.THEATRES);
}

// SHOWS
export function getShows() {
  initializeStorage();
  try {
    return JSON.parse(localStorage.getItem(KEYS.SHOWS)) || [];
  } catch (e) {
    return INITIAL_SHOWS;
  }
}

export function getShowById(id) {
  const shows = getShows();
  return shows.find(s => s.id === id);
}

export function getShowsForMovieAndTheatre(movieId, theatreId, date) {
  const shows = getShows();
  return shows.filter(s => 
    s.movieId === movieId && 
    (!theatreId || s.theatreId === theatreId) &&
    (!date || s.date === date)
  );
}

export function saveShow(show) {
  const shows = getShows();
  const idx = shows.findIndex(s => s.id === show.id);
  if (idx >= 0) {
    shows[idx] = { ...shows[idx], ...show };
  } else {
    shows.push(show);
  }
  localStorage.setItem(KEYS.SHOWS, JSON.stringify(shows));
  triggerUpdate(KEYS.SHOWS);
  return show;
}

export function deleteShow(id) {
  let shows = getShows();
  shows = shows.filter(s => s.id !== id);
  localStorage.setItem(KEYS.SHOWS, JSON.stringify(shows));
  triggerUpdate(KEYS.SHOWS);
}

// SEAT ALLOTMENT & OCCUPANCY
export function getShowBookedSeats(showId) {
  const show = getShowById(showId);
  const directBooked = show?.bookedSeats || [];
  
  // Also cross-reference active bookings
  const bookings = getBookings().filter(b => 
    b.showId === showId && 
    b.status !== 'Rejected' && 
    b.status !== 'Cancelled'
  );
  
  const allBooked = new Set(directBooked);
  bookings.forEach(b => {
    (b.selectedSeats || []).forEach(seat => allBooked.add(seat));
  });
  return Array.from(allBooked);
}

export function toggleSeatBlock(showId, seatNumber) {
  const shows = getShows();
  const show = shows.find(s => s.id === showId);
  if (!show) return false;
  
  show.bookedSeats = show.bookedSeats || [];
  if (show.bookedSeats.includes(seatNumber)) {
    show.bookedSeats = show.bookedSeats.filter(s => s !== seatNumber);
  } else {
    show.bookedSeats.push(seatNumber);
  }
  saveShow(show);
  return true;
}

// BOOKINGS & CASE LIFECYCLE
export function getBookings() {
  initializeStorage();
  try {
    return JSON.parse(localStorage.getItem(KEYS.BOOKINGS)) || [];
  } catch (e) {
    return INITIAL_BOOKINGS;
  }
}

export function getBookingById(id) {
  const bookings = getBookings();
  return bookings.find(b => b.id === id);
}

export function saveBooking(booking) {
  const bookings = getBookings();
  const idx = bookings.findIndex(b => b.id === booking.id);
  if (idx >= 0) {
    bookings[idx] = { ...bookings[idx], ...booking };
  } else {
    bookings.unshift(booking);
  }
  localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));
  
  // Also register seats to show
  if (booking.showId && booking.selectedSeats && booking.status !== 'Rejected' && booking.status !== 'Cancelled') {
    const show = getShowById(booking.showId);
    if (show) {
      const seatSet = new Set([...(show.bookedSeats || []), ...booking.selectedSeats]);
      show.bookedSeats = Array.from(seatSet);
      saveShow(show);
    }
  }
  
  triggerUpdate(KEYS.BOOKINGS);
  return booking;
}

// LIFECYCLE STATUS TRANSITION METHOD
export function updateBookingStatus(bookingId, newStatus, actorName = 'Staff', reason = '') {
  const bookings = getBookings();
  const booking = bookings.find(b => b.id === bookingId);
  if (!booking) return null;

  const previousStatus = booking.status;
  booking.status = newStatus;
  if (reason) {
    booking.rejectionReason = reason;
  }

  // Build timeline history entry
  let title = `Status changed to ${newStatus}`;
  let description = `Booking moved from ${previousStatus} to ${newStatus}`;

  if (newStatus === 'Under Review') {
    title = 'Staff Review Initiated';
    description = 'Booking request is being reviewed for seat allocation and cinema compliance.';
  } else if (newStatus === 'Awaiting Customer Confirmation') {
    title = 'Customer Confirmation Requested';
    description = 'Staff approved preliminary request. Customer has been asked to review and confirm.';
  } else if (newStatus === 'Customer Confirmed') {
    title = 'Customer Confirmed Booking';
    description = 'Customer reviewed parameters and approved booking.';
  } else if (newStatus === 'Booking Confirmed') {
    title = 'Booking Confirmed';
    description = 'Staff finalized the reservation. Seats are locked.';
  } else if (newStatus === 'Ticket Issued') {
    title = 'Digital Ticket Issued';
    description = 'System generated digital ticket with gate-pass QR code.';
  } else if (newStatus === 'Rejected') {
    title = 'Booking Request Rejected';
    description = `Reason: ${reason || 'Capacity or policy constraint.'}`;
  } else if (newStatus === 'Cancelled') {
    title = 'Booking Cancelled';
    description = reason || 'Cancelled by customer.';
  }

  booking.timeline = booking.timeline || [];
  booking.timeline.push({
    stage: newStatus,
    title,
    description,
    actor: actorName,
    timestamp: new Date().toISOString()
  });

  // If rejected or cancelled, release seats in show
  if (newStatus === 'Rejected' || newStatus === 'Cancelled') {
    const show = getShowById(booking.showId);
    if (show && show.bookedSeats) {
      show.bookedSeats = show.bookedSeats.filter(seat => !booking.selectedSeats.includes(seat));
      saveShow(show);
    }
  }

  // Create notifications based on status
  if (newStatus === 'Awaiting Customer Confirmation') {
    addNotification({
      userId: booking.customerId,
      role: 'customer',
      bookingId: booking.id,
      message: `Your booking request ${booking.id} has been reviewed. Please confirm your booking to proceed.`,
      type: 'confirmation_required'
    });
  } else if (newStatus === 'Booking Confirmed' || newStatus === 'Ticket Issued') {
    addNotification({
      userId: booking.customerId,
      role: 'customer',
      bookingId: booking.id,
      message: `Your booking ${booking.id} has been confirmed! Your digital ticket is ready.`,
      type: 'success'
    });
  } else if (newStatus === 'Customer Confirmed') {
    addNotification({
      userId: 'user-staff-001',
      role: 'staff',
      bookingId: booking.id,
      message: `Customer ${booking.customerName} has confirmed booking ${booking.id}. Ready for final ticket issuance.`,
      type: 'customer_confirmed'
    });
  } else if (newStatus === 'Rejected') {
    addNotification({
      userId: booking.customerId,
      role: 'customer',
      bookingId: booking.id,
      message: `Your booking ${booking.id} was rejected. Reason: ${reason || 'Not available'}`,
      type: 'rejection'
    });
  } else if (newStatus === 'Cancelled') {
    addNotification({
      userId: booking.customerId,
      role: 'customer',
      bookingId: booking.id,
      message: `Your booking ${booking.id} has been successfully cancelled.`,
      type: 'cancelled'
    });
  }

  localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));
  triggerUpdate(KEYS.BOOKINGS);
  return booking;
}

// NOTIFICATIONS
export function getNotifications(role, userId) {
  initializeStorage();
  try {
    const all = JSON.parse(localStorage.getItem(KEYS.NOTIFICATIONS)) || [];
    return all.filter(n => {
      if (role && n.role !== role) return false;
      if (userId && n.userId && n.userId !== userId) return false;
      return true;
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (e) {
    return INITIAL_NOTIFICATIONS;
  }
}

export function addNotification(notif) {
  const all = JSON.parse(localStorage.getItem(KEYS.NOTIFICATIONS)) || [];
  const newNotif = {
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    read: false,
    createdAt: new Date().toISOString(),
    ...notif
  };
  all.unshift(newNotif);
  localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(all));
  triggerUpdate(KEYS.NOTIFICATIONS);
  return newNotif;
}

export function markNotificationRead(id) {
  const all = JSON.parse(localStorage.getItem(KEYS.NOTIFICATIONS)) || [];
  const notif = all.find(n => n.id === id);
  if (notif) {
    notif.read = true;
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(all));
    triggerUpdate(KEYS.NOTIFICATIONS);
  }
}

export function markAllNotificationsRead(role, userId) {
  const all = JSON.parse(localStorage.getItem(KEYS.NOTIFICATIONS)) || [];
  all.forEach(n => {
    if ((!role || n.role === role) && (!userId || n.userId === userId)) {
      n.read = true;
    }
  });
  localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(all));
  triggerUpdate(KEYS.NOTIFICATIONS);
}
