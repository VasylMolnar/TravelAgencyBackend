# TravelAgency Backend

# Config :

    1: Add .env file (PORT, DATABASE_URL, REFRESH_TOKEN_SECRET,ACCESS_TOKEN_SECRET)

    2: Refresh Token and LogOut - we must send cookies from client (credentials: 'same-origin', // include, *same-origin, omit)

    3: VerifyJWT - we must send ACCESS_TOKEN_SECRET from client in header (authorization) with (credentials) example (insomnia img 1)
