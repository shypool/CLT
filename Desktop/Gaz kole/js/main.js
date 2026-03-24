// ============================================
// GAZ KOLE - COMPLETE ENHANCED VERSION
// ============================================

// ============================================
// CONFIGURATION - Environment Variables
// ============================================

// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "gazkole.firebaseapp.com",
    projectId: "gazkole",
    storageBucket: "gazkole.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123def456"
};

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";

// Mapbox Access Token
const MAPBOX_ACCESS_TOKEN = "YOUR_MAPBOX_ACCESS_TOKEN";

// Payment Configuration
const PAYMENT_CONFIG = {
    moncash: {
        merchantId: "YOUR_MONCASH_MERCHANT_ID",
        merchantSecret: "YOUR_MONCASH_SECRET",
        apiUrl: "https://sandbox.moncash.com/api",
        enabled: true
    },
    natcash: {
        merchantId: "YOUR_NATCASH_MERCHANT_ID",
        merchantSecret: "YOUR_NATCASH_SECRET",
        apiUrl: "https://api.natcash.com",
        enabled: true
    }
};

// App Configuration
const APP_CONFIG = {
    baseFare: {
        moto: 50,
        taxi: 100
    },
    perKm: {
        moto: 15,
        taxi: 25
    },
    surgeMultiplier: 1.5,
    maxDriverDistance: 5, // km
    requestTimeout: 30 // seconds
};

// ============================================
// GLOBAL VARIABLES
// ============================================

let map = null;
let driverMarker = null;
let userMarker = null;
let routePolyline = null;
let driverPosition = null;
let userPosition = null;
let watchId = null;
let firebaseMessaging = null;
let firebaseAuth = null;
let firebaseDb = null;
let notificationCount = 0;
let selectedPaymentMethod = null;
let currentRidePrice = 0;
let currentUser = null;
let currentTrip = null;
let chatMessages = [];
let rideHistory = [];

// State management
const appState = {
    currentPage: 'home',
    isDriverOnline: false,
    hasActiveRide: false,
    selectedVehicle: null,
    selectedPayment: null,
    chatOpen: false,
    emergencyMode: false
};

// Multi-language translations
const translations = {
    ht: {
        home: "Akèy", client: "Kliyan", driver: "Chofè", admin: "Admin",
        heroTitle: "Gaz Kole", heroSubtitle: "Platfòm Transpò ki pi rapid epi sekirite nan peyi a",
        heroDesc: "Chwazi destinasyon ou, jwenn yon chofè pre ou, epi rive nan destinasyon ou byen vit ak san pwoblèm.",
        getStarted: "Kòmanse", appsTitle: "Aplikasyon yo",
        clientApp: "Aplikasyon Kliyan", clientAppDesc: "Pou moun ki vle vwayaje",
        driverApp: "Aplikasyon Chofè", driverAppDesc: "Pou chofè ki vle travay",
        adminApp: "Dashboard Admin", adminAppDesc: "Pou administratè sistèm nan",
        clientTitle: "Aplikasyon Kliyan", currentLocation: "Kote ou ye",
        currentLocationPlaceholder: "Antre kote ou ye...", destination: "Destinasyon",
        destinationPlaceholder: "Antre destinasyon ou...", calculatePrice: "Kalkile Pri",
        selectVehicle: "Chwazi Veyikil", motorcycle: "Moto", taxi: "Taxi",
        price: "Pri:", paymentMethod: "Metòd Peman", moncash: "MonCash",
        natcash: "NatCash", cash: "Kach", confirmRide: "Konfime Kous",
        trackDriver: "Swiv Chofè", rateDriver: "Evalye Chofè", rateText: "Ki jan ou satisfè?",
        driverTitle: "Aplikasyon Chofè", onlineStatus: "Estati:", online: "Anliy",
        offline: "Dekonekte", totalEarnings: "Total Ganany", todayRides: "Kous Jodi a",
        rides: "kous", newRequest: "Nouvo Demand!", pickupLocation: "Lè vize Pick-up:",
        dropoffLocation: "Destinasyon:", distance: "Distans:",
        estimatedEarnings: "Estime Ganany:", accept: "Aksepte", decline: "Refize",
        startRide: "Kòmanse Kous", completeRide: "Fini Kous", withdraw: "Retire Lajan",
        documents: "Dokiman", earnings: "Ganany", adminTitle: "Dashboard Admin",
        totalUsers: "Total Itilizatè", totalDrivers: "Total Chofè", totalRides: "Total Kous",
        totalRevenue: "Total Revni", users: "Itilizatè yo", drivers: "Chofè yo",
        allRides: "Tout Kous yo", name: "Non", email: "Imèl", phone: "Telefòn",
        status: "Estati", actions: "Aksyon", active: "Aktif", pending: "An atant",
        blocked: "Bloke", view: "Wè", block: "Bloke", unblock: "Debloke",
        back: "Retounen", eta: "Tan estime:", rideInProgress: "Kous la k ap fèt...",
        navigateTo: "Navige nan:", distanceRemaining: "Distans ki rete:",
        processingPayment: "Pwosesis Peman...", paymentHint: "Voye lajan nan nimewo sa a, puis tape kòd la.",
        confirmPayment: "Konfime Peman", chat: "Chat", rideHistory: "Istwa Kous",
        emergency: "Ijans", sos: "SOS", cancelRide: "Anile Kous",
        tipDriver: "Bay Propina", promoCode: "Kòd Pwomo", favorites: "Favori",
        verification: "Verifikasyon", profile: "Pwofil", settings: "Paramèt",
        logout: "Dekonekte", rating: "Evalyasyon", tripDetails: "Detay Kous",
        driverInfo: "Info Chofè", vehicleInfo: "Info Veyikil", route: "Wout",
        arrived: "Chofè a rive", inProgress: "An kous", completed: "Fini",
        cancelled: "Anile", searchDriver: "Chèche chofè...", noDrivers: "Pa gen chofè disponib",
        arrivedMessage: "Chofè a rive! Tanpri monte nan veyikil la.",
        tripCompleted: "Kous la fini! Mèsi pou vwayaje avèk Gaz Kole!",
        emergencySent: "Mesaj ijans voye!",
        shareTrip: "Pataje kous", callDriver: "Rele Chofè",
        chatPlaceholder: "Tape yon mesaj...", send: "Voye",
        rideHistoryTitle: "Istwa Kous ou", noRides: "Ou pa gen okenn kous.",
        tripFrom: "Soti:", tripTo: "Ale:", tripDate: "Dat:",
        tripPrice: "Pri:", tripDriver: "Chofè:",
        driverRating: "Evalyasyon Chofè", verifyDocuments: "Verifikasyon Dokiman",
        uploadDocs: "Chaje Dokiman", license: "Lisans", registration: "Anrejistreman",
        insurance: "Asirans", verified: "Verifye", pendingVerification: "ap tann verifikasyon",
        emergencyContact: "Kontak Ijans", addContact: "Ajoute Kontak",
        shareTripMessage: "Mwen ap fè kous avèk Gaz Kole. Wout:",
        cancelReason: "Rezon Anilasyon", confirmCancel: "Konfime Anilasyon",
        tipAmount: "Montan Propina", addTip: "Ajoute Propina",
        promoPlaceholder: "Antre kòd pwomo", applyPromo: "Aplike",
        promoApplied: "Kòd pwomo a aplike!", invalidPromo: "Kòd envalid",
        saveLocation: "Sove Lokasyon", locationName: "Non Lokasyon",
        homeLocation: "Lakay", workLocation: "Travay", otherLocation: "Lòt"
    },
    fr: {
        home: "Accueil", client: "Client", driver: "Chauffeur", admin: "Admin",
        heroTitle: "Gaz Kole", heroSubtitle: "La plateforme de transport la plus rapide et sÃ©curisÃ©e du pays",
        heroDesc: "Choisissez votre destination, trouvez un chauffeur proche de vous, et arrivez Ã  destination rapidement et en toute sÃ©curitÃ©.",
        getStarted: "Commencer", appsTitle: "Applications",
        clientApp: "Application Client", clientAppDesc: "Pour ceux qui veulent voyager",
        driverApp: "Application Chauffeur", driverAppDesc: "Pour les chauffeurs qui veulent travailler",
        adminApp: "Dashboard Admin", adminAppDesc: "Pour les administrateurs du systÃ¨me",
        clientTitle: "Application Client", currentLocation: "Votre position",
        currentLocationPlaceholder: "Entrez votre position...", destination: "Destination",
        destinationPlaceholder: "Entrez votre destination...", calculatePrice: "Calculer le Prix",
        selectVehicle: "Choisir le VÃ©hicule", motorcycle: "Moto", taxi: "Taxi",
        price: "Prix:", paymentMethod: "MÃ©thode de Paiement", moncash: "MonCash",
        natcash: "NatCash", cash: "EspÃ¨ces", confirmRide: "Confirmer le Trajet",
        trackDriver: "Suivre le Chauffeur", rateDriver: "Noter le Chauffeur", rateText: "Comment Ã©tait votre expÃ©rience?",
        driverTitle: "Application Chauffeur", onlineStatus: "Statut:", online: "En ligne",
        offline: "Hors ligne", totalEarnings: "Gains Totaux", todayRides: "Trajets Aujourd'hui",
        rides: "trajets", newRequest: "Nouvelle Demande!", pickupLocation: "Point de ramassage:",
        dropoffLocation: "Destination:", distance: "Distance:",
        estimatedEarnings: "Gains EstimÃ©s:", accept: "Accepter", decline: "Refuser",
        startRide: "Commencer le Trajet", completeRide: "Terminer le Trajet", withdraw: "Retirer l'Argent",
        documents: "Documents", earnings: "Gains", adminTitle: "Dashboard Admin",
        totalUsers: "Total Utilisateurs", totalDrivers: "Total Chauffeurs", totalRides: "Total Trajets",
        totalRevenue: "Revenu Total", users: "Utilisateurs", drivers: "Chauffeurs",
        allRides: "Tous les Trajets", name: "Nom", email: "Email", phone: "TÃ©lÃ©phone",
        status: "Statut", actions: "Actions", active: "Actif", pending: "En attente",
        blocked: "BloquÃ©", view: "Voir", block: "Bloquer", unblock: "DÃ©bloquer",
        back: "Retour", eta: "Temps estimÃ©:", rideInProgress: "Le trajet est en cours...",
        navigateTo: "Naviguer vers:", distanceRemaining: "Distance restante:",
        processingPayment: "Traitement du paiement...", paymentHint: "Envoyez l'argent Ã  ce numÃ©ro, puis entrez le code.",
        confirmPayment: "Confirmer le paiement", chat: "Chat", rideHistory: "Historique",
        emergency: "Urgence", sos: "SOS", cancelRide: "Annuler le Trajet",
        tipDriver: "Donner un pourboire", promoCode: "Code Promo", favorites: "Favoris",
        verification: "VÃ©rification", profile: "Profil", settings: "ParamÃ¨tres",
        logout: "DÃ©connexion", rating: "Ã‰valuation", tripDetails: "DÃ©tails du Trajet",
        driverInfo: "Info Chauffeur", vehicleInfo: "Info VÃ©hicule", route: "ItinÃ©raire",
        arrived: "Le chauffeur est arrivÃ©", inProgress: "En cours", completed: "TerminÃ©",
        cancelled: "AnnulÃ©", searchDriver: "Rechercher un chauffeur...", noDrivers: "Aucun chauffeur disponible",
        arrivedMessage: "Le chauffeur est arrivÃ©! Veuillez monter dans le vÃ©hicule.",
        tripCompleted: "Trajet terminÃ©! Merci d'avoir voyagÃ© avec Gaz Kole!",
        emergencySent: "Message d'urgence envoyÃ©!",
        shareTrip: "Partager le trajet", callDriver: "Appeler le Chauffeur",
        chatPlaceholder: "Tapez un message...", send: "Envoyer",
        rideHistoryTitle: "Votre historique de trajets", noRides: "Vous n'avez aucun trajet.",
        tripFrom: "De:", tripTo: "Ã€:", tripDate: "Date:",
        tripPrice: "Prix:", tripDriver: "Chauffeur:",
        driverRating: "Ã‰valuation du Chauffeur", verifyDocuments: "VÃ©rification des Documents",
        uploadDocs: "TÃ©lÃ©charger Documents", license: "Permis", registration: "Immatriculation",
        insurance: "Assurance", verified: "VÃ©rifiÃ©", pendingVerification: "En attente de vÃ©rification",
        emergencyContact: "Contact d'Urgence", addContact: "Ajouter un Contact",
        shareTripMessage: "Je fais un trajet avec Gaz Kole. ItinÃ©raire:",
        cancelReason: "Raison de l'annulation", confirmCancel: "Confirmer l'annulation",
        tipAmount: "Montant du pourboire", addTip: "Ajouter un pourboire",
        promoPlaceholder: "Entrez le code promo", applyPromo: "Appliquer",
        promoApplied: "Code promo appliquÃ©!", invalidPromo: "Code invalide",
        saveLocation: "Sauvegarder le lieu", locationName: "Nom du lieu",
        homeLocation: "Maison", workLocation: "Travail", otherLocation: "Autre"
    },
    en: {
        home: "Home", client: "Client", driver: "Driver", admin: "Admin",
        heroTitle: "Gaz Kole", heroSubtitle: "The fastest and safest transportation platform in the country",
        heroDesc: "Choose your destination, find a driver near you, and arrive at your destination quickly and safely.",
        getStarted: "Get Started", appsTitle: "Applications",
        clientApp: "Client App", clientAppDesc: "For people who want to travel",
        driverApp: "Driver App", driverAppDesc: "For drivers who want to work",
        adminApp: "Admin Dashboard", adminAppDesc: "For system administrators",
        clientTitle: "Client Application", currentLocation: "Your Location",
        currentLocationPlaceholder: "Enter your location...", destination: "Destination",
        destinationPlaceholder: "Enter your destination...", calculatePrice: "Calculate Price",
        selectVehicle: "Select Vehicle", motorcycle: "Motorcycle", taxi: "Taxi",
        price: "Price:", paymentMethod: "Payment Method", moncash: "MonCash",
        natcash: "NatCash", cash: "Cash", confirmRide: "Confirm Ride",
        trackDriver: "Track Driver", rateDriver: "Rate Driver", rateText: "How was your experience?",
        driverTitle: "Driver Application", onlineStatus: "Status:", online: "Online",
        offline: "Offline", totalEarnings: "Total Earnings", todayRides: "Today's Rides",
        rides: "rides", newRequest: "New Request!", pickupLocation: "Pickup Location:",
        dropoffLocation: "Destination:", distance: "Distance:",
        estimatedEarnings: "Estimated Earnings:", accept: "Accept", decline: "Decline",
        startRide: "Start Ride", completeRide: "Complete Ride", withdraw: "Withdraw Money",
        documents: "Documents", earnings: "Earnings", adminTitle: "Admin Dashboard",
        totalUsers: "Total Users", totalDrivers: "Total Drivers", totalRides: "Total Rides",
        totalRevenue: "Total Revenue", users: "Users", drivers: "Drivers",
        allRides: "All Rides", name: "Name", email: "Email", phone: "Phone",
        status: "Status", actions: "Actions", active: "Active", pending: "Pending",
        blocked: "Blocked", view: "View", block: "Block", unblock: "Unblock",
        back: "Back", eta: "ETA:", rideInProgress: "Ride in progress...",
        navigateTo: "Navigate to:", distanceRemaining: "Distance remaining:",
        processingPayment: "Processing Payment...", paymentHint: "Send money to this number, then enter the code.",
        confirmPayment: "Confirm Payment", chat: "Chat", rideHistory: "History",
        emergency: "Emergency", sos: "SOS", cancelRide: "Cancel Ride",
        tipDriver: "Tip Driver", promoCode: "Promo Code", favorites: "Favorites",
        verification: "Verification", profile: "Profile", settings: "Settings",
        logout: "Logout", rating: "Rating", tripDetails: "Trip Details",
        driverInfo: "Driver Info", vehicleInfo: "Vehicle Info", route: "Route",
        arrived: "Driver has arrived", inProgress: "In Progress", completed: "Completed",
        cancelled: "Cancelled", searchDriver: "Search driver...", noDrivers: "No drivers available",
        arrivedMessage: "Driver has arrived! Please get in the vehicle.",
        tripCompleted: "Trip completed! Thank you for traveling with Gaz Kole!",
        emergencySent: "Emergency message sent!",
        shareTrip: "Share Trip", callDriver: "Call Driver",
        chatPlaceholder: "Type a message...", send: "Send",
        rideHistoryTitle: "Your ride history", noRides: "You have no rides.",
        tripFrom: "From:", tripTo: "To:", tripDate: "Date:",
        tripPrice: "Price:", tripDriver: "Driver:",
        driverRating: "Driver Rating", verifyDocuments: "Document Verification",
        uploadDocs: "Upload Documents", license: "License", registration: "Registration",
        insurance: "Insurance", verified: "Verified", pendingVerification: "Pending verification",
        emergencyContact: "Emergency Contact", addContact: "Add Contact",
        shareTripMessage: "I'm taking a trip with Gaz Kole. Route:",
        cancelReason: "Cancellation Reason", confirmCancel: "Confirm Cancellation",
        tipAmount: "Tip Amount", addTip: "Add Tip",
        promoPlaceholder: "Enter promo code", applyPromo: "Apply",
        promoApplied: "Promo code applied!", invalidPromo: "Invalid code",
        saveLocation: "Save Location", locationName: "Location Name",
        homeLocation: "Home", workLocation: "Work", otherLocation: "Other"
    }
};

let currentLang = 'ht';

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    console.log('ðŸš€ Initializing Gaz Kole...');
    
    // Initialize Firebase (Phase 4)
    await initFirebase();
    
    // Setup all event listeners
    setupLanguageSwitcher();
    setupNavigation();
    setupClientApp();
    setupDriverApp();
    setupAdminDashboard();
    setupChat();
    setupEmergencyFeatures();
    setupRideHistory();
    setupFavorites();
    setupPromoCodes();
    setupNotificationButton();
    
    // Load saved data
    loadUserData();
    loadRideHistory();
    
    // Update UI
    updateDynamicContent();
    
    console.log('âœ… Gaz Kole initialized successfully!');
}

// ============================================
// PHASE 4: BACKEND INTEGRATION - FIREBASE
// ============================================

async function initFirebase() {
    try {
        // Check if Firebase is available
        if (typeof firebase !== 'undefined') {
            firebase.initializeApp(firebaseConfig);
            firebaseAuth = firebase.auth();
            firebaseDb = firebase.firestore();
            
            console.log('âœ… Firebase initialized');
            
            // Setup auth state listener
            firebaseAuth.onAuthStateChanged((user) => {
                if (user) {
                    currentUser = user;
                    console.log('User logged in:', user.uid);
                    syncUserData(user);
                } else {
                    console.log('No user logged in');
                }
            });
            
            // Initialize Cloud Messaging
            initCloudMessaging();
            
            // Initialize Realtime Database for live features
            initRealtimeDatabase();
        } else {
            console.log('ðŸ“± Firebase not available - running in demo mode');
        }
    } catch (error) {
        console.log('Firebase initialization:', error.message);
    }
}

function initCloudMessaging() {
    try {
        if (typeof firebase !== 'undefined' && firebase.messaging) {
            firebaseMessaging = firebase.messaging();
            
            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    console.log('âœ… Notification permission granted');
                    getFCMToken();
                }
            });
            
            firebaseMessaging.onMessage((payload) => {
                handleIncomingNotification(payload);
            });
        }
    } catch (error) {
        console.log('Cloud Messaging:', error.message);
    }
}

function initRealtimeDatabase() {
    // For real-time driver locations and ride updates
    console.log('ðŸ“¡ Realtime Database ready');
}

// Auth Functions (Phase 4)
async function signInWithPhone(phoneNumber) {
    try {
        if (firebaseAuth) {
            // In production, use Firebase Phone Auth
            console.log('Signing in with:', phoneNumber);
            return { success: true };
        }
    } catch (error) {
        console.error('Sign in error:', error);
        return { success: false, error: error.message };
    }
}

async function signUpUser(userData) {
    try {
        if (firebaseDb) {
            await firebaseDb.collection('users').doc(userData.uid).set(userData);
            return { success: true };
        }
    } catch (error) {
        console.error('Sign up error:', error);
        return { success: false, error: error.message };
    }
}

function syncUserData(user) {
    if (firebaseDb) {
        firebaseDb.collection('users').doc(user.uid).onSnapshot((doc) => {
            if (doc.exists) {
                const data = doc.data();
                updateUserUI(data);
            }
        });
    }
}

// Database Operations (Phase 4)
async function saveTripToDatabase(tripData) {
    try {
        if (firebaseDb) {
            const docRef = await firebaseDb.collection('trips').add({
                ...tripData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'pending'
            });
            currentTrip = { id: docRef.id, ...tripData };
            return docRef.id;
        }
    } catch (error) {
        console.error('Error saving trip:', error);
    }
}

async function updateTripStatus(tripId, status) {
    try {
        if (firebaseDb) {
            await firebaseDb.collection('trips').doc(tripId).update({
                status: status,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
    } catch (error) {
        console.error('Error updating trip:', error);
    }
}

async function saveRideHistory(rideData) {
    try {
        if (firebaseDb && currentUser) {
            await firebaseDb.collection('users').doc(currentUser.uid)
                .collection('rideHistory').add({
                    ...rideData,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
        }
    } catch (error) {
        console.error('Error saving ride history:', error);
    }
}

// Real-time Driver Location (Phase 4)
function updateDriverLocation(driverId, location) {
    if (firebaseDb) {
        firebaseDb.collection('drivers').doc(driverId).update({
            location: new firebase.firestore.GeoPoint(location.lat, location.lng),
            lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
        });
    }
}

function subscribeToDriverLocation(driverId, callback) {
    if (firebaseDb) {
        return firebaseDb.collection('drivers').doc(driverId)
            .onSnapshot((doc) => {
                if (doc.exists) {
                    const data = doc.data();
                    if (data.location) {
                        callback({
                            lat: data.location.latitude,
                            lng: data.location.longitude
                        });
                    }
                }
            });
    }
}

// ============================================
// PHASE 1: NEW FEATURES
// ============================================

// Chat System
function setupChat() {
    const chatButton = document.getElementById('chatButton');
    if (chatButton) {
        chatButton.addEventListener('click', openChat);
    }
    
    const closeChat = document.getElementById('closeChat');
    if (closeChat) {
        closeChat.addEventListener('click', closeChatPanel);
    }
    
    const sendMessage = document.getElementById('sendMessage');
    if (sendMessage) {
        sendMessage.addEventListener('click', sendChatMessage);
    }
    
    // Enter key to send
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendChatMessage();
        });
    }
}

function openChat() {
    const chatPanel = document.getElementById('chatPanel');
    if (chatPanel) {
        chatPanel.classList.add('active');
        appState.chatOpen = true;
    }
}

function closeChatPanel() {
    const chatPanel = document.getElementById('chatPanel');
    if (chatPanel) {
        chatPanel.classList.remove('active');
        appState.chatOpen = false;
    }
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (message) {
        const t = translations[currentLang];
        const messageData = {
            id: Date.now(),
            text: message,
            sender: 'client',
            timestamp: new Date().toISOString()
        };
        
        chatMessages.push(messageData);
        renderChatMessage(messageData);
        input.value = '';
        
        // Simulate driver response
        setTimeout(() => {
            const response = {
                id: Date.now() + 1,
                text: currentLang === 'ht' ? 'Mesaj resevwa! ' + message : 
                      currentLang === 'fr' ? 'Message reÃ§u! ' + message : 
                      'Message received! ' + message,
                sender: 'driver',
                timestamp: new Date().toISOString()
            };
            chatMessages.push(response);
            renderChatMessage(response);
        }, 2000);
    }
}

function renderChatMessage(message) {
    const messagesContainer = document.getElementById('chatMessages');
    if (messagesContainer) {
        const messageEl = document.createElement('div');
        messageEl.className = `chat-message ${message.sender}`;
        messageEl.innerHTML = `
            <div class="message-content">${message.text}</div>
            <div class="message-time">${formatTime(message.timestamp)}</div>
        `
        messagesContainer.appendChild(messageEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Emergency Features
function setupEmergencyFeatures() {
    const sosButton = document.getElementById('sosButton');
    if (sosButton) {
        sosButton.addEventListener('click', triggerEmergency);
    }
    
    const shareTripButton = document.getElementById('shareTripButton');
    if (shareTripButton) {
        shareTripButton.addEventListener('click', shareTrip);
    }
    
    const callDriverButton = document.getElementById('callDriverButton');
    if (callDriverButton) {
        callDriverButton.addEventListener('click', callDriver);
    }
}

function triggerEmergency() {
    const t = translations[currentLang];
    if (confirm(currentLang === 'ht' ? 'Ou sure ou vle voye mesaj ijans?' : 
                currentLang === 'fr' ? 'ÃŠtes-vous sÃ»r de vouloir envoyer un message d\'urgence?' : 
                'Are you sure you want to send an emergency message?')) {
        
        // Get emergency contacts from storage
        const emergencyContacts = JSON.parse(localStorage.getItem('emergencyContacts') || '[]');
        
        if (emergencyContacts.length > 0) {
            // Send emergency SMS (simulated)
            console.log('Sending emergency to:', emergencyContacts);
            showNotification(t.emergency, t.emergencySent);
        } else {
            alert(currentLang === 'ht' ? 'Tanpri ajoute yon kontak ijans nan paramÃ¨tres!' : 
                  currentLang === 'fr' ? 'Veuillez ajouter un contact d\'urgence dans les paramÃ¨tres!' : 
                  'Please add an emergency contact in settings!');
        }
    }
}

function shareTrip() {
    if (currentTrip) {
        const t = translations[currentLang];
        const shareText = `${t.shareTripMessage} ${currentTrip.pickup} â†’ ${currentTrip.destination}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Gaz Kole',
                text: shareText
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareText);
            alert(currentLang === 'ht' ? 'Lyen kopye!' : currentLang === 'fr' ? 'Lien copiÃ©!' : 'Link copied!');
        }
    }
}

function callDriver() {
    // Simulated call
    const t = translations[currentLang];
    showNotification(t.callDriver, '+509 XX XX XX XX');
}

// Ride History
function setupRideHistory() {
    const historyButton = document.getElementById('rideHistoryButton');
    if (historyButton) {
        historyButton.addEventListener('click', showRideHistory);
    }
}

function showRideHistory() {
    const modal = document.getElementById('rideHistoryModal');
    if (modal) {
        renderRideHistory();
        modal.style.display = 'flex';
    }
}

function renderRideHistory() {
    const container = document.getElementById('rideHistoryList');
    if (container) {
        if (rideHistory.length === 0) {
            const t = translations[currentLang];
            container.innerHTML = `<div class="no-rides">${t.noRides}</div>`;
        } else {
            container.innerHTML = rideHistory.map(ride => `
                <div class="ride-history-item">
                    <div class="ride-route">${ride.pickup} â†’ ${ride.destination}</div>
                    <div class="ride-details">
                        <span>${formatDate(ride.date)}</span>
                        <span>${ride.price} HTG</span>
                        <span class="ride-status ${ride.status}">${ride.status}</span>
                    </div>
                </div>
            `).join('');
        }
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

// Favorites Locations
function setupFavorites() {
    const saveLocationButtons = document.querySelectorAll('.save-location-btn');
    saveLocationButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.locationType;
            saveFavoriteLocation(type);
        });
    });
}

function saveFavoriteLocation(type) {
    const currentLocation = document.getElementById('currentLocation').value;
    if (currentLocation) {
        const favorites = JSON.parse(localStorage.getItem('favoriteLocations') || '{}');
        favorites[type] = currentLocation;
        localStorage.setItem('favoriteLocations', JSON.stringify(favorites));
        
        const t = translations[currentLang];
        showNotification(t.favorites, currentLang === 'ht' ? 'Lokasyon sove!' : 
                                                currentLang === 'fr' ? 'Lieu sauvegardÃ©!' : 
                                                'Location saved!');
    }
}

// Promo Codes
function setupPromoCodes() {
    const applyPromoButton = document.getElementById('applyPromoButton');
    if (applyPromoButton) {
        applyPromoButton.addEventListener('click', applyPromoCode);
    }
}

function applyPromoCode() {
    const input = document.getElementById('promoCodeInput');
    const code = input.value.trim().toUpperCase();
    
    // Valid promo codes (in production, validate via API)
    const validCodes = {
        'WELCOME50': 0.50,
        'GAZKOLE25': 0.25,
        'FIRSTTRIP': 0.30
    };
    
    const t = translations[currentLang];
    
    if (validCodes[code]) {
        const discount = validCodes[code];
        currentRidePrice = Math.round(currentRidePrice * (1 - discount));
        
        document.getElementById('priceValue').textContent = currentRidePrice + ' HTG';
        
        showNotification(t.promoCode, t.promoApplied);
        input.value = '';
    } else {
        alert(t.invalidPromo);
    }
}

// Cancel Ride
function setupCancelRide() {
    const cancelButton = document.getElementById('cancelRideButton');
    if (cancelButton) {
        cancelButton.addEventListener('click', showCancelDialog);
    }
    
    const confirmCancel = document.getElementById('confirmCancelButton');
    if (confirmCancel) {
        confirmCancel.addEventListener('click', confirmRideCancellation);
    }
}

function showCancelDialog() {
    const modal = document.getElementById('cancelRideModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function confirmRideCancellation() {
    const reason = document.getElementById('cancelReason').value;
    const t = translations[currentLang];
    
    // Update trip status
    if (currentTrip) {
        currentTrip.status = 'cancelled';
        currentTrip.cancelReason = reason;
    }
    
    // Hide modals and reset UI
    document.getElementById('cancelRideModal').style.display = 'none';
    document.getElementById('trackingSection').style.display = 'none';
    document.getElementById('rideOptionsSection').style.display = 'block';
    
    showNotification(t.cancelRide, currentLang === 'ht' ? 'Kous la anile!' : 
                                             currentLang === 'fr' ? 'Trajet annulÃ©!' : 
                                             'Ride cancelled!');
}

// Tip Driver
function setupTipDriver() {
    const tipButtons = document.querySelectorAll('.tip-amount-btn');
    tipButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const amount = parseInt(btn.dataset.amount);
            addDriverTip(amount);
        });
    });
}

function addDriverTip(amount) {
    currentRidePrice += amount;
    const t = translations[currentLang];
    
    document.getElementById('priceValue').textContent = currentRidePrice + ' HTG';
    showNotification(t.tipDriver, currentLang === 'ht' ? `Propina ${amount} HTG ajoute!` : 
                                             currentLang === 'fr' ? `Pourboire de ${amount} HTG ajouté!` : 
                                             `Tip of ${amount} HTG added!`);
}

// ============================================
// PHASE 3: UI/UX ENHANCEMENTS
// ============================================

// Smooth Page Transitions
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    
    // Fade out current page
    pages.forEach(page => {
        if (page.classList.contains('active')) {
            page.style.opacity = '0';
            page.style.transform = 'translateY(20px)';
        }
    });
    
    // Wait for animation then show new page
    setTimeout(() => {
        pages.forEach(page => {
            page.classList.remove('active');
        });
        
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            
            // Fade in new page
            setTimeout(() => {
                targetPage.style.opacity = '1';
                targetPage.style.transform = 'translateY(0)';
            }, 50);
        }
        
        window.scrollTo(0, 0);
        appState.currentPage = pageId;
    }, 300);
}

// Add CSS for transitions
function addTransitionStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .page {
            transition: opacity 0.3s ease, transform 0.3s ease;
            opacity: 1;
            transform: translateY(0);
        }
        
        .page:not(.active) {
            opacity: 0;
            transform: translateY(20px);
            display: none;
        }
        
        .page.active {
            display: block;
        }
        
        /* Skeleton Loading */
        .skeleton {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: skeleton-loading 1.5s infinite;
            border-radius: 4px;
        }
        
        @keyframes skeleton-loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
        
        /* Enhanced Buttons */
        .btn {
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
        }
        
        .btn::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            transition: width 0.6s, height 0.6s;
        }
        
        .btn:active::after {
            width: 300px;
            height: 300px;
        }
        
        /* Card Hover Effects */
        .app-card, .stat-card, .status-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .app-card:hover {
            transform: translateY(-10px) scale(1.02);
        }
        
        /* Bottom Navigation (Mobile) */
        .bottom-nav {
            display: none;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #1A1A1A;
            padding: 10px 0;
            z-index: 1000;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
        }
        
        @media (max-width: 768px) {
            .bottom-nav {
                display: flex;
                justify-content: space-around;
            }
            
            .header .nav {
                display: none;
            }
        }
        
        .bottom-nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            color: #666;
            font-size: 0.8rem;
            text-decoration: none;
            padding: 5px;
        }
        
        .bottom-nav-item.active {
            color: #FFD700;
        }
        
        .bottom-nav-item span:first-child {
            font-size: 1.5rem;
        }
    `;
    document.head.appendChild(style);
}

// Loading States
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="skeleton" style="height: 20px; margin: 10px 0;"></div>
            <div class="skeleton" style="height: 20px; width: 70%; margin: 10px 0;"></div>
            <div class="skeleton" style="height: 20px; width: 50%; margin: 10px 0;"></div>
        `;
    }
}

// Enhanced Toast Notifications
function showNotification(title, body) {
    const toast = document.getElementById('notificationToast');
    const toastTitle = document.getElementById('toastTitle');
    const toastBody = document.getElementById('toastBody');
    
    if (toast && toastTitle && toastBody) {
        toastTitle.textContent = title;
        toastBody.textContent = body;
        toast.style.display = 'block';
        toast.style.animation = 'slideInRight 0.5s ease';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => {
                toast.style.display = 'none';
            }, 500);
        }, 5000);
    }
    
    // Increment notification count
    incrementNotificationCount();
}

// ============================================
// PHASE 2: BUG FIXES
// ============================================

// Fix map initialization
async function initClientMap() {
    try {
        userPosition = await getCurrentPosition();
        
        driverPosition = {
            lat: userPosition.lat + 0.005,
            lng: userPosition.lng + 0.003
        };
        
        if (typeof mapboxgl !== 'undefined' && MAPBOX_ACCESS_TOKEN !== "YOUR_MAPBOX_ACCESS_TOKEN") {
            mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
            
            map = new mapboxgl.Map({
                container: 'clientMap',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [userPosition.lng, userPosition.lat],
                zoom: 14
            });
            
            // Add markers
            new mapboxgl.Marker({ color: '#FFD700' })
                .setLngLat([userPosition.lng, userPosition.lat])
                .setPopup(new mapboxgl.Popup().setHTML('<strong>Ou</strong>'))
                .addTo(map);
            
            driverMarker = new mapboxgl.Marker({ color: '#00C853' })
                .setLngLat([driverPosition.lng, driverPosition.lat])
                .setPopup(new mapboxgl.Popup().setHTML('<strong>ChofÃ¨</strong>'))
                .addTo(map);
            
            startDriverSimulation();
        } else {
            // Fallback: Show placeholder
            document.getElementById('clientMap').innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #e5e3df; flex-direction: column;">
                    <div style="font-size: 3rem;">ðŸ—ºï¸</div>
                    <p style="margin-top: 10px;">Kat ap chaje...</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Map initialization error:', error);
    }
}

// Fix payment modal
function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Fix language switch
function changeLanguage(lang) {
    currentLang = lang;
    const t = translations[lang];
    
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.dataset.translate;
        if (t[key]) {
            el.textContent = t[key];
        }
    });
    
    document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
        const key = el.dataset.translatePlaceholder;
        if (t[key]) {
            el.placeholder = t[key];
        }
    });
    
    updateDynamicContent();
}

// ============================================
// GEOLOCATION FUNCTIONS
// ============================================

function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    resolve({ lat: 18.5944, lng: -72.3074 }); // Default: Port-au-Prince
                }
            );
        } else {
            resolve({ lat: 18.5944, lng: -72.3074 });
        }
    });
}

async function initDriverMap() {
    try {
        const position = await getCurrentPosition();
        
        if (typeof mapboxgl !== 'undefined' && MAPBOX_ACCESS_TOKEN !== "YOUR_MAPBOX_ACCESS_TOKEN") {
            mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
            
            map = new mapboxgl.Map({
                container: 'driverMap',
                style: 'mapbox://styles/mapbox/navigation-day-v1',
                center: [position.lng, position.lat],
                zoom: 15
            });
            
            new mapboxgl.Marker({ color: '#00C853' })
                .setLngLat([position.lng, position.lat])
                .addTo(map);
            
            watchId = navigator.geolocation.watchPosition((pos) => {
                map.flyTo({ center: [pos.coords.longitude, pos.coords.latitude] });
            });
        } else {
            document.getElementById('driverMap').innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #e5e3df; flex-direction: column;">
                    <div style="font-size: 3rem;">ðŸ—ºï¸</div>
                    <p style="margin-top: 10px;">Navigasyon...</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Driver map error:', error);
    }
}

function startDriverSimulation() {
    let simulationInterval = setInterval(() => {
        if (driverPosition && userPosition) {
            const latDiff = userPosition.lat - driverPosition.lat;
            const lngDiff = userPosition.lng - driverPosition.lng;
            
            if (Math.abs(latDiff) > 0.0005 || Math.abs(lngDiff) > 0.0005) {
                driverPosition.lat += latDiff * 0.1;
                driverPosition.lng += lngDiff * 0.1;
                
                if (driverMarker) {
                    driverMarker.setLngLat([driverPosition.lng, driverPosition.lat]);
                }
                
                const etaElement = document.getElementById('etaValue');
                if (etaElement) {
                    const currentEta = parseInt(etaElement.textContent) || 5;
                    if (currentEta > 1) {
                        etaElement.textContent = (currentEta - 1) + ' minit';
                    }
                }
            } else {
                clearInterval(simulationInterval);
                showNotification(
                    currentLang === 'ht' ? 'ChofÃ¨ a rive!' : 
                    currentLang === 'fr' ? 'Le chauffeur est arrivÃ©!' : 'Driver has arrived!',
                    currentLang === 'ht' ? 'ChofÃ¨ a ap tann ou.' : 
                    currentLang === 'fr' ? 'Le chauffeur vous attend.' : 'Driver is waiting for you.'
                );
            }
        }
    }, 3000);
}

function stopGeolocation() {
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
}

// ============================================
// NOTIFICATION FUNCTIONS
// ============================================

function getFCMToken() {
    if (firebaseMessaging) {
        firebaseMessaging.getToken().then((token) => {
            console.log('FCM Token:', token);
        }).catch((error) => {
            console.log('Error getting token:', error);
        });
    }
}

function handleIncomingNotification(payload) {
    if (payload.notification) {
        showNotification(payload.notification.title, payload.notification.body);
    }
    incrementNotificationCount();
}

function setupNotificationButton() {
    const btn = document.getElementById('notificationBtn');
    if (btn) {
        btn.addEventListener('click', () => {
            showNotification(
                currentLang === 'ht' ? 'Nouvo notifikasyon!' : 
                currentLang === 'fr' ? 'Nouvelle notification!' : 'New notification!',
                currentLang === 'ht' ? 'Ou gen yon nouvo mesaj.' : 
                currentLang === 'fr' ? 'Vous avez un nouveau message.' : 'You have a new message.'
            );
        });
    }
}

function incrementNotificationCount() {
    notificationCount++;
    const badge = document.getElementById('notificationBadge');
    if (badge) {
        badge.textContent = notificationCount;
        badge.style.display = 'flex';
    }
}

// ============================================
// PAYMENT FUNCTIONS
// ============================================

function openPaymentModal(method, amount) {
    selectedPaymentMethod = method;
    currentRidePrice = amount;
    
    const modal = document.getElementById('paymentModal');
    const methodName = document.getElementById('paymentMethodName');
    const amountEl = document.getElementById('paymentAmount');
    
    if (modal && methodName && amountEl) {
        const methodLabel = method === 'moncash' ? 'MonCash' : method === 'natcash' ? 'NatCash' : 'Kash';
        methodName.textContent = methodLabel;
        amountEl.textContent = amount + ' HTG';
        modal.style.display = 'flex';
    }
}

async function confirmPayment() {
    const codeInput = document.getElementById('paymentCode');
    const code = codeInput ? codeInput.value : '';
    
    if (!code && selectedPaymentMethod !== 'cash') {
        alert(currentLang === 'ht' ? 'Tanpri antre kÃ²d peman!' : 
              currentLang === 'fr' ? 'Veuillez entrer le code de paiement!' : 
              'Please enter payment code!');
        return;
    }
    
    const btn = document.getElementById('confirmPayment');
    if (btn) {
        btn.disabled = true;
        btn.textContent = currentLang === 'ht' ? 'Peman k ap fÃ¨t...' : 
                         currentLang === 'fr' ? 'Paiement en cours...' : 'Processing payment...';
    }
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const t = translations[currentLang];
    alert(currentLang === 'ht' ? 'Peman siksÃ¨!' : 
          currentLang === 'fr' ? 'Paiement rÃ©ussi!' : 
          'Payment successful!');
    
    closePaymentModal();
    
    // Proceed to tracking
    document.getElementById('rideOptionsSection').style.display = 'none';
    document.getElementById('trackingSection').style.display = 'block';
    
    setTimeout(initClientMap, 500);
    
    if (btn) {
        btn.disabled = false;
        btn.textContent = t.confirmPayment;
    }
}

// ============================================
// LANGUAGE & NAVIGATION
// ============================================

function setupLanguageSwitcher() {
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.dataset.lang;
            changeLanguage(lang);
            
            langBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav a');
    const appCards = document.querySelectorAll('.app-card');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.dataset.target;
            showPage(target);
        });
    });
    
    appCards.forEach(card => {
        card.addEventListener('click', function() {
            const target = this.dataset.target;
            showPage(target);
        });
    });
}

function updateDynamicContent() {
    const t = translations[currentLang];
    
    updateAppFeatures('client-features', t.clientFeatures || getDefaultFeatures('client'));
    updateAppFeatures('driver-features', t.driverFeatures || getDefaultFeatures('driver'));
    updateAppFeatures('admin-features', t.adminFeatures || getDefaultFeatures('admin'));
}

function getDefaultFeatures(type) {
    const features = {
        client: ["Kreye kont", "Antre kote ou ye", "Chwazi destinasyon", "Wè pri kous la", "Chwazi moto oswa taxi", "Swiv chofè a sou kat", "Peye MonCash / NatCash", "Evalye chofè a"],
        driver: ["Enskripsyon chofè", "Upload dokiman", "Resevwa demand kous", "Aksepte / Refize", "Navigasyon GPS", "Wè lajan li touche", "Retire lajan"],
        admin: ["Jere chofè", "Jere kliyan", "Wè tout kous", "Kontwole peman", "Statistiques", "Bloke kont si gen pwoblèm"]
    };
    return features[type] || [];
}

function updateAppFeatures(elementId, features) {
    const container = document.getElementById(elementId);
    if (container) {
        container.innerHTML = features.map(f => `<li>${f}</li>`).join('');
    }
}

// ============================================
// CLIENT APP
// ============================================

function setupClientApp() {
    const rideOptions = document.querySelectorAll('.ride-option');
    const paymentMethods = document.querySelectorAll('.payment-method');
    const calculateBtn = document.getElementById('calculatePrice');
    const confirmBtn = document.getElementById('confirmRide');
    
    rideOptions.forEach(option => {
        option.addEventListener('click', function() {
            rideOptions.forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
            appState.selectedVehicle = this.dataset.vehicle;
        });
    });
    
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            paymentMethods.forEach(m => m.classList.remove('selected'));
            this.classList.add('selected');
            appState.selectedPayment = this.dataset.payment;
        });
    });
    
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateRidePrice);
    }
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', confirmRideRequest);
    }
    
    setupCancelRide();
    setupTipDriver();
    
    const ratingStars = document.querySelectorAll('.rating span');
    ratingStars.forEach((star, index) => {
        star.addEventListener('click', function() {
            ratingStars.forEach((s, i) => {
                s.classList.toggle('active', i <= index);
            });
        });
    });
}

function calculateRidePrice() {
    const currentLocation = document.getElementById('currentLocation').value;
    const destination = document.getElementById('destination').value;
    const priceDisplay = document.getElementById('priceDisplay');
    const rideOptionsSection = document.getElementById('rideOptionsSection');
    
    if (!currentLocation || !destination) {
        alert(currentLang === 'ht' ? 'Tanpri rantre kote ou ye ak destinasyon!' : 
              currentLang === 'fr' ? 'Veuillez entrer votre position et destination!' : 
              'Please enter your location and destination!');
        return;
    }
    
    const vehicle = appState.selectedVehicle || 'moto';
    const baseFare = APP_CONFIG.baseFare[vehicle];
    const perKm = APP_CONFIG.perKm[vehicle];
    
    const distance = Math.floor(Math.random() * 20) + 1;
    const price = baseFare + (distance * perKm);
    
    currentRidePrice = price;
    
    if (priceDisplay) {
        document.getElementById('priceValue').textContent = price + ' HTG';
        priceDisplay.parentElement.style.display = 'block';
    }
    
    if (rideOptionsSection) {
        rideOptionsSection.style.display = 'block';
    }
}

function confirmRideRequest() {
    if (!appState.selectedPayment) {
        alert(currentLang === 'ht' ? 'Tanpri chwazi metÃ²d peman!' : 
              currentLang === 'fr' ? 'Veuillez choisir un mode de paiement!' : 
              'Please select a payment method!');
        return;
    }
    
    if (appState.selectedPayment === 'cash') {
        document.getElementById('rideOptionsSection').style.display = 'none';
        document.getElementById('trackingSection').style.display = 'block';
        setTimeout(initClientMap, 500);
    } else {
        openPaymentModal(appState.selectedPayment, currentRidePrice);
    }
    
    const tripData = {
        pickup: document.getElementById('currentLocation').value,
        destination: document.getElementById('destination').value,
        vehicle: appState.selectedVehicle,
        price: currentRidePrice,
        paymentMethod: appState.selectedPayment,
        status: 'pending'
    };
    saveTripToDatabase(tripData);
}

// ============================================
// DRIVER APP
// ============================================

function setupDriverApp() {
    const statusToggle = document.getElementById('statusToggle');
    const acceptBtn = document.getElementById('acceptRide');
    const declineBtn = document.getElementById('declineRide');
    const createAccountBtn = document.getElementById('createDriverAccount');
    
    if (statusToggle) {
        statusToggle.addEventListener('change', function() {
            appState.isDriverOnline = this.checked;
            const statusText = document.getElementById('statusText');
            const t = translations[currentLang];
            
            if (statusText) {
                statusText.textContent = this.checked ? t.online : t.offline;
                statusText.style.color = this.checked ? '#00C853' : '#ff4444';
            }
            
            if (this.checked) {
                showNotification(t.online, currentLang === 'ht' ? 'Ou pral resevwa demand kous.' : 
                                                    currentLang === 'fr' ? 'Vous allez recevoir des demandes de trajet.' : 
                                                    'You will receive ride requests.');
                setTimeout(simulateRideRequest, 3000);
            } else {
                stopGeolocation();
            }
        });
    }
    
    if (acceptBtn) {
        acceptBtn.addEventListener('click', acceptRide);
    }
    
    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            document.getElementById('rideRequest').classList.remove('active');
        });
    }

    if (createAccountBtn) {
        createAccountBtn.addEventListener('click', createDriverAccount);
    }
    
    const startRideBtn = document.getElementById('startRideBtn');
    if (startRideBtn) {
        startRideBtn.addEventListener('click', startRide);
    }
    
    const completeRideBtn = document.getElementById('completeRideBtn');
    if (completeRideBtn) {
        completeRideBtn.addEventListener('click', completeRide);
    }

    renderDriverAccountState();
}

function createDriverAccount() {
    const name = document.getElementById('driverName')?.value.trim();
    const phone = document.getElementById('driverPhone')?.value.trim();
    const email = document.getElementById('driverEmail')?.value.trim();
    const password = document.getElementById('driverPassword')?.value;
    const vehicleType = document.getElementById('driverVehicleType')?.value;
    const plate = document.getElementById('driverPlate')?.value.trim();

    if (!name || !phone || !email || !password || !vehicleType || !plate) {
        alert(currentLang === 'ht' ? 'Tanpri ranpli tout chan yo.' :
              currentLang === 'fr' ? 'Veuillez remplir tous les champs.' :
              'Please fill in all fields.');
        return;
    }

    const driverAccount = {
        name,
        phone,
        email,
        vehicleType,
        plateNumber: plate,
        createdAt: new Date().toISOString()
    };

    localStorage.setItem('gazkole_driver_account', JSON.stringify(driverAccount));
    renderDriverAccountState();

    alert(currentLang === 'ht' ? 'Kont chofe a kreye ak sikse.' :
          currentLang === 'fr' ? 'Le compte chauffeur a ete cree avec succes.' :
          'Driver account created successfully.');
}

function renderDriverAccountState() {
    const messageEl = document.getElementById('driverAccountMessage');
    const createBtn = document.getElementById('createDriverAccount');
    const savedAccount = localStorage.getItem('gazkole_driver_account');

    if (!messageEl || !createBtn) return;

    if (!savedAccount) {
        messageEl.style.display = 'none';
        createBtn.disabled = false;
        createBtn.textContent = currentLang === 'ht' ? 'Kreye Kont' :
                                currentLang === 'fr' ? 'Creer un compte' :
                                'Create Account';
        return;
    }

    const account = JSON.parse(savedAccount);
    messageEl.textContent = `Kont aktif: ${account.name} (${account.vehicleType.toUpperCase()})`;
    messageEl.style.display = 'block';
    createBtn.disabled = true;
    createBtn.textContent = currentLang === 'ht' ? 'Kont Kreye' :
                            currentLang === 'fr' ? 'Compte Cree' :
                            'Account Created';
}

function simulateRideRequest() {
    setTimeout(() => {
        const rideRequest = document.getElementById('rideRequest');
        if (rideRequest) {
            rideRequest.classList.add('active');
        }
    }, 5000);
}

function acceptRide() {
    document.getElementById('rideRequest').classList.remove('active');
    document.getElementById('rideInProgress').style.display = 'block';
    appState.hasActiveRide = true;
    
    setTimeout(initDriverMap, 500);
    
    const t = translations[currentLang];
    showNotification(t.accept, currentLang === 'ht' ? 'ChofÃ¨ a pral vini jwenn ou.' : 
                                       currentLang === 'fr' ? 'Le chauffeur viendra vous chercher.' : 
                                       'Driver is coming to pick you up.');
}

function startRide() {
    const t = translations[currentLang];
    const rideInProgress = document.getElementById('rideInProgress');
    if (rideInProgress) {
        rideInProgress.innerHTML = `
            <h3>ðŸš— ${t.rideInProgress}</h3>
            <div class="map-container"><div id="driverMap"></div></div>
            <div style="text-align: center; margin: 15px 0;">
                <p><strong>${t.navigateTo}</strong> <span>AeropÃ² IntÃ¨nasyonal</span></p>
                <p>${t.distanceRemaining} <strong>8.5 km</strong></p>
            </div>
            <button id="completeRideBtn" class="btn btn-secondary" style="width: 100%;">${t.completeRide}</button>
        `;
        
        setTimeout(initDriverMap, 100);
        
        document.getElementById('completeRideBtn').addEventListener('click', completeRide);
    }
}

function completeRide() {
    const t = translations[currentLang];
    const rideInProgress = document.getElementById('rideInProgress');
    
    if (rideInProgress) {
        rideInProgress.innerHTML = `
            <h3>âœ… ${currentLang === 'ht' ? 'Kous la fini!' : currentLang === 'fr' ? 'Trajet terminÃ©!' : 'Ride completed!'}</h3>
            <p>${t.tripCompleted}</p>
            <div style="text-align: center; margin: 20px 0;">
                <p style="font-size: 1.5rem; color: var(--primary-green);"><strong>+450 HTG</strong></p>
                <p>${t.earnings}</p>
            </div>
            <button class="btn btn-primary" onclick="location.reload()">OK</button>
        `;
    }
    
    rideHistory.push({
        id: Date.now(),
        pickup: 'Rue Montagne',
        destination: 'AeropÃ²',
        price: 450,
        status: 'completed',
        date: new Date().toISOString()
    });
    saveRideHistory(rideHistory[rideHistory.length - 1]);
    
    stopGeolocation();
}

// ============================================
// ADMIN DASHBOARD
// ============================================

function setupAdminDashboard() {
    console.log('Admin dashboard ready');
}

// ============================================
// DATA PERSISTENCE
// ============================================

function loadUserData() {
    const savedLang = localStorage.getItem('gazkole_lang');
    if (savedLang) {
        currentLang = savedLang;
    }
    
    const favorites = localStorage.getItem('favoriteLocations');
    if (favorites) {
        console.log('Loaded favorites:', JSON.parse(favorites));
    }

    renderDriverAccountState();
}

function loadRideHistory() {
    const savedHistory = localStorage.getItem('rideHistory');
    if (savedHistory) {
        rideHistory = JSON.parse(savedHistory);
    }
}

function updateUserUI(data) {
    console.log('Updating user UI with:', data);
}

window.addEventListener('beforeunload', () => {
    localStorage.setItem('gazkole_lang', currentLang);
    localStorage.setItem('rideHistory', JSON.stringify(rideHistory));
});

// ============================================
// INITIALIZE ENHANCED STYLES
// ============================================

addTransitionStyles();




