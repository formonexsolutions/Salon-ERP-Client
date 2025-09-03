const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

// Define the Plan schema (assuming it matches your model)
const planSchema = new mongoose.Schema({
    PlanId: { type: String, required: true, unique: true },
    PlanName: { type: String, required: true },
    Duration: { type: Number, required: true },
    Amount: { type: Number, required: true },
    Feature1: { type: String, required: true },
    Feature2: { type: String, required: true },
    CreatedBy: { type: String, required: true },
    CreatedAt: { type: Date, default: Date.now },
    ModifiedBy: { type: String, required: true },
    ModifiedAt: { type: Date, default: Date.now },
    Status: { type: String, default: 'AA' }
});

const Plan = mongoose.model('Plan', planSchema);

const plansToCreate = [
    {
        PlanId: 'PlanId001',
        PlanName: 'Basic Salon Plan',
        Duration: 30,
        Amount: 999,
        Feature1: 'Up to 5 staff members management and basic appointment scheduling',
        Feature2: 'Customer database management and basic billing system integration',
        CreatedBy: 'superadmin',
        ModifiedBy: 'superadmin',
        Status: 'AA'
    },
    {
        PlanId: 'PlanId002',
        PlanName: 'Professional Salon Plan',
        Duration: 90,
        Amount: 2499,
        Feature1: 'Up to 15 staff members with advanced scheduling and inventory management',
        Feature2: 'SMS notifications, detailed reports, and payment gateway integration',
        CreatedBy: 'superadmin',
        ModifiedBy: 'superadmin',
        Status: 'AA'
    },
    {
        PlanId: 'PlanId003',
        PlanName: 'Enterprise Salon Plan',
        Duration: 365,
        Amount: 8999,
        Feature1: 'Unlimited staff, multi-branch management, and advanced analytics dashboard',
        Feature2: 'WhatsApp integration, custom branding, priority support, and API access',
        CreatedBy: 'superadmin',
        ModifiedBy: 'superadmin',
        Status: 'AA'
    }
];

async function createPlans() {
    try {
        console.log('Creating subscription plans...');
        
        for (const planData of plansToCreate) {
            try {
                // Check if plan already exists
                const existingPlan = await Plan.findOne({ PlanId: planData.PlanId });
                if (existingPlan) {
                    console.log(`Plan ${planData.PlanId} already exists, skipping...`);
                    continue;
                }
                
                const plan = new Plan(planData);
                await plan.save();
                console.log(`✅ Created plan: ${planData.PlanName} (${planData.PlanId})`);
            } catch (error) {
                console.error(`❌ Error creating plan ${planData.PlanId}:`, error.message);
            }
        }
        
        console.log('\n📋 All plans creation process completed!');
        
        // Display created plans
        const allPlans = await Plan.find({}).sort({ PlanId: 1 });
        console.log('\n📊 Current plans in database:');
        allPlans.forEach(plan => {
            console.log(`- ${plan.PlanName} (${plan.PlanId}): ${plan.Duration} days, ₹${plan.Amount}`);
        });
        
    } catch (error) {
        console.error('Error in createPlans:', error);
    } finally {
        mongoose.connection.close();
        console.log('\nDatabase connection closed.');
    }
}

createPlans();
