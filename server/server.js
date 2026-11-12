import express from 'express'
import cors from 'cors'
import tripRoutes from './routes/trips.js'
import destinationRoutes from './routes/destinations.js'
import passport from 'passport'
import session from 'express-session'
import { GitHub } from './config/auth.js'
import authRoutes from './routes/auth.js'

const app = express()
app.set('trust proxy', 1)


app.use(express.json())
app.use(cors({
    origin: 'https://client-9sjm.onrender.com',
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true
}))
app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-only-secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        sameSite: 'none',
        secure: true
    }
}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(GitHub)

app.get('/', (req, res) => {
    res.status(200).send('<h1 style="text-align: center; margin-top: 50px;">✈️ OnTheFly API</h1>')
})
passport.serializeUser((user, done) => {
    const { accesstoken, ...sessionUser } = user
    done(null, sessionUser)
})
passport.deserializeUser((user, done) => {
    done(null, user)
})

app.use('/auth', authRoutes)
app.use('/api/trips', tripRoutes)
app.use('/api/destinations', destinationRoutes)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
})
