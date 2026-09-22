// Initial Seed Data for CineWave

export const INITIAL_USERS = [
  {
    id: 'user-cust-001',
    name: 'Arun Kumar',
    email: 'customer@cinewave.com',
    phone: '+91 98765 43210',
    role: 'customer',
    password: 'customer123'
  },
  {
    id: 'user-staff-001',
    name: 'Priya Sharma',
    email: 'staff@cinewave.com',
    phone: '+91 91234 56789',
    role: 'staff',
    password: 'staff123'
  }
];

export const INITIAL_MOVIES = [
  {
    id: 'mov-001',
    title: 'Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
    genre: 'Sci-Fi / Thriller',
    language: 'English',
    duration: '148 min',
    rating: '8.8',
    director: 'Christopher Nolan',
    cast: 'Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page, Tom Hardy',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    releaseDate: '2026-07-16',
    isUpcoming: false
  },
  {
    id: 'mov-002',
    title: 'Interstellar',
    description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
    genre: 'Sci-Fi / Adventure',
    language: 'English',
    duration: '169 min',
    rating: '8.7',
    director: 'Christopher Nolan',
    cast: 'Matthew McConaughey, Anne Hathaway, Jessica Chastain, Michael Caine',
    poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80',
    releaseDate: '2026-08-10',
    isUpcoming: false
  },
  {
    id: 'mov-003',
    title: 'Avatar: The Way of Water',
    description: 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na\'vi race to protect their home.',
    genre: 'Action / Sci-Fi',
    language: 'English',
    duration: '192 min',
    rating: '7.8',
    director: 'James Cameron',
    cast: 'Sam Worthington, Zoe Saldana, Sigourney Weaver, Stephen Lang',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1600&q=80',
    releaseDate: '2026-09-01',
    isUpcoming: false
  },
  {
    id: 'mov-004',
    title: 'Avengers: Endgame',
    description: 'After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos\' actions and restore balance to the universe.',
    genre: 'Action / Adventure',
    language: 'English',
    duration: '181 min',
    rating: '8.4',
    director: 'Anthony & Joe Russo',
    cast: 'Robert Downey Jr., Chris Evans, Mark Ruffalo, Chris Hemsworth, Scarlett Johansson',
    poster: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80',
    releaseDate: '2026-09-15',
    isUpcoming: false
  },
  {
    id: 'mov-005',
    title: 'Spider-Man: No Way Home',
    description: 'With Spider-Man\'s identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear, forcing Peter to discover what it truly means to be Spider-Man.',
    genre: 'Action / Adventure',
    language: 'English',
    duration: '148 min',
    rating: '8.2',
    director: 'Jon Watts',
    cast: 'Tom Holland, Zendaya, Benedict Cumberbatch, Jacob Batalon',
    poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    releaseDate: '2026-09-18',
    isUpcoming: false
  },
  {
    id: 'mov-006',
    title: 'Leo',
    description: 'Parthiban is a mild-mannered cafe owner in Theog, Himachal Pradesh, who fends off a gang of murderous thugs. He soon faces a syndicate from Andhra Pradesh who claim he is actually Leo Das, the estranged son of a crime lord.',
    genre: 'Action / Thriller',
    language: 'Tamil',
    duration: '164 min',
    rating: '7.9',
    director: 'Lokesh Kanagaraj',
    cast: 'Thalapathy Vijay, Sanjay Dutt, Trisha Krishnan, Arjun Sarja',
    poster: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80',
    releaseDate: '2026-09-20',
    isUpcoming: false
  },
  {
    id: 'mov-007',
    title: 'Vikram',
    description: 'A special agent investigates a murder committed by a masked band of serial killers. However, a tangled maze of clues conducts him to the drug kingpin of Chennai and an elusive phantom commando.',
    genre: 'Action / Thriller',
    language: 'Tamil',
    duration: '175 min',
    rating: '8.3',
    director: 'Lokesh Kanagaraj',
    cast: 'Kamal Haasan, Vijay Sethupathi, Fahadh Faasil, Suriya',
    poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
    releaseDate: '2026-09-22',
    isUpcoming: false
  },
  {
    id: 'mov-008',
    title: 'Jailer',
    description: 'A retired jailer goes on a manhunt to find his police officer son\'s killers. But the road will lead him from familiar family bounds to a complex underworld empire.',
    genre: 'Action / Drama',
    language: 'Tamil',
    duration: '168 min',
    rating: '7.8',
    director: 'Nelson Dilipkumar',
    cast: 'Rajinikanth, Mohanlal, Shiva Rajkumar, Jackie Shroff, Ramya Krishnan',
    poster: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1600&q=80',
    releaseDate: '2026-09-25',
    isUpcoming: false
  },
  {
    id: 'mov-009',
    title: 'Dune: Part Two',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    genre: 'Sci-Fi / Adventure',
    language: 'English',
    duration: '166 min',
    rating: '8.6',
    director: 'Denis Villeneuve',
    cast: 'Timothée Chalamet, Zendaya, Rebecca Ferguson, Javier Bardem',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    releaseDate: '2026-10-15',
    isUpcoming: true
  }
];

export const INITIAL_THEATRES = [
  {
    id: 'th-001',
    name: 'CineWave Grand Mall',
    location: 'Coimbatore',
    address: 'Avinashi Road, Near Hope College, Coimbatore, TN 641004',
    screens: 5,
    contact: '+91 422 2589001',
    facilities: ['IMAX Laser', 'Dolby Atmos', '4DX', 'VIP Recliners', 'Valet Parking', 'Gourmet Food Court', 'Wheelchair Access'],
    distance: '2.4 km away'
  },
  {
    id: 'th-002',
    name: 'CineWave Central',
    location: 'Coimbatore',
    address: 'Diwan Bahadur Road, RS Puram, Coimbatore, TN 641002',
    screens: 4,
    contact: '+91 422 2544102',
    facilities: ['Dolby Atmos 7.1', 'RGB Laser Projection', 'Parking', 'Cafeteria', 'Wheelchair Access'],
    distance: '4.8 km away'
  },
  {
    id: 'th-003',
    name: 'CineWave Galaxy',
    location: 'Chennai',
    address: 'Velachery Main Road, Phoenix MarketCity, Chennai, TN 600042',
    screens: 8,
    contact: '+91 44 66258000',
    facilities: ['IMAX Laser', 'Dolby Atmos', 'Gold Class Lounge', 'Valet Parking', 'Food Court', 'Wheelchair Access'],
    distance: '6.1 km away'
  },
  {
    id: 'th-004',
    name: 'CineWave Downtown',
    location: 'Bangalore',
    address: 'MG Road, Trinity Circle, Bangalore, KA 560001',
    screens: 6,
    contact: '+91 80 41235678',
    facilities: ['4DX', 'Dolby Atmos', 'Premium Recliners', 'Covered Parking', 'Gourmet Dining', 'Wheelchair Access'],
    distance: '8.3 km away'
  }
];

// Generates shows across today and next 4 days
const todayStr = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000);
const tomorrowStr = tomorrow.toISOString().split('T')[0];
const day3 = new Date(Date.now() + 86400000 * 2);
const day3Str = day3.toISOString().split('T')[0];

export const INITIAL_SHOWS = [
  // Inception at Grand Mall
  {
    id: 'show-001',
    movieId: 'mov-001',
    theatreId: 'th-001',
    screen: 'Screen 1 (IMAX)',
    date: todayStr,
    startTime: '10:00 AM',
    endTime: '12:45 PM',
    format: 'IMAX',
    price: 320,
    totalSeats: 48,
    bookedSeats: ['A1', 'A2', 'C4', 'C5']
  },
  {
    id: 'show-002',
    movieId: 'mov-001',
    theatreId: 'th-001',
    screen: 'Screen 1 (IMAX)',
    date: todayStr,
    startTime: '01:30 PM',
    endTime: '04:15 PM',
    format: 'IMAX',
    price: 350,
    totalSeats: 48,
    bookedSeats: ['B3', 'B4', 'D1', 'D2']
  },
  {
    id: 'show-003',
    movieId: 'mov-001',
    theatreId: 'th-001',
    screen: 'Screen 2',
    date: todayStr,
    startTime: '07:30 PM',
    endTime: '10:15 PM',
    format: '2D',
    price: 220,
    totalSeats: 48,
    bookedSeats: ['E1', 'E2']
  },
  {
    id: 'show-004',
    movieId: 'mov-001',
    theatreId: 'th-002',
    screen: 'Screen 1',
    date: todayStr,
    startTime: '04:30 PM',
    endTime: '07:15 PM',
    format: '2D',
    price: 190,
    totalSeats: 48,
    bookedSeats: ['B5', 'B6']
  },
  // Interstellar at Grand Mall & Galaxy
  {
    id: 'show-005',
    movieId: 'mov-002',
    theatreId: 'th-001',
    screen: 'Screen 3 (4DX)',
    date: todayStr,
    startTime: '04:00 PM',
    endTime: '07:05 PM',
    format: '4DX',
    price: 380,
    totalSeats: 48,
    bookedSeats: ['C1', 'C2', 'C3']
  },
  {
    id: 'show-006',
    movieId: 'mov-002',
    theatreId: 'th-003',
    screen: 'Screen 1 (IMAX)',
    date: todayStr,
    startTime: '07:00 PM',
    endTime: '10:05 PM',
    format: 'IMAX',
    price: 350,
    totalSeats: 48,
    bookedSeats: ['A4', 'A5']
  },
  // Leo at Grand Mall & Central
  {
    id: 'show-007',
    movieId: 'mov-006',
    theatreId: 'th-001',
    screen: 'Screen 2',
    date: todayStr,
    startTime: '10:15 PM',
    endTime: '01:10 AM',
    format: '2D',
    price: 240,
    totalSeats: 48,
    bookedSeats: ['D4', 'D5', 'D6']
  },
  {
    id: 'show-008',
    movieId: 'mov-006',
    theatreId: 'th-002',
    screen: 'Screen 2',
    date: todayStr,
    startTime: '07:15 PM',
    endTime: '10:10 PM',
    format: '2D',
    price: 200,
    totalSeats: 48,
    bookedSeats: ['F1', 'F2']
  },
  // Tomorrow Shows
  {
    id: 'show-009',
    movieId: 'mov-001',
    theatreId: 'th-001',
    screen: 'Screen 1 (IMAX)',
    date: tomorrowStr,
    startTime: '01:30 PM',
    endTime: '04:15 PM',
    format: 'IMAX',
    price: 350,
    totalSeats: 48,
    bookedSeats: []
  },
  {
    id: 'show-010',
    movieId: 'mov-007',
    theatreId: 'th-001',
    screen: 'Screen 4',
    date: todayStr,
    startTime: '06:45 PM',
    endTime: '09:50 PM',
    format: '2D',
    price: 220,
    totalSeats: 48,
    bookedSeats: ['B1', 'B2']
  },
  {
    id: 'show-011',
    movieId: 'mov-008',
    theatreId: 'th-003',
    screen: 'Screen 2',
    date: todayStr,
    startTime: '03:45 PM',
    endTime: '06:45 PM',
    format: '2D',
    price: 250,
    totalSeats: 48,
    bookedSeats: []
  }
];

export const INITIAL_BOOKINGS = [
  {
    id: 'CW-2026-00125',
    customerId: 'user-cust-001',
    customerName: 'Arun Kumar',
    customerEmail: 'customer@cinewave.com',
    customerPhone: '+91 98765 43210',
    movieId: 'mov-001',
    movieTitle: 'Inception',
    theatreId: 'th-001',
    theatreName: 'CineWave Grand Mall',
    theatreLocation: 'Coimbatore',
    showId: 'show-001',
    screen: 'Screen 1 (IMAX)',
    format: 'IMAX',
    bookingDate: todayStr,
    showTime: '10:00 AM',
    selectedSeats: ['B1', 'B2'],
    ticketCount: 2,
    ticketPrice: 320,
    subtotal: 640,
    fee: 40,
    total: 680,
    status: 'Booking Requested', // Stage 1 demonstration
    specialRequest: 'Corner seats preferred if possible',
    rejectionReason: '',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    timeline: [
      {
        stage: 'Booking Requested',
        title: 'Booking Request Submitted',
        description: 'Customer submitted ticket request for 2 seats.',
        actor: 'Arun Kumar (Customer)',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: 'CW-2026-00118',
    customerId: 'user-cust-001',
    customerName: 'Arun Kumar',
    customerEmail: 'customer@cinewave.com',
    customerPhone: '+91 98765 43210',
    movieId: 'mov-002',
    movieTitle: 'Interstellar',
    theatreId: 'th-001',
    theatreName: 'CineWave Grand Mall',
    theatreLocation: 'Coimbatore',
    showId: 'show-005',
    screen: 'Screen 3 (4DX)',
    format: '4DX',
    bookingDate: todayStr,
    showTime: '04:00 PM',
    selectedSeats: ['C1', 'C2', 'C3'],
    ticketCount: 3,
    ticketPrice: 380,
    subtotal: 1140,
    fee: 60,
    total: 1200,
    status: 'Awaiting Customer Confirmation', // Stage 3 demonstration
    specialRequest: '',
    rejectionReason: '',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    timeline: [
      {
        stage: 'Booking Requested',
        title: 'Booking Request Submitted',
        description: 'Customer requested 3 4DX seats.',
        actor: 'Arun Kumar (Customer)',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
      },
      {
        stage: 'Under Review',
        title: 'Staff Review Initiated',
        description: 'Operations team verified seat availability and cinema audio balance.',
        actor: 'Priya Sharma (Staff)',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      },
      {
        stage: 'Awaiting Customer Confirmation',
        title: 'Confirmation Requested',
        description: 'Staff verified availability and dispatched confirmation request to customer.',
        actor: 'Priya Sharma (Staff)',
        timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: 'CW-2026-00094',
    customerId: 'user-cust-001',
    customerName: 'Arun Kumar',
    customerEmail: 'customer@cinewave.com',
    customerPhone: '+91 98765 43210',
    movieId: 'mov-006',
    movieTitle: 'Leo',
    theatreId: 'th-001',
    theatreName: 'CineWave Grand Mall',
    theatreLocation: 'Coimbatore',
    showId: 'show-007',
    screen: 'Screen 2',
    format: '2D',
    bookingDate: todayStr,
    showTime: '10:15 PM',
    selectedSeats: ['D4', 'D5', 'D6'],
    ticketCount: 3,
    ticketPrice: 240,
    subtotal: 720,
    fee: 60,
    total: 780,
    status: 'Ticket Issued', // Stage 6 final completed demonstration
    specialRequest: '',
    rejectionReason: '',
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    timeline: [
      {
        stage: 'Booking Requested',
        title: 'Booking Request Submitted',
        description: 'Customer submitted ticket request.',
        actor: 'Arun Kumar (Customer)',
        timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString()
      },
      {
        stage: 'Under Review',
        title: 'Staff Review',
        description: 'Auditor approved seat allotment.',
        actor: 'Priya Sharma (Staff)',
        timestamp: new Date(Date.now() - 100 * 60 * 1000).toISOString()
      },
      {
        stage: 'Awaiting Customer Confirmation',
        title: 'Confirmation Requested',
        description: 'Notification sent to customer to confirm booking.',
        actor: 'Priya Sharma (Staff)',
        timestamp: new Date(Date.now() - 85 * 60 * 1000).toISOString()
      },
      {
        stage: 'Customer Confirmed',
        title: 'Customer Confirmed Booking',
        description: 'Customer accepted booking parameters and show timings.',
        actor: 'Arun Kumar (Customer)',
        timestamp: new Date(Date.now() - 70 * 60 * 1000).toISOString()
      },
      {
        stage: 'Booking Confirmed',
        title: 'Booking Confirmed & Seats Locked',
        description: 'Staff completed case authorization and issued transaction reference.',
        actor: 'Priya Sharma (Staff)',
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString()
      },
      {
        stage: 'Ticket Issued',
        title: 'Digital Ticket Issued with QR Code',
        description: 'Digital ticket successfully rendered for gate verification.',
        actor: 'System (Automated)',
        timestamp: new Date(Date.now() - 55 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: 'CW-2026-00082',
    customerId: 'user-cust-001',
    customerName: 'Arun Kumar',
    customerEmail: 'customer@cinewave.com',
    customerPhone: '+91 98765 43210',
    movieId: 'mov-003',
    movieTitle: 'Avatar: The Way of Water',
    theatreId: 'th-002',
    theatreName: 'CineWave Central',
    theatreLocation: 'Coimbatore',
    showId: 'show-004',
    screen: 'Screen 1',
    format: '2D',
    bookingDate: todayStr,
    showTime: '04:30 PM',
    selectedSeats: ['B5', 'B6'],
    ticketCount: 2,
    ticketPrice: 190,
    subtotal: 380,
    fee: 40,
    total: 420,
    status: 'Cancelled',
    specialRequest: '',
    rejectionReason: 'Customer requested cancellation prior to showtime cut-off.',
    createdAt: new Date(Date.now() - 240 * 60 * 1000).toISOString(),
    timeline: [
      {
        stage: 'Booking Requested',
        title: 'Booking Request Submitted',
        description: 'Customer requested 2 seats.',
        actor: 'Arun Kumar (Customer)',
        timestamp: new Date(Date.now() - 240 * 60 * 1000).toISOString()
      },
      {
        stage: 'Cancelled',
        title: 'Booking Cancelled',
        description: 'Customer cancelled booking. Seats released.',
        actor: 'Arun Kumar (Customer)',
        timestamp: new Date(Date.now() - 210 * 60 * 1000).toISOString()
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-001',
    userId: 'user-cust-001',
    role: 'customer',
    bookingId: 'CW-2026-00118',
    message: 'Your booking request CW-2026-00118 has been reviewed by staff. Please confirm your booking to proceed.',
    type: 'confirmation_required',
    read: false,
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString()
  },
  {
    id: 'notif-002',
    userId: 'user-cust-001',
    role: 'customer',
    bookingId: 'CW-2026-00094',
    message: 'Your booking CW-2026-00094 has been confirmed! Your digital ticket is ready.',
    type: 'success',
    read: true,
    createdAt: new Date(Date.now() - 55 * 60 * 1000).toISOString()
  },
  {
    id: 'notif-003',
    userId: 'user-staff-001',
    role: 'staff',
    bookingId: 'CW-2026-00125',
    message: 'New booking request CW-2026-00125 received from Arun Kumar for Inception.',
    type: 'new_request',
    read: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  }
];
