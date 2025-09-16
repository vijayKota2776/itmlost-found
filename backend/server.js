const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/campus-survey', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// MongoDB Connection Event Listeners
mongoose.connection.on('connected', () => {
  console.log('✅ Connected to MongoDB successfully!');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 MongoDB disconnected');
});

// Survey Response Schema
const surveySchema = new mongoose.Schema({
  // Demographics
  studentId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  year: { type: String, required: true },
  department: { type: String, required: true },
  program: { type: String, required: true },
  accommodation: String,
  
  // Academic Resources
  libraryUsage: String,
  libraryNeeds: [String],
  labAccess: Number,
  labNeeds: [String],
  softwareNeeds: [String],
  
  // Digital Resources
  internetQuality: Number,
  deviceAccess: [String],
  digitalPlatforms: [String],
  
  // Campus Facilities
  diningNeeds: [String],
  recreationNeeds: [String],
  transportNeeds: [String],
  healthcareNeeds: [String],
  
  // Priorities & Budget
  topPriorities: [String],
  budgetAllocation: {
    academics: { type: Number, default: 0 },
    facilities: { type: Number, default: 0 },
    technology: { type: Number, default: 0 },
    support: { type: Number, default: 0 },
    infrastructure: { type: Number, default: 0 }
  },
  
  // Engagement
  suggestions: String,
  volunteerInterest: { type: Boolean, default: false },
  contactForInterview: { type: Boolean, default: false },
  
  // Metadata
  submittedAt: { type: Date, default: Date.now },
  deviceInfo: Object,
  userAgent: String
});

const Survey = mongoose.model('Survey', surveySchema);

// Feedback Schema (keep existing)
const feedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  category: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  userAgent: String,
  status: { type: String, default: 'new' },
  response: String
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// API Routes
app.post('/api/survey', async (req, res) => {
  try {
    const survey = new Survey(req.body);
    await survey.save();
    console.log('📊 Survey submitted:', survey.name, survey.department);
    res.status(201).json({ 
      message: 'Survey submitted successfully!', 
      id: survey._id 
    });
  } catch (error) {
    console.error('❌ Error saving survey:', error);
    res.status(400).json({ error: error.message });
  }
});

// Keep existing feedback route
app.post('/api/feedback', async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    console.log('💬 Feedback submitted:', feedback.name, feedback.category);
    res.status(201).json({ 
      message: 'Feedback submitted successfully!', 
      id: feedback._id 
    });
  } catch (error) {
    console.error('❌ Error saving feedback:', error);
    res.status(400).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Campus Survey API is running!',
    timestamp: new Date(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Analytics endpoints for report generation
app.get('/api/analytics/overview', async (req, res) => {
  try {
    const total = await Survey.countDocuments();
    const byDepartment = await Survey.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);
    const byYear = await Survey.aggregate([
      { $group: { _id: '$year', count: { $sum: 1 } } }
    ]);
    
    res.json({ total, byDepartment, byYear });
  } catch (error) {
    console.error('❌ Analytics overview error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get interview candidates for case study
app.get('/api/analytics/interview-candidates', async (req, res) => {
  try {
    const candidates = await Survey.find({ 
      contactForInterview: true 
    }).select('name email department year topPriorities suggestions submittedAt');
    res.json(candidates);
  } catch (error) {
    console.error('❌ Interview candidates error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get detailed analytics for reporting
app.get('/api/analytics/detailed', async (req, res) => {
  try {
    const priorityAnalysis = await Survey.aggregate([
      { $unwind: '$topPriorities' },
      { $group: { _id: '$topPriorities', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const budgetAnalysis = await Survey.aggregate([
      { $group: { 
          _id: null, 
          avgAcademics: { $avg: '$budgetAllocation.academics' },
          avgFacilities: { $avg: '$budgetAllocation.facilities' },
          avgTechnology: { $avg: '$budgetAllocation.technology' },
          avgSupport: { $avg: '$budgetAllocation.support' },
          avgInfrastructure: { $avg: '$budgetAllocation.infrastructure' }
        }
      }
    ]);
    
    res.json({ priorityAnalysis, budgetAnalysis });
  } catch (error) {
    console.error('❌ Detailed analytics error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all feedback (for admin)
app.get('/api/feedback', async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .sort({ timestamp: -1 })
      .limit(100);
    res.json(feedback);
  } catch (error) {
    console.error('❌ Get feedback error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get feedback stats
app.get('/api/feedback/stats', async (req, res) => {
  try {
    const totalFeedback = await Feedback.countDocuments();
    const averageRating = await Feedback.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);
    const categoryStats = await Feedback.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    res.json({
      total: totalFeedback,
      averageRating: averageRating[0]?.avgRating || 0,
      categories: categoryStats
    });
  } catch (error) {
    console.error('❌ Feedback stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`📊 Campus Survey API running on port ${PORT}`);
  console.log(`🔗 Analytics: http://localhost:${PORT}/api/analytics/overview`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
});
