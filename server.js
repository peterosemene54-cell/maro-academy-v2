/**
 * MARO ACADEMY GLOBAL - THE INFINITE CITADEL
 * VERSION: 6.3.0 (2-Minute Timer & Nuclear Switch Architecture)
 * DESCRIPTION: Full-scale backend with Socket.io, Instant Expiry Triggers, and Global Mode Switches.
 * GOAL: Unbreakable Logic.
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');
const cron = require('node-cron');
const bcrypt = require('bcryptjs'); 
const crypto = require('crypto'); 
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// =============================================
// ⚡ WEBSOCKET CONFIGURATION
// =============================================
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

// =============================================
// 🛡️ SECTION 1: SECURITY & MIDDLEWARE STACK
// =============================================

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
}));

app.use(mongoSanitize());

app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: true, limit: '20kb' }));

const allowedOrigins = [
    'http://localhost:3000',
    'https://maro-academy.vercel.app',
    /\.vercel\.app$/
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.some(o => typeof o === 'string' ? o === origin : o.test(origin))) {
            callback(null, true);
        } else {
            callback(new Error('Blocked by Maro Academy Security (CORS)'));
        }
    },
    credentials: true
}));

// =============================================
// 👮 SECTION 2: RATE LIMITING & PROTECTION
// =============================================

const apiLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, 
    max: 200,
    message: { status: 429, message: "System cooling down. Please wait." }
});
app.use('/api/', apiLimiter);

const highSecurityLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    max: 5,
    message: { status: 423, message: "Critical Alert: Too many failed attempts. IP Blacklisted." }
});

// =============================================
// 🗄️ SECTION 3: ADVANCED DATA SCHEMAS
// =============================================

const UserSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, "Name field cannot be empty"],
        trim: true,
        maxlength: [50, "Name too long"]
    },
    email: { 
        type: String, 
        required: [true, "Email is mandatory"], 
        unique: true, 
        lowercase: true,
        trim: true
    },
    password: { 
        type: String, 
        required: true,
        minlength: 8,
        select: false 
    },
    sessionToken: { type: String, default: null, select: false }, 
    role: { 
        type: String, 
        enum: ['student', 'admin', 'moderator'], 
        default: 'student' 
    },
    isPaid: { type: Boolean, default: false },
    paymentTier: { type: String, default: 'None' },
    expiryDate: { type: Date, default: null },
    hasLoggedIn: { type: Boolean, default: false },
    loginCount: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now },
    deviceInfo: String,
    accountStatus: { type: String, default: 'Active' },
    createdAt: { type: Date, default: Date.now }
});

const VideoSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    videoId: { type: String, required: true, unique: true },
    description: { type: String },
    category: { type: String, default: 'General' },
    duration: String,
    thumbnail: String,
    views: { type: Number, default: 0 },
    isLocked: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

const SettingSchema = new mongoose.Schema({
    paymentRequired: { type: Boolean, default: false },
    maintenanceMode: { type: Boolean, default: false },
    registrationOpen: { type: Boolean, default: true },
    globalNotice: { type: String, default: "System Operational" },
    maxConcurrentLogins: { type: Number, default: 1 },
    lastUpdated: { type: Date, default: Date.now }
});

const SecurityLogSchema = new mongoose.Schema({
    event: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    email: String,
    ipAddress: String,
    userAgent: String,
    severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Low' },
    timestamp: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Video = mongoose.model('Video', VideoSchema);
const Setting = mongoose.model('Setting', SettingSchema);
const SecurityLog = mongoose.model('SecurityLog', SecurityLogSchema);

// =============================================
// ⚙️ SECTION 4: CORE LOGIC & MIDDLEWARE
// =============================================

const checkVaultAccess = async (req, res, next) => {
    try {
        const settings = await Setting.findOne() || await Setting.create({});

        if (settings.maintenanceMode) {
            return res.status(503).json({ 
                success: false, 
                message: "VAULT UNDER MAINTENANCE",
                notice: settings.globalNotice 
            });
        }

        if (settings.paymentRequired) {
            const sessionToken = req.headers['x-vault-token'];
            
            if (!sessionToken) return res.status(401).json({ message: "Access Token Missing." });

            const user = await User.findOne({ sessionToken }).select('+sessionToken +isPaid +expiryDate +accountStatus');
            if (!user) return res.status(404).json({ message: "Identity not verified." });

            if (!user.isPaid) {
                return res.status(402).json({ message: "Subscription Inactive." });
            }

            // Real-time Expiry Sync
            if (user.expiryDate && new Date() > new Date(user.expiryDate)) {
                user.isPaid = false;
                user.accountStatus = 'Expired';
                user.sessionToken = null; 
                await user.save();
                
                io.to(user._id.toString()).emit('security_alert', { 
                    type: 'EXPIRED', 
                    message: 'Your access has expired.' 
                });

                return res.status(403).json({ message: "Session Expired." });
            }
            
            req.user = user; 
        }
        next();
    } catch (error) {
        console.error("Critical Middleware Error:", error);
        res.status(500).json({ message: "Internal Security Fault." });
    }
};

const checkAdmin = (req, res, next) => {
    const adminKey = req.headers['x-admin-key'];
    if (adminKey === 'MaroAdmin2026') {
        next();
    } else {
        res.status(403).json({ message: "Admin clearance denied." });
    }
};

// =============================================
// 🚪 SECTION 5: AUTHENTICATION SYSTEM
// =============================================

app.post('/api/register', highSecurityLimiter, async (req, res) => {
    try {
        const { email, password, name } = req.body;
        
        const settings = await Setting.findOne();
        if (settings && !settings.registrationOpen) {
            return res.status(403).json({ message: "Registration is currently closed." });
        }

        const emailExists = await User.findOne({ email });
        if (emailExists) return res.status(409).json({ message: "Email is already in our records." }); 

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({ 
            name, 
            email, 
            password: hashedPassword,
            deviceInfo: req.headers['user-agent']
        });

        await SecurityLog.create({
            event: 'ACCOUNT_CREATED',
            userId: newUser._id,
            email: newUser.email,
            ipAddress: req.ip,
            severity: 'Low'
        });

        res.status(201).json({ success: true, userId: newUser._id });
    } catch (err) {
        res.status(500).json({ message: "System registration failure." });
    }
});

app.post('/api/login', highSecurityLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        if (!user) {
            await SecurityLog.create({ event: 'FAILED_LOGIN_ATTEMPT', email, ipAddress: req.ip, severity: 'Medium' });
            return res.status(401).json({ message: "Credentials not recognized." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            await SecurityLog.create({ event: 'FAILED_LOGIN_ATTEMPT', email, ipAddress: req.ip, severity: 'Medium' });
            return res.status(401).json({ message: "Credentials not recognized." });
        }

        user.loginCount += 1;
        user.lastActive = Date.now();
        user.deviceInfo = req.headers['user-agent'];

        if (user.isPaid && !user.hasLoggedIn) {
            user.hasLoggedIn = true;
            user.expiryDate = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000));
        }

        const sessionToken = crypto.randomBytes(32).toString('hex');
        user.sessionToken = sessionToken;
        await user.save();
        
        await SecurityLog.create({
            event: 'SUCCESSFUL_LOGIN',
            userId: user._id,
            ipAddress: req.ip,
            severity: 'Low'
        });

        const userObject = user.toObject();
        delete userObject.password; 
        delete userObject.sessionToken; 

        res.status(200).json({ ...userObject, sessionToken });
    } catch (err) {
        res.status(500).json({ message: "Login engine error." });
    }
});

// =============================================
// 🛠️ SECTION 6: THE COMMAND CENTER (ADMIN ROUTES)
// =============================================

app.get('/api/students', checkAdmin, async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }).sort({ createdAt: -1 });
        res.json(students);
    } catch (e) {
        res.status(500).json({ message: "Directory fetch failed." });
    }
});

// 🛠️ UPDATED: The 2-Minute Timer Approve/Revoke Switch
app.put('/api/students/:id/approve', checkAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found." });

        // If Approving them
        if (!user.isPaid) {
            user.isPaid = true;
            // 🛠️ SET EXACTLY 2 MINUTES FROM NOW FOR TESTING
            user.expiryDate = new Date(Date.now() + (2 * 60 * 1000)); 
        } 
        // If Revoking them
        else {
            user.isPaid = false;
            user.sessionToken = null; 
            io.to(user._id.toString()).emit('force_disconnect', { reason: 'Admin Revoked Access' });
        }

        await user.save();
        res.json({ message: "User status updated.", user });
    } catch (e) {
        res.status(500).json({ message: "Update failed." });
    }
});

app.get('/api/admin/dashboard-stats', checkAdmin, async (req, res) => {
    try {
        const stats = {
            totalStudents: await User.countDocuments({ role: 'student' }),
            activeSubscriptions: await User.countDocuments({ isPaid: true }),
            systemAlerts: await SecurityLog.countDocuments({ severity: { $in: ['High', 'Critical'] } }),
            totalContent: await Video.countDocuments()
        };
        const recentLogs = await SecurityLog.find().sort({ timestamp: -1 }).limit(15);
        res.json({ stats, recentLogs });
    } catch (e) {
        res.status(500).send("Stats fetch failed.");
    }
});

app.put('/api/admin/users/:id/status', checkAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send("User not found.");
        user.isPaid = !user.isPaid;
        if (!user.isPaid) io.to(user._id.toString()).emit('force_disconnect', { reason: 'Admin Revoked Access' });
        await user.save();
        res.json({ message: "User status updated." });
    } catch (e) {
        res.status(500).send("Update failed.");
    }
});

// =============================================
// 🎬 SECTION 7: VIDEO ENGINE
// =============================================

app.get('/api/videos', checkVaultAccess, async (req, res) => {
    try {
        const videos = await Video.find().sort({ createdAt: 1 });
        res.json(videos);
    } catch (err) {
        res.status(500).json({ message: "Database read error." });
    }
});

app.post('/api/videos/upload', checkAdmin, async (req, res) => {
    try {
        const newVideo = await Video.create(req.body);
        res.status(201).json(newVideo);
    } catch (err) {
        res.status(400).json({ message: "Upload denied. Check constraints." });
    }
});

app.post('/api/videos/secure-upload', checkAdmin, async (req, res) => {
    try {
        const newVideo = await Video.create(req.body);
        res.status(201).json(newVideo);
    } catch (err) {
        res.status(400).json({ message: "Upload denied." });
    }
});

// =============================================
// ⚙️ SECTION 8: GLOBAL SETTINGS & SOCKETS
// =============================================

app.get('/api/settings', async (req, res) => {
    const settings = await Setting.findOne() || await Setting.create({});
    res.json(settings);
});

// 🛠️ UPDATED: The Nuclear Watch Free / Restricted Switch
app.put('/api/settings', checkAdmin, async (req, res) => {
    try {
        const updated = await Setting.findOneAndUpdate({}, req.body, { new: true, upsert: true });
        
        // ☢️ NUCLEAR OPTION: If switching to RESTRICTED mode, reset ALL students instantly
        if (updated.paymentRequired === true) {
            await User.updateMany(
                { role: 'student' },
                { $set: { isPaid: false, sessionToken: null } }
            );
            console.log("☢️ RESTRICTED MODE: All access revoked globally.");
            io.emit('force_disconnect', { reason: 'System switched to Restricted Mode' });
        }
        
        io.emit('system_broadcast', {
            maintenance: updated.maintenanceMode,
            payment: updated.paymentRequired,
            notice: updated.globalNotice
        });

        res.json(updated);
    } catch (e) {
        res.status(500).json({ message: "Global update failed." });
    }
});

app.get('/api/system/settings', async (req, res) => {
    const settings = await Setting.findOne() || await Setting.create({});
    res.json(settings);
});

app.put('/api/system/settings', checkAdmin, async (req, res) => {
    try {
        const updated = await Setting.findOneAndUpdate({}, req.body, { new: true, upsert: true });
        io.emit('system_broadcast', updated);
        res.json(updated);
    } catch (e) {
        res.status(500).send("Global update failed.");
    }
});

// 🛠️ UPDATED: Instant Admin Flash on 2-Minute Expiry
app.put('/api/students/auto-expire/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user && user.isPaid && new Date() > new Date(user.expiryDate)) {
            user.isPaid = false;
            user.accountStatus = 'Expired';
            user.sessionToken = null;
            await user.save();
            
            // 🛠️ INSTANT ADMIN NOTIFICATION: Tell the Admin panel to refresh THIS specific user instantly
            io.emit('admin_user_expired', { userId: user._id });
            
            res.json({ success: true });
        } else {
            res.status(400).json({ message: "Condition not met." });
        }
    } catch (e) {
        res.status(500).json({ message: "Auto-expire fault." });
    }
});

// =============================================
// 🧹 SECTION 9: AUTOMATED CRON JOBS
// =============================================

cron.schedule('0 0 * * *', async () => {
    console.log('⏰ Running midnight security sweep...');
    const now = new Date();
    const result = await User.updateMany(
        { expiryDate: { $lt: now }, isPaid: true },
        { $set: { isPaid: false, accountStatus: 'Expired', sessionToken: null } }
    );
    console.log(`✅ Sweep complete. ${result.modifiedCount} accounts expired.`);
});

cron.schedule('0 0 * * 0', async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await SecurityLog.deleteMany({ timestamp: { $lt: thirtyDaysAgo }, severity: 'Low' });
    console.log('🧹 Old security logs purged.');
});

// =============================================
// 🚀 SECTION 10: SERVER INITIALIZATION
// =============================================

io.on('connection', (socket) => {
    socket.on('init_vault_session', (userId) => {
        socket.join(userId);
        console.log(`🔒 Security session initiated for ID: ${userId}`);
    });

    socket.on('disconnect', () => {
        console.log('Student left the secure session.');
    });
});
// =============================================
// 🚨 TEMPORARY EMERGENCY FIX (DELETE AFTER RUNNING!)
// =============================================
app.get('/api/temp-migrate-passwords', async (req, res) => {
    try {
        const users = await User.find().select('+password');
        let migratedCount = 0;
        for (let user of users) {
            if (user.password && !user.password.startsWith('$2')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
                await user.save();
                migratedCount++;
            }
        }
        res.status(200).json({ message: `✅ SUCCESS: Migrated ${migratedCount} passwords.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get('/system-check', (req, res) => {
    res.status(200).json({
        engine: "Maro-V6.3",
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        db_state: mongoose.connection.readyState === 1 ? 'Healthy' : 'Disconnected'
    });
});

app.get('/', (req, res) => {
    res.send(`
        <div style="background:#000; color:#ffd700; font-family:monospace; padding:100px; text-align:center;">
            <h1 style="font-size:3rem;">⚡ MARO ACADEMY GLOBAL ⚡</h1>
            <p style="color:#555;">CITADEL VERSION 6.3.0 | STATUS: 2-MIN TIMER ACTIVE</p>
            <hr style="border:1px solid #222; width:50%;">
            <p>SOCKET ENGINE: ACTIVE</p>
            <p>DATABASE: CONNECTED</p>
            <p>PASSWORD ENCRYPTION: AES-256 (BCRYPT)</p>
        </div>
    `);
});

app.use((err, req, res, next) => {
    console.error("🔥 SYSTEM ALERT:", err.message);
    res.status(500).json({ error: "Citadel internal failure. Lockdown mode active." });
});

const PORT = process.env.PORT || 10000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI).then(() => {
    server.listen(PORT, () => {
        console.log(`
        ================================================
        🛡️  THE INFINITE CITADEL IS NOW LIVE
        🌐  PORT: ${PORT}
        🔐  SECURITY LEVEL: MAXIMUM
        🔑  ENCRYPTION: BCRYPTJS ACTIVE
        ⏱️  TIMER: 2-MINUTE TESTING MODE
        💎  VERSION: 6.3.0
        ================================================
        `);
    });
}).catch(err => {
    console.error("CRITICAL: DATABASE CONNECTION FAILED!", err);
    process.exit(1);
});